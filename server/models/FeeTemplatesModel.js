const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var FeeTemplateSchema = new Schema({

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

  templateType: {
    type: String,
    required: true,

  },

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

  status: {
    type: String,
    required: true}

},  { collection: 'FeeTemplates' });



FeeTemplateSchema.plugin(autoIncrement.plugin, { model: 'FeeTemplates', field: 'templateId', startAt: 1});
module.exports = FeeTemplates = mongoose.model("FeeTemplates", FeeTemplateSchema);
