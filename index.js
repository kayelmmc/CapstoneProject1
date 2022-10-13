const express = require("express");
const mongoose = require("mongoose");
// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

const port = process.env.PORT || 4000;

const app = express();



//Connect to our MongoDB Database
mongoose.connect("mongodb+srv://admin:admin123@michaelcalasin.hv3gplh.mongodb.net/s37-s41?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("error", () => console.error.bind(console, "Error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas!"));

// Allows all resources to access our backend application
app.use(cors());
app.use(express.json());

/*localhost:4000/users/checkEmail */
app.use("/users", userRoutes);
// Defines the "/courses" string to be included for all course routes defined in the "course" route file
app.use("/courses", courseRoutes);


app.listen(port, () => {
	console.log(`API is now online on port ${port}`);
});
