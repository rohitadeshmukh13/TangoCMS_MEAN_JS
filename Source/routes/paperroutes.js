var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');

var Paper=mongoose.model('Paper');
var User=mongoose.model('User');

var datenow = new Date();

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

router.get('/api/papers', function(req, res, next) {

    Paper.find()
        .populate('authors reviewer')
        .exec(function(err, papers)
        {
            if (err)
                res.send(err)

            res.json(papers);
        });

});

    router.get('/api/mypapers/:author_id', function(req, res) {

        Paper.find({authors: req.params.author_id})
        .populate('authors')
        .exec(function(err, papers)
        {
            if (err)
                res.send(err)

            res.json(papers);
        });       
    });

    router.post('/api/papers', function(req, res) {

        // create a paper, information comes from AJAX request from Angular
        var status =  "Incomplete";
        if (req.body.title != null && req.body.title != "" && req.body.abstract != null 
            && req.body.abstract != "" && req.body.filename != null && req.body.filename != ""){
            status = "Completed";
        }

        Paper.create({
            title : req.body.title,
            abstract : req.body.abstract,
            keywords : req.body.keywords,

            _creator : req.body.creator,
            authors : req.body.authors,
            filename : req.body.filename,
            status
            
        }, function(err, paper) {
            if (err)
                res.send(err);

            // required ->
            res.json(paper);

            });

    });

    // update a paper
    router.put('/api/papers/:paper_id', function(req, res) {

        Paper.findById(req.params.paper_id, function(err, paper) {
            if (err)
                res.send(err);

            // Update the existing paper
             var statusTemp =  "Incomplete";
            if (req.body.title != null && req.body.title != "" && req.body.abstract != null 
            && req.body.abstract != "" && req.body.filename != null && req.body.filename != ""){
                statusTemp = "Completed";
            }

            paper.title = req.body.title;
            paper.abstract = req.body.abstract;
            paper.keywords = req.body.keywords;
            paper.authors = req.body.authors;
            paper.updatedAt = datenow;
            paper.filename = req.body.filename,
            paper.status = statusTemp;

            // Save the paper and check for errors
            paper.save(function(err) {
                if (err)
                    res.send(err);
                
                // required ->
                res.json(paper);
            });
        });
    });

    // delete a paper
    router.delete('/api/papers/:paper_id', function(req, res) {
        var paper_id = req.params.paper_id;

        Paper.remove({
            _id : paper_id
        }, function(err, paper) {
            if (err)
                res.send(err);

            return res.status(200).send({
                message: 'Success!'
            });
        });
    });

    // retrieve a single paper
    router.param('paper', function(req, res, next, id) {
      var query = Paper.findById(id);

      query
      .populate('authors')
      .exec(function (err, paper){
        if (err) { return next(err); }
        if (!paper) { return next(new Error('can\'t find paper')); }

        req.paper = paper;
        return next();
      });
    });

    router.get('/api/papers/:paper', function(req, res) {
        res.json(req.paper);
    });
 
router.post('/api/upload', function(req, res) {
                
            var fname = req.files.file.name;
            var mime = req.files.file.mimetype;
            var filedata = req.files.file.data;
            var paper_id = req.body.paper_id;
                
                //store paper _id in metadata field and use it to retrieve the corresp. file
                var writeStream = gfs.createWriteStream({
                    filename: fname,
                    metadata: paper_id,
                    mode: 'w',
                    content_type:mime
                });
 
 
                writeStream.on('close', function() {
                     return res.status(200).send({
                        message: 'Success'
                    });
                });
                
                writeStream.write(filedata);
 
                writeStream.end();
 
});
 
 
router.get('/api/download/:paper_id', function(req, res) {
 
    if(typeof req.params.paper_id != 'undefined' || req.params.paper_id != null)
    {
        gfs.files.find({ metadata: req.params.paper_id }).toArray(function (err, files) {
 
            if(files.length===0){
                return res.status(400).send({
                    message: 'File not found!'
                });
            }

            res.writeHead(200, {'Content-Type': files[0].contentType});

            var readstream = gfs.createReadStream({
              filename: files[0].filename
            });

            readstream.on('data', function(data) {
                res.write(data);
            });

            readstream.on('end', function() {
                res.end();        
            });

            readstream.on('error', function (err) {
              console.log('An error occurred!', err);
              throw err;
            });
        });
    }
    else{
        return res.status(400).send({
                    message: 'File not found!'
                });
    }
 
});  

router.delete('/api/deletefile/:paper_id', function(req, res) {      
    // also remove the attachment from gfs
    gfs.files.find({ metadata: req.params.paper_id }).toArray(function (err, files) {

        if(files.length===0){
            return res.status(400).send({
                message: 'File not found!'
            });
        }

        gfs.remove({
            filename: files[0].filename
        }, function (err) {
          if (err) return handleError(err);
          console.log('success');
          return res.status(200).send({
                    message: 'Success!'
          });
        });
    });
});  
    //assign a reviewer for a paper [as28tuge code begins]
    router.put('/assignReviewer/:paper_id', function(req, res) {
        //retrieves document that does not contain the assigned reviewer as author
        Paper.find({authors:{$ne:req.body.userid},_id:req.params.paper_id}, function(err, paper) {
            if (err)
                res.send(err);

            // Update the existing paper
            // checking length since it may be 0 when the userid is same as author
            if(paper.length>0){
            // 
             if(req.body.userid!=null){
                paper[0].reviewer=req.body.userid._id;
                }
               
            // Save the paper doc with the given user assigned as reviewer
            // hard coded the array index since there is always going to be one doc with paper_id
            paper[0].save(function(err) {
                if (err)
                    res.send(err);
                res.json(paper);
            });
            }
            else{
                res.send("Author cannot be reviewer");
            }
        });
    });
        var complete,accepted,rejected;
    router.get('/api/paperstats', function(req, res, next) {
        
    Paper.count({status:{$eq:'Completed'}},function(err,count){
        if(err)
            return err;
        complete=count;
        console.log("Count of Complete is"+count);
        
    });
     Paper.count({status:{$eq:'Accepted'}},function(err,count){
        if(err)
            return err;
        accepted=count;
        console.log("Count of Accepted is"+count);
        
    });
      Paper.count({status:{$eq:'Rejected'}},function(err,count){
        if(err)
            return err;
        rejected=count;
        console.log("Count of Rejected is"+count);
        
    });
   
     // console.log(complete);
   return res.json({Completed:complete,Accepted:accepted,Rejected:rejected});
        

});   
    //as28tuge code ends

//Prashanth's part begins
router.get('/getAllAuthors', function(req, res, next) {

    Paper.find()
        .populate('authors')
        .exec(function(err, papers)
        {
            if (err)
                res.send(err)

            res.json(papers);
        });

});
router.get('/getAllReviewers', function(req, res, next) {

    Paper.find()
        .populate('reviewer')
        .exec(function(err, papers)
        {
            if (err)
                res.send(err)

            res.json(papers);
        });

});
//Prashanth's part ends

module.exports = router;