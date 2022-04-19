const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SessionSchema = new Schema({
    email:String
});

module.exports = RecruiterSession = mongoose.model("RecruiterSession", SessionSchema);