const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var ParentSchema = new Schema({
  parentusername: {
    type: String,
    required: true,
    unique:true
  },


  parentfirstname: {
    type: String,
    required: true
  },
  parentlastname: {
    type: String,
    required: true
  },


  relation: {
    type: String,
    required: true
  },

  occupation: {
    type: String,
    required: true
  },

  parentemail: {
    type: String,
    required: true
  },

  parentphone1: {
    type: String,
    required: true
  },

  parentphone2: {
    type: String,
    required: true
  },

  parentaddress: {
    type: String,
    required: true
  },

  parentcity: {
    type: String,
    required: true
  },

  parentstate: {
    type: String,
    required: true
  },

  parentpostalcode: {
    type: String,
    required: true
  },




  parentpassword: {
    type: String,
    required: true
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


},  { collection: 'parent' });

ParentSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
ParentSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = Parent = mongoose.model("parent", ParentSchema);
