
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var x=0
const RecruiterSchema = new Schema({
	rating:{
		type: Number,
		"default": x,
	},
	name: String,
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: String,
    contact_no:String,
	bio:String
});

module.exports = Recruiter = mongoose.model("Recruiter", RecruiterSchema);