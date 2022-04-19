var express = require("express");
var router = express.Router();

const User = require("../models/Users");
const Session = require("../models/UserSession");

router.put("/addeducation",async(req,res) => {
    var email=req.body.email
    var message;
    User.findOneAndUpdate(
        {email:email},
        {$push:{education:{
            Institute : req.body.institute,
            StartYear : req.body.start,
            EndYear : req.body.end
        } }},
        function (error, success) {
            if (error) {
                message=error;
                console.log(message);
            } else {
                
                message="yey";
                res.send(message)
            }
        }
    );
   
});
router.get("/", function(req, res) {

    
    var wtf;
    User.find(function(err, users) {
		if (err) {
            wtf=err;
			console.log(wtf);
		} else {
            wtf=users;
			res.json(wtf);
		}
	})
});


router.post("/login", (req, res) => {
	const email = req.body.email;
	var message;
	User.findOne({ email }).then(user => {
		
		if (user) {
			if(user.password != req.body.password)
            {
                message="Password Mismatch";
                
            }
            else
            {
                message="Success";
            }
        }
        else{
            message="Email Not Found"
        }
        res.send(message);
	});
});

router.post("/findone", (req, res) => {
    var message;
	const email = req.body.email;
	
	User.findOne({ email }).then(user => {
		
		if (user) {
			res.json(user); 
        }
        else{
           
            message="Email Not Found"
            return res.status(404).json({
				error: message,
			});
            
        }
	});
});

router.put("/addskill",async(req,res) => {
    
    User.findOneAndUpdate(
        {email:req.body.email},
        {$push:{skills:req.body.newskill }},
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                
                message="yey";
                res.send(message)
            }
        }
    );
   
});
router.post("/register", (req, res) => {
   
   var message;
   var name =req.body.name;
   var email=req.body.email;
   var date= req.body.date;
   var password=req.body.password;
    new User({
        name: name,
        email: email,
        date: date,
        password: password
    }).save()
        .then(user => {
            message="Created User" + user.name;
            res.send(message)
        })
        .catch(err => {
           message="Error: Account With Given Email Exists"
           res.send(message)            
        });
        
});


router.post("/rateuser", (req, res) => {
    var x= req.body.rating;
    var y=parseInt(x,10);
    var message;
    const id = req.body.id;
    User.findOneAndUpdate(
        {_id:id},
        { $inc:{rating:y,no_of_raters:1},
        $push:{has_rated:{email:req.body.email, rating:req.body.rating}}},
        
        function (error, success) {
            if (error) {
                message=error;
                
            } else {
                message=success
               
            }
            console.log(message);
        }
    );
});

router.get("/logout", function(req, res) {
    
    Session.remove({}, function(err) { 
        
        });
    
   
});

router.get("/session", function(req, res) {
    

    var message;
    Session.find(function(err, users) {
		if (err) {
            message=err;
			console.log(message);
		} else {
            message=users;
			res.json(message);
		}
	})
});



router.post("/session", (req, res) => {

    var message;
    Session.remove({}, function(err) { 
    });
    
    new Session({
        email: req.body.email
    }).save()
        .then(user => {
            message="Created Session " + user.email
            res.send(message);
        })
        .catch(err => {
          
            message="Error: Account With Given Email Exists"
            res.send(message);
        
        });
       
});

module.exports = router;

