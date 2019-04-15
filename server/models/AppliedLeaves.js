const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var AppliedLeavesSchema = new Schema({

  empName: {
    type: String,
    required: true,
    
  },
  
    leaveType:{
    type: String,
    trim:true,
    required: true,

  },
 year:{
    type: String,
    trim:true,
    required: true,

  },

  doa:{
    type: Date,
    trim:true,
    required: true,

  },

  dof:{
    type: Date,
    trim:true,
    required: true,

  },

  dot:{
    type: Date,
    trim:true,
    required: true,

  },

  selectedLeaveCount:{
    type: Number,
    trim:true,
    required: true,


},

  status:{
    type: String,
    trim:true,
    required: true,

  },

  remarks:{
    type: String,
    trim:true,
   

  },

dateOfApproveOrReject:
{
    type: Date,

  },


  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  

},  { collection: 'AppliedLeaves' });



module.exports = AppliedLeaves = mongoose.model("AppliedLeaves", AppliedLeavesSchema);
