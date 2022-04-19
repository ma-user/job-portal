const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var x=0;
const JobSchema = new Schema({
	title:String,
  name: String,
  has_rated:[{
    email: String,
    rating: Number
  }],
	email: String,
	max_app: Number,
  applicants: Array,
  rejected: Array,
  accepted: Array,
  doj: [{
    email: String, 
    date: String
  }],
  shortlisted: Array,
	max_pos: Number,
  date: Date,
  deadline: String,
  skills: Array,
  job_type: {
  type: String,
  },
  duration: {
  type: Number,
  },
  doa: [{
    email: String, 
    date: String
  }],
  salary:{
  type: Number,
  },
  rating: {
    type: Number,
    default:x
  },
  no_of_raters:{
		type: Number,
		default: x
	},
  contact_no: String,
  
  sop: [{
    email: String, 
    text: String
  }]
});

module.exports = Job = mongoose.model("Jobs", JobSchema);