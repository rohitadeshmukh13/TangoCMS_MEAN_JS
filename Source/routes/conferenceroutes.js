var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');

var Conference=mongoose.model('Conference');


//To create a conference. Won't be called from Angular side yet.[Extensible for bonus feature]
router.post('/createConf',function(req,res,next){
	
	var conf=new Conference();
	conf.confTitle="Test Conference";
	conf.confDesc="Hope this works!";
	conf.chairPerson="5721e043e44b1fd41010c220";
	conf.submissionDeadline=null;
	conf.reviewDeadline=null;
	
	

	conf.save(function(err){
		if(err){return next(err);}
		return res.json({endresult:'success'})

		
	});

});

//Retrieves all conference documents
router.get('/gatherConfData',function(req,res){

	Conference.find(function(err,conferences){
    if(err){ return next(err); }

    	res.json(conferences);

  });
	
});


//retrieves conference document based on the confid passed in the url
router.get('/getconfdata/:confid',function(req,res){

	console.log(req.params.confid);

	/*Conference.findById(req.params.confid, function(err, conferences) {
    
        if(err){ return (err); }
     		
  		res.json(conferences);
  		})*/
    Conference.findById(req.params.confid).populate('chairPerson').exec(function(err,conferences){
      if(err){return (err);}
      console.log(conferences);
      res.json(conferences);
    }) 


});

//updates the conference document with the data that are updated against the confid passed in the URL
router.put('/updateconfdata/:confid',function(req,res,next){

	Conference.findById(req.params.confid, function(err, conference) {

        if(err){ return next(err); }

        //Conditions to ensure only changed data is updated so as to avoid null/wrong updates
        if(req.body.confTitle!=null)
        conference.confTitle=req.body.confTitle;
        if(req.body.submissionDeadline!=null)
        conference.submissionDeadline=req.body.submissionDeadline;
        if(req.body.reviewDeadline!=null)
        conference.reviewDeadline=req.body.reviewDeadline;
        if(req.body.chair!=null)
        conference.chairPerson.push(req.body.chair._id);


  		conference.save(function(err){
  			if(err)
  				res.send(err);
  			res.json("Conference details updated");
  		})

    	

  	});

});

  router.get('/checkConForchair/:userid',function(req,res){

  console.log(req.params.userid);

    Conference.find({chairPerson:req.params.userid},function(err,conferences){
        if(err)
            return err;
        //confsOwned=count;
        //console.log("Count of Accepted is"+confsOwned);
        return res.json(conferences);
    });

    

});


              
  
module.exports = router;