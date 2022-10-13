const jwt = require("jsonwebtoken");
// User defined string data that will be used to create our JSON web tokens
// Used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword
const secret = "CourseBookingAPI";


//JSON Web Tokens

//Token Creation
module.exports.createAccessToken = (user) => {
	console.log(user)
	/*
		{
		  _id: new ObjectId("634015b461e9860026ee3c44"),
		  firstName: 'Jane',
		  lastName: 'Hufano',
		  email: 'janehufano@mail.com',
		  password: '$2b$10$jgneYUAwtGwpbfY4VwqNg.5lFOekR.v1AS3kJlxNhX54.eVlp/Bd2',
		  isAdmin: false,
		  mobileNo: '09123456789',
		  enrollments: [],
		  __v: 0
		}
	*/
	// The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	//Generate a token
	// Generate a JSON web token using the jwt's sign method
	// Generates the token using the form data and the secret code with no additional options provided
	return jwt.sign(data, secret, {})

}



//Token Verification
module.exports.verify = (req, res, next) => {

	// The token is retrieved from the request header
	// This can be provided in postman under
			// Authorization > Bearer Token
	let token = req.headers.authorization

	// Token received and is not undefined
	if (typeof token !== "undefined" ) {

		console.log(token)
		/*
			Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDAxNWI0NjFlOTg2MDAyNmVlM2M0NCIsImVtYWlsIjoiamFuZWh1ZmFub0BtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NjU0MDI2MzJ9.QgKiDDAUAulZ00ei-YbzY7TnFbkbsH2dSOY_pguBM6o
		*/

		// The "slice" method takes only the token from the information sent via the request header
		// The token sent is a type of "Bearer" token which when recieved contains the word "Bearer " as a prefix to the string
		// This removes the "Bearer " prefix and obtains only the token for verification
		token = token.slice(7, token.length);

		console.log(token)
		/*
			eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDAxNWI0NjFlOTg2MDAyNmVlM2M0NCIsImVtYWlsIjoiamFuZWh1ZmFub0BtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NjU0MDI2MzJ9.QgKiDDAUAulZ00ei-YbzY7TnFbkbsH2dSOY_pguBM6o
		*/

		// Validate the token using the "verify" method decrypting the token using the secret code
		return jwt.verify(token, secret, (err, data) => {

			// If JWT is not valid
			if(err) {
				return res.send({auth: "failed"})

			// If JWT is valid	
			} else {

				// Allows the application to proceed with the next middleware function/callback function in the route
				// The verify method will be used as a middleware in the route to verify the token before proceeding to the function that invokes the controller function
				next();
			}

		})


	// Token does not exist
	} else {

		return res.send({auth: "failed"});
	}

}




//Token Decryption
module.exports.decode = (token) => {

	// Token received and is not undefined
	if (typeof token !== "undefined") {

		// Retrieves only the token and removes the "Bearer " prefix
		token = token.slice(7, token.length);


		return jwt.verify(token, secret, (err, data) => {

				if(err) {
					return null

				} else {

					// The "decode" method is used to obtain the information from the JWT
					// The "{complete:true}" option allows us to return additional information from the JWT token
					// Returns an object with access to the "payload" property which contains user information stored when the token was generated
					// The payload contains information provided in the "createAccessToken" method defined above (e.g. id, email and isAdmin)
					return jwt.decode(token, {complete: true}).payload;
				}

		})

	// Token does not exist
	} else {

		return null
	}

}
