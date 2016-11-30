var mongoose=require('mongoose');

var ReviewSchema = new mongoose.Schema({
	forSubmission: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Paper'
      },
	reviewer: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
      },
	summary : String,
	overallEvaluation:String,
	reviewerExpertise:String,
	strongPoints:String,
	weakPoints:String,
	detailedComments:String,
      createdAt: {
      	type: Date, 
      	required: true,
      	default: Date.now
      },
      updatedAt: {
      	type: Date,      	
      	required: true,
      	default: Date.now
      }
});



mongoose.model('Review',ReviewSchema);