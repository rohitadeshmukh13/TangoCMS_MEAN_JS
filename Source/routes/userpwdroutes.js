var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var passport = require('passport');
var jwt=require('express-jwt');

var User=mongoose.model('User');

//Update User password


router.put('/updateuserpwd/:userid',function(req,res,next){

	User.findById(req.params.userid, function(err, user) {

        if(err){ return next(err); }

        //Conditions to ensure only changed data is updated so as to avoid null/wrong updates
        if(req.body.password!=null)
		user.password=req.body.password;
		user.setPassword(req.body.password);
 		user.save(function(err){
  			if(err)
  				res.send(err);
  			res.json("user");
  		})

    	

  	});

});

module.exports = router;
