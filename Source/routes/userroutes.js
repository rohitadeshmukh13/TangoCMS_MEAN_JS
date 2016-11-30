var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var User=mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//as28tuge start
router.get('/getAllUsers',function(req,res){
	User.find(function(err,users){
    if(err){ return next(err); }

    	res.json(users);

  });

});
//as28tuge end

router.get('/api/users/:userid',function(req,res){

  console.log(req.params.userid);
  //req.params.userid
  

  User.findById(req.params.userid, function(err, users) {
        if(err){ return (err); }
        
      res.json(users);
      })



});

//Update User details


router.put('/updateuserdata/:userid',function(req,res,next){

  User.findById(req.params.userid, function(err, users) {

        if(err){ return next(err); }

        //Conditions to ensure only changed data is updated so as to avoid null/wrong updates
        if(req.body.firstname!=null)
        users.firstname=req.body.firstname;
        if(req.body.lastname!=null)
        users.lastname=req.body.lastname;
        if(req.body.organization!=null)
        users.organization=req.body.organization;
		if(req.body.mob!=null)
        users.mob=req.body.mob;
		if(req.body.email!=null)
        users.email=req.body.email;
      

        

      users.save(function(err){
        if(err)
          res.send(err);
        res.json("users");
      })

      

    });

});

// Delete User

router.delete('/deleteuser/:userid', function(req, res) {
        User.remove({
      _id:req.params.userid
            
        }, function(err, users) {
            if (err){return(err);}
                
      res.json("User removed");
        });
    });
module.exports = router;
