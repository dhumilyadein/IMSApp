const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var TeacherSchema = new Schema({
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
  maritalstatus: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },
    dob: {
    type: Date,
    required: true
  },

  gender: {
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
    type: String,
    data: Buffer,
    required: true
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


},  { collection: 'teacher' });

TeacherSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
TeacherSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = Teacher = mongoose.model("teacher", TeacherSchema);
