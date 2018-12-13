const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var TeacherSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    lowercase:true
  },
  firstname: {
    type: String,
    required: true,
    trim:true
  },
  lastname: {
    type: String,
    required: true,
    trim:true
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
  userid: {
    type: Number,
    required: true,
    unique:true
  },

  experiencedetails: {
    type: String,
    required: true,
    trim:true

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
    required: true,
    trim:true
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
    required: true,
    trim:true
  },

  city: {
    type: String,
    required: true,
    trim:true
  },

  postalcode: {
    type: String,
    required: true,
    trim:true
  },

  state: {
    type: String,
    required: true,
    trim:true
  },



    email: {
    type: String,
    required: true,
    unique:true,
    trim:true
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


},  { collection: 'Teachers' });

TeacherSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
TeacherSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = Teacher = mongoose.model("Teachers", TeacherSchema);
