var express = require("express");

const Recruiter = require("../models/Recruiters");
const Session = require("../models/RecruiterSession");
var routerone = express.Router();



routerone.get("/", function(req, res) {

    var message;
    Recruiter.find(function(err, recruiters) {
		if (err) {
            message=err;
			console.log(message);
		} else {
            message=recruiters;
			res.json(message);
		}
	})
});



routerone.post("/register", (req, res) => {
    var name=req.body.name;
    var email=req.body.email;
    var date=req.body.date;
    var password=req.body.password
    var message;
    new Recruiter({
        name: name,
		email: email,
		date: date,
        password: password
    }).save()
        .then(user => {
            message="Created Recruiter With Username " + user.name;
            res.send(message);
        })
        .catch(err => {
            message="Error: Account With Given Email Exists";
            res.send(message);
        });
        
});



routerone.post("/login", (req, res) => {
    const email = req.body.email;
    var message;

	Recruiter.findOne({ email }).then(user => {
	
		if (user) {
           
            if(user.password!==req.body.password)
            {
                
                message="Password Mismatch"
            }
            else
            {
                message="Success";
            }
			
        }
        else{
            
            message="Email Not Found";
        }
        res.send(message);
    });
    
});

routerone.post("/contactno", (req, res) => {
 
    var message;
    var number=req.body.number;
	Recruiter.update({email:req.body.email},{contact_no:number }, function (err, result) { 
        if (err){ 
            message=err;
            console.log(message) 
        }else{ 
            message="yey";
            res.send(message);
        } 
    }); 
});

routerone.post("/bio", (req, res) => {
 
    var bio=req.body.bio;
    var message;
	Recruiter.update({email:req.body.email},{bio:bio }, function (err, result) { 
        if (err){ 
            message=err;
            console.log(message) 
        }else{ 
            message="yey";
            res.send(message);
        } 
    }); 
});

routerone.post("/findone", (req, res) => {
	const email = req.body.email;
    var message;
	Recruiter.findOne({ email }).then(user => {
		// Check if user email exists
		if (user) {
            message=user;
            res.json(message)
			
        }
        else{
            message="Email Not Found"
            return res.status(404).json({
				error: message
			});
        }
	});
});

routerone.get("/session", function(req, res) {
    var message;
    Session.find(function(err, users) {
		if (err){ 
            message=err;
            console.log(message) 
        }else{ 
            message=users;
            res.json(message)
        } 
	})
});

routerone.get("/logout", function(req, res) {
    var message='collection removed'
    Session.remove({}, function(err) { 
        console.log(message) 
        });
    
});

routerone.post("/session", (req, res) => {

    var message='collection removed'
    Session.remove({}, function(err) { 
        console.log(message) 
        });
    new Session({
        email: req.body.email
    }).save()
        .then(user => {
            message=user.email;
            res.send(message);
        })
        .catch(err => {
            message="Error: Account With Given Email Exists"
            res.send(message);
        });
    
});

module.exports = routerone;