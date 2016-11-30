var mongoose= require('mongoose');

var ConferenceSchema = new mongoose.Schema({

	confTitle:String,
	confDesc:String,
	chairPerson:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
	submissionDeadline:{type:Date},
	reviewDeadline:{type:Date}
	

});

mongoose.model('Conference',ConferenceSchema);