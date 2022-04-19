var express = require("express");
var router = express.Router();

// Load User model
const Job = require("../models/Jobs");
const User = require("../models/Users")

router.get("/", function(req, res) {
          
    var message;
    Job.find(function(err, Jobs) {
		if (err) {
			message = err;
		} else {
			message = Jobs;
		}
        res.json(message);
    })
});

router.post("/addjob", (req, res) => {

    var name= req.body.name;
    var email= req.body.email;
    var date= Date.now();
    var title= req.body.title;
    var max_app= req.body.max_app;
    var max_pos= req.body.max_pos;
    var deadline= req.body.deadline;
    var email= req.body.email;
    var skills= req.body.skills;
    var job_type= req.body.job_type;
    var duration= req.body.duration;
    var salary= req.body.salary;
    var contact_no= req.body.contact_no;

    new Job({
        name: name,
        email: email,
        date: Date.now(),
        title: title,
        max_app: max_app,
        max_pos: max_pos,
        deadline: deadline,
        email: email,
        skills: skills,
        job_type: job_type,
        duration: duration,
        salary: salary,
        contact_no : contact_no
    }).save()
        .then(job => {
            var message = "Success";
            res.send(message);
        })
        .catch(err => {
            message = err;
            res.send(message);
        });
});

router.post("/getjobs", (req, res) => {

    const chek={
        email: req.body.email
        };
    Job.find(chek, 
        function(err, Jobs){
            if (err) {
                var message = err;
                console.log(message);
            } 
            else {
                var message = Jobs;
                res.json(message);
            }
	    })
});

router.post("/editjobs", (req, res) =>{
    const id = req.body.id;
    var eles = {max_app:req.body.max_app,
         max_pos:req.body.max_pos,
         deadline:req.body.deadline};
    Job.update({_id:id}, eles, function (err, result) { 
        if (err){ 
            var message = err;
            console.log(message); 
        }else{ 
            var message = "success"  
            res.send(message);
        } 
    }); 
}); 

router.post("/deljob", (req, res) => {

    Job.findOne({ _id: req.body.id }).then(job => {
        if (!job) {
            var message = "Job not found";
            res.send(message);
        }
        else{

            var chn = -1;
            job.accepted.map( user => {
                User.findOneAndUpdate(
                    {email:user},
                    {$pull: {has_rated: {email:job.email}}},
                    function (error, success) {
                        if (error){ 
                            var message = error;
                            console.log(message); 
                        }else{ 
                            var message = "success";
                        }
                    }
                );
            })

            job.shortlisted.map( user => {
                User.findOneAndUpdate(
                    {email:user},
                    {$inc:{no_of_apps:chn}},
                    function (error, success) {
                        if (error){ 
                            var message = error;
                            console.log(message); 
                        }else{ 
                            var message = "success";
                        }
                    }
                );
            })

            job.applicants.map( user => {
                User.findOneAndUpdate(
                    {email:user},
                    {$inc:{no_of_apps:chn}},
                    function (error, success) {
                        if (error){ 
                            var message = error;
                            console.log(message); 
                        }else{ 
                            var message = "success";
                        }
                    }
                );


            })

            job.remove();
            var message = "Deleted"
            res.send(message);
        }
    });
});

router.post("/applyjob", (req, res) => {
    var decc = -1;
    User.findOneAndUpdate(
        {email:req.body.email},
        {$inc:{no_of_apps:1}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = success;
                console.log(message);
            }
        }
    );

    var da = new Date();
    var fin = (da.getDate()).toString() + '-' + (da.getMonth()+1).toString() + '-' + (da.getFullYear()).toString();

    Job.findOneAndUpdate(
        {_id:req.body.id},
        {$push:{applicants:req.body.email, doa:{email:req.body.email, date:fin}, sop:{email:req.body.email, text:req.body.sop}}, 
          $inc:{max_app:decc}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = "Application Successful"
                res.send(message);
            }
        }
    );        
});

router.post("/acceptapp", (req, res) => {
    const id = req.body.id;
    var decc = -1;
    User.findOneAndUpdate(
        {email:req.body.email},
        {$inc:{accepted:1},$set:{no_of_apps:0}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = success;
                console.log(message);
            }
        }
    );

    var da = new Date();
    var fin = (da.getDate()).toString() + '-' + (da.getMonth()+1).toString() + '-' + (da.getFullYear()).toString();
    
    Job.findOneAndUpdate(
        {_id:id},
        {$push:{doj:{email:req.body.email, date:fin}, accepted:req.body.email},
         $inc:{max_pos:decc},
         $pullAll:{shortlisted:[req.body.email]}},
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                var message = "Accepted Successfully";
                res.send(message);
            }
        }
    );
});

router.post("/ratejob", (req, res) => {
    const id = req.body.id;
    var x= req.body.rating;
    var y=parseInt(x,10);
    Job.findOneAndUpdate(
        {_id: id},
        {$push:{has_rated:{email: req.body.email, rating:x}},
        $inc:{rating:y,no_of_raters:1}},
        
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = success;
                console.log(message);
            }
        }
    );
});

router.post("/shortlistapp", (req, res) => {
    
    Job.findOneAndUpdate(
        {_id:req.body.id},
        {$push:{shortlisted:req.body.email},
          $pullAll:{applicants:[req.body.email]}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);;
            } else {
                var message = "Shorlisted Successfully";
                res.send(message);
            }
        }
    );
});

router.post("/rejectapp", (req, res) => {
    const id = req.body.id;
    var decc = -1;
    
    User.findOneAndUpdate(
        {email:req.body.email},
        {$inc:{no_of_apps:decc}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = success;
                console.log(message);
            }
        }
    );

    Job.findOneAndUpdate(
        {_id: id},
        {$push:{rejected:req.body.email},
         $pullAll:{shortlisted:[req.body.email],applicants:[req.body.email]},
        $inc:{max_app:decc}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = "Rejected Successfully";
                res.send(message);
            }
        }
    );
});



router.post("/pullapp", (req, res) => {
    const id = req.body.id;
    var decc = -1;

    User.findOneAndUpdate(
        {email:req.body.email},
        {$inc:{no_of_apps:decc}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = success;
                console.log(message);
            }
        }
    );

    Job.findOneAndUpdate(
        {_id:id},
        {$pullAll:{shortlisted:[req.body.email],applicants:[req.body.email]},
         $inc:{max_app:decc}},
        function (error, success) {
            if (error) {
                var message = error;
                console.log(message);
            } else {
                var message = "Pulled Successfully"
                res.send(message);
            }
        }
    );
});

module.exports = router;