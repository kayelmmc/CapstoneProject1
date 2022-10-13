const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require('../auth.js');

//Route for creating a course - Solution 1
router.post("/", auth.verify, (req, res) => {

	const isAdmin = auth.decode(req.headers.authorization).isAdmin
	console.log(isAdmin);

	if(isAdmin) {
		courseController.addCourse(req.body).then(resultFromController => res.send(resultFromController));
	} else {
		res.send(false);
	}
	

});




//Route for retrieving all the courses
router.get("/all", (req, res) => {

	courseController.getAllCourses().then(resultFromController => res.send(resultFromController))

});


//Route for retrieving all the ACTIVE courses
router.get("/", (req, res) => {

	courseController.getAllActive().then(resultFromController => res.send(resultFromController));

});


//Route for retrieving specific course
// Creating a route using the "/:parameterName" creates a dynamic route, meaning the url is not static and changes depending on the information provided in the url
router.get("/:courseId", (req, res) => {
	console.log(req.params.courseId)
	console.log(req.params)


	// Since the course ID will be sent via the URL, we cannot retrieve it from the request body
	// We can however retrieve the course ID by accessing the request's "params" property which contains all the parameters provided via the url
			// Example: URL - http://localhost:4000/courses/613e926a82198824c8c4ce0e
			// The course Id is "613e926a82198824c8c4ce0e" which is passed via the url that corresponds to the "courseId" in the route
	courseController.getCourse(req.params).then(resultFromController => res.send(resultFromController));

});


//Route for Updating a course
// JWT verification is needed for this route to ensure that a user is logged in before updating a course
router.put("/:courseId", auth.verify, (req, res) => {

	const userData = auth.decode(req.headers.authorization)

	courseController.updateCourse(req.params, req.body, userData).then(resultFromController => res.send(resultFromController));

});





router.put('/:courseId/archive', auth.verify, (req, res) => {

	console.log(req.params)

	const data = {
		courseId : req.params.courseId,
		payload : auth.decode(req.headers.authorization).isAdmin
	}

	courseController.archiveCourse(data, req.body).then(resultFromController => res.send(resultFromController))
});




module.exports = router;




