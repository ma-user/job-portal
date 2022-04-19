const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var x=0;
// Create Schema
const UserSchema = new Schema({
	accepted:{
		type:Number,
		default:x
	},
	name:String,
	email: {
		type: String,
		unique: true,
	},
	password: String,
	date:Date,
	no_of_apps:{
		type:Number,
		default:x
	},
	rating:{
		type: Number,
		"default": x,
	},
	no_of_raters:{
		type: Number,
		"default": x
	},
	has_rated:[{
		email: String,
		rating: Number
  	}],
	skills:[],
	education:[{
		Institute:String,
		StartYear:Number,
		EndYear:Number}
	]
});

module.exports = User = mongoose.model("Users", UserSchema);