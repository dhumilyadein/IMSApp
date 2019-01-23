const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });

var ExamsSchema = new Schema({

  examName: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ examName: value })
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
      message:  'The exam Name is already in use'
  },

    trim:true,
   lowercase:true
  },

  totalMarks:{
    type: Number,
    trim:true,
    required: true,

  },


  passingMarks:{
    type: Number,
    trim:true,
    required: true,


},


timeLimit:{
  type: Number,
  trim:true,
  required: true,


},
description:{
  type: String,
  trim:true,


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


},  { collection: 'Exams' });



module.exports = Exams = mongoose.model("Exams", ExamsSchema);
