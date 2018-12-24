const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var FeeRecordSchema = new Schema({

  feeRecordId: {
    type: Number,
    required: true,
    unique:true
  },
  class: {
    type: String,
    required: true,

    trim:true,

  },

  section: {
    type: String,
    trim:true
  },

  studentDetails: {
    type: Array,
    required: true,
    name:{
      type:String,
      trim:true,
      required: true,
    },
    username:{ type:String,
      trim:true,
      required: true,}


  },

templateType:{ type:String,
  trim:true,
  required: true,},

templateName:{ type:String,
  trim:true,
  required: true,},

  year:{ type:String,
    trim:true,
    required: true,},


    quarter:{ type:String,
      trim:true,
      default:"NA"},


    month:{ type:String,
      trim:true,
      default:"NA"},


      halfYear:{ type:String,
      trim:true,
      default:"NA"},


      lateFeeFine:{ type:String,
        trim:true,
       Default:"0"},

       pastPendingDue:{ type:String,
        trim:true,
       Default:"0"},

       totalDueAmount:{ type:String,
        trim:true,

       required: true},

       totalFeeAmount:{ type:String,
        trim:true,

       required: true},

       paidAmount:{ type:String,
        trim:true,
       required: true},

       remarks:{ type:String,
        trim:true,
      },

      dos:{ type:Date,
        trim:true,
       required: true},





 templateRows: {
    type: Array,

    required: true,

    feeType:{
    type: String,
    trim:true,
    required: true,

  },
  amount:{
    type: String,
    trim:true,
    required: true,

  }},

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



},  { collection: 'FeeRecords' });



FeeRecordSchema.plugin(autoIncrement.plugin, { model: 'FeeRecords', field: 'feeRecordId', startAt: 1});
module.exports = FeeRecords = mongoose.model("FeeRecords", FeeRecordSchema);
