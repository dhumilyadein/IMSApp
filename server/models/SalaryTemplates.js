const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var SalaryTemplatesSchema = new Schema({

  templateId: {
    type: Number,
    required: true,
    unique:true
  },
  templateName: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ templateName: value })
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
      message:  'The Template Name is already in use'
  },

    trim:true,
   lowercase:true
  },

 

  salaryRows: {
    type: Array,

    required: true,

    earnType:{
    type: String,
    trim:true,
    required: true,

  },
  amount:{
    type: Number,
    trim:true,
    required: true,

  }},

  deductRows: {
    type: Array,

    required: true,

    deductType:{
    type: String,
    trim:true,
    required: true,

  },
  amount:{
    type: Number,
    trim:true,
    required: true,

  }},

  paidAmount:{
    type: Number,
    trim:true,
    required: true,

  },

  totalEarning:{
    type: Number,
    trim:true,
    required: true,

  },

  totalDeduction:{
    type: Number,
    trim:true,
    required: true,

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

  status: {
    type: String,
    required: true}

},  { collection: 'SalaryTemplates' });



SalaryTemplatesSchema.plugin(autoIncrement.plugin, { model: 'SalaryTemplates', field: 'templateId', startAt: 1});
module.exports = SalaryTemplates = mongoose.model("SalaryTemplates", SalaryTemplatesSchema);
