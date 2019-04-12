const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var LeaveTypesSchema = new Schema({

   leaveName: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ leaveName: value })
          .exec(function(err, user){
              if(err){
                  throw err;
              }
              else if(user) {
                  if(self.id === user.id) {
                      return isValid(true);
                  }
                  return isValid(false);
              }
              else{
                  return isValid(true);
              }

          })
      },
      message:  'The Item Name is already in use'
  },

    trim:true,
   lowercase:true
  },

  leaveType:{
    type: String,
    trim:true,
    lowercase:true

  },


  leaveCount:{
    type: Number,
    trim:true,
    required: true,


},

carryForward:{
  type: Boolean,
  trim:true,
  required: true,


},

maxLeaveCount:{
  type: String,
  trim:true,
  default:"NA"
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


},  { collection: 'LeaveTypes' });



module.exports = LeaveTypes = mongoose.model("LeaveTypes", LeaveTypesSchema);
