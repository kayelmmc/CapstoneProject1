const Course = require("../models/Course");
const User = require("../models/User");


//Create a New Course - Solution 1
module.exports.addCourse = (reqBody) => {

	// Creates a variable "newCourse" and instantiates a new "Course" object using the mongoose model
	// Uses the information from the request body to provide all the necessary information
	let newCourse = new Course({

		name: reqBody.name,
		description: reqBody.description,
		price: reqBody.price
	});


	// Saves the created object to our database
	return newCourse.save().then( (course, error) => {

		// Course creation successful
		if(error) {

			return false
		
		// Course creation failed
		} else {

			return true
		}


	})
}





//Retrieve all courses
module.exports.getAllCourses = () => {

	return Course.find({}).then(result => {

		return result;
	
	})

}





//Controller for retrieving all ACTIVE courses
module.exports.getAllActive = () => {

	return Course.find({isActive: true}).then( result => {
		return result;
	})

}



//Retrieving a specific course
module.exports.getCourse = (reqParams) => {


	return Course.findById(reqParams.courseId).then(result => {
		
		return result
	
	})

}



//Updating course
module.exports.updateCourse = (reqParams, reqBody, data) => {

	return User.findById(data.id).then(result => {
		console.log(result)

		if(result.isAdmin === true) {

			// Specify the fields/properties of the document to be updated
			let updatedCourse = {
				name: reqBody.name,
				description: reqBody.description,
				price: reqBody.price
			};

			// Syntax:
						// findByIdAndUpdate(document ID, updatesToBeApplied)
			return Course.findByIdAndUpdate(reqParams.courseId, updatedCourse).then((course, error) => {

				// Course not updated
				if(error) {

					return false

				// Course updated successfully	
				} else {

					return true
				}
			})

		} else {

			return false
		}

	})


}





module.exports.archiveCourse = (data, reqBody) => {

	return Course.findById(data.courseId).then(result => {

		if (data.payload === true) {

			let updateActiveField = {
				isActive: reqBody.isActive
			}

			return Course.findByIdAndUpdate(result._id, updateActiveField).then((course, err) => {

					if(err) {
					
						return false
					
					}  else {

						return 
					}
			})
			 
		} else {

			return false
		} 
	})

}

