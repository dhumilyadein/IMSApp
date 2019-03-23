const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);



var PaidSalarySchema = new Schema({

    paidSalaryId: {
    type: Number,
    required: true,
    unique:true
  },



  empDetails: {
    type: 
    Object
    ,
    trim:true,
  },

  remarks:{ type:String,
    trim:true,
  },

  dop:{ type:Date,
    trim:true,
   required: true},


  month: {
    type: String,
    required: true,
    trim:true,
  },

  year: {
    type: String,
    required: true,
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

  
},  { collection: 'PaidSalary' });



PaidSalarySchema.plugin(autoIncrement.plugin, { model: 'PaidSalary', field: 'paidSalaryId', startAt: 1});
module.exports = PaidSalary = mongoose.model("PaidSalary", PaidSalarySchema);
