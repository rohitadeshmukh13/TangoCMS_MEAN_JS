var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');

var Review=mongoose.model('Review');
var User=mongoose.model('User');
var Paper=mongoose.model('Paper');

var datenow = new Date();

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

// router.get('/api/assignedsubs', function(req, res, next) {

// 	Paper.find()
//         .populate('reviewer')
//         .exec(function(err, papers)
//         {
//             if (err)
//             	res.send(err)

//             res.json(papers);
//         });

// });

    router.get('/api/assignedsubs/:reviewer_id', function(req, res) {

        Paper.find({reviewer: req.params.reviewer_id})
        .populate('authors reviewer')
        .exec(function(err, papers)
        {
            if (err)
                res.send(err)

            res.json(papers);
        });       
    });

    router.put('/api/paperstatus/:paper_id', function(req, res){
        Paper.findById(req.params.paper_id, function(err, paper) {
            if (err)
                res.send(err);

            paper.status = req.body.paperStatus;

            // Save the paper and check for errors
            paper.save(function(err) {
                if (err)
                    res.send(err);

                return res.status(200).send({message: 'Success!'});
            });
        });
    });

	router.post('/api/reviews', function(req, res) {

        Review.create({
            forSubmission : req.body.forSubmission,
            reviewer : req.body.reviewer,
            summary : req.body.summary,
            overallEvaluation : req.body.overallEvaluation,
            reviewerExpertise : req.body.reviewerExpertise,
            strongPoints : req.body.strongPoints,
            weakPoints : req.body.weakPoints,
            detailedComments : req.body.detailedComments
            
        }, function(err, review) {
            if (err)
                res.send(err);

            // required ->
            res.json(review);

            });
    });

    router.get('/api/reviews/:reviewer_id', function(req, res) {

        // Review.find()
        Review.find({ reviewer: req.params.reviewer_id })
        .populate('reviewer forSubmission')
        .exec(function(err, reviews)
        {
            if (err)
                res.send(err)

            res.json(reviews);
        });       
    });


	// update the review
	router.put('/api/reviews/:review_id', function(req, res) {

		Review.findById(req.params.review_id, function(err, review) {
			if (err)
				res.send(err);

		    // Update the existing review

		    review.summary = req.body.summary;
            review.overallEvaluation = req.body.overallEvaluation;
            review.reviewerExpertise = req.body.reviewerExpertise;
            review.strongPoints = req.body.strongPoints;
            review.weakPoints = req.body.weakPoints,
            review.detailedComments = req.body.detailedComments;
            review.updatedAt = datenow;

		    // Save the review and check for errors
		    review.save(function(err) {
		    	if (err)
		    		res.send(err);
                
                // required ->
		    	res.json(review);
		    });
		});
	});

    //Prashanth's part starts
    router.get('/getAllreviews', function(req, res) {

        // Review.find()
        Review.find()
        .populate('reviewer forSubmission')
        .exec(function(err, reviews)
        {
            if (err)
                res.send(err)

            res.json(reviews);
        });       
    });
    //Prashanth's part ends


module.exports = router;