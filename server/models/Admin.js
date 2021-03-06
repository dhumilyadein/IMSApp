const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },

    dob: {
    type: Date,
    required: true
  },

  maritalstatus: {
    type: String,
    required: true
  },
  userid: {
    type: Number,
    required: true,
    unique:true
  },

  gender: {
    type: String,
    required: true
  },

  admintype: {
    type: String,
    required: true
  },

   bloodgroup: {
    type: String,
    required: true
  },

  nationality: {
    type: String,
    required: true
  },

  religion: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  photo: {
    data: Buffer,
     contentType: String,


  },

    employeeno: {
    type: String,
    required: true
  },

  doj: {
    type: Date,
    required: true
  },


  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  postalcode: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  admintype: {
    type: String,
    required: true
  },

  experiencedetails: {
    type: String,
    required: true,

  },
    email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
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


},  { collection: 'Admins' });

AdminSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
AdminSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = Admin = mongoose.model("Admins", AdminSchema);
