const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

//Route for checking if the user's email already exist in the database
router.post("/checkEmail", (req, res) => {

	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

//Route for User Registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));

});


//User Authentication
router.post("/login", (req,res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController))
});


// Route for retrieving user details
// The "auth.verity" acts as a middleware to ensure that the user is logged in before they can retrieve details
router.post("/details", auth.verify, (req, res) => {
	console.log(req.headers);

	// Uses the "decode" method defined in the "auth.js" file to retrieve the user information from the token passing the "token" from the request header as an argument
	const userData = auth.decode(req.headers.authorization);
	/*
		{
		  id: '634015b461e9860026ee3c44',
		  email: 'janehufano@mail.com',
		  isAdmin: false,
		  iat: 1665406450
		}
	*/
	console.log(userData);
	console.log(req.headers.authorization);

	// Provides the user's ID for the getProfile controller method
	userController.getProfile({id : userData.id}).then(resultFromController => res.send(resultFromController));

});




//Route to enroll user to a course
router.post("/enroll", auth.verify, (req, res) => {


	let data = {
		userId: auth.decode(req.headers.authorization).id,
		courseId: req.body.courseId,
		isAdmin: auth.decode(req.headers.authorization).isAdmin

	}

	userController.enroll(data).then(resultFromController => res.send(resultFromController));

});




module.exports = router;
