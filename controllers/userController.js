const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const auth = require("../auth");


//Check if email exists
module.exports.checkEmailExists = (reqBody) => {

	return User.find({email: reqBody.email}).then(result => {

		if(result.length > 0) {
			return true
		} else {
			return false
		}

	})
}








//Controller for User Registration
module.exports.registerUser = (reqBody) => {

	let newUser = new User({

		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		//bcrypt.hashSync(<dataTobeHash>, <saltRound>)
		// 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
		password: bcrypt.hashSync(reqBody.password, 10)
	});


	return newUser.save().then((user, error) => {

		if(error) {
			return false
		} else {
			return true
		}

	})
}







//User Authentication
module.exports.loginUser = (reqBody) => {

	return User.findOne({email: reqBody.email}).then(result => {

		if(result == null) {
			
			return false

		} else {

			// Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
			// The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			//bcrypt.compareSync(<dataTobeCompare>, <dataFromDB>)


			// If the passwords match/result of the above code is true
			if(isPasswordCorrect) {

				console.log(result)

				// Generate an access token
				// Uses the "createAccessToken" method defined in the "auth.js" file
				// Returning an object back to the frontend application is common practice to ensure information is properly labeled and real world examples normally return more complex information represented by objects
				return { access: auth.createAccessToken(result)}

			// Passwords do not match	
			} else {

				return false
			}
		}

	})
}



// Retrieve user details

module.exports.getProfile = (data) => {

	return User.findById(data.id).then(result => {

		// Changes the value of the user's password to an empty string when returned to the frontend
		// Not doing so will expose the user's password which will also not be needed in other parts of our application
		// Unlike in the "register" method, we do not need to call the mongoose "save" method on the model because we will not be changing the password of the user in the database but only the information that we will be sending back to the frontend application
		result.password = "";

		// Returns the user information with the password as an empty string
		return result;

	});

};






//Enroll user to a class
module.exports.enroll = async (data) => {

	if (data.isAdmin === true) {
		return false
	} else {

		let isUserUpdated = await User.findById(data.userId).then( user => {

			user.enrollments.push({courseId: data.courseId});

			return user.save().then( (user, error) => {

				if(error) {
					return false
				} else {
					return true
				
				}
		
			});
		});


		let isCourseUpdated = await Course.findById(data.courseId).then(course => {

				course.enrollees.push({userId: data.userId})

				return course.save().then((course, error) => {

					if(error) {
						return false

					} else {
						
						return true
					}
				});

		});



		if(isUserUpdated && isCourseUpdated) {

			return true

		} else {

			return false
		}



	}


}
