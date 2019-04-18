const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var EmpLeaveStatusSchema = new Schema({

   empName: {
    type: String,
    required: true,
    unique:true,
    trim:true,
   lowercase:true
  },

  leaveDetails:{
    type: Array,
    trim:true,
    lowercase:true

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


},  { collection: 'EmpLeaveStatus' });



module.exports = EmpLeaveStatus = mongoose.model("EmpLeaveStatus", EmpLeaveStatusSchema);
