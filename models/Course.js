const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

	name: {
		type: String,
		// Requires the data for this our fields/properties to be included when creating a record.
		// The "true" value defines if the field is required or not and the second element in the array is the message that will be printed out in our terminal when the data is not present
		required: [ true, "Course is required"]
	},
	description: {
		type: String,
		required: [ true, "Description is required"]
	},
	price: {
		type: Number,
		required: [ true, "Price is required"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date ()
	},
	enrollees: [
		{
			userId: {
				type: String,
				required: [ true, "UserId is required"]
			},
			enrolledOn: {
				type: Date,
				default: new Date ()
			}
		}

	]

});

module.exports = mongoose.model("Course", courseSchema);