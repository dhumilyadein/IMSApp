const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var StudentSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    lowercase:true
  },
  parentusername: {
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

  parentfirstname: {
    type: String,
    required: true,
    trim:true
  },
  parentlastname: {
    type: String,
    required: true,
    trim:true
  },
  parentpostalcode: {
    type: String,
    required: true,
    trim:true
  },

  dob: {
    type: Date,
    required: true
  },

  gender: {
    type: String,
    required: true
  },


  parentemail: {
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


  admissionno: {
    type: String,
    required: true,
    trim:true
  },

  rollno: {
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

  parentphone1: {
    type: String,
    required: true
  },

  parentphone2: {
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

  feeTemplate: {
    type: Array,
    required: true,
    trim:true,
    lowercase:true
  },

  class: {
    type: String,
    required: true,
    trim:true
  },
  section: {
    type: String,
    required: true,
    trim:true
  },


    email: {
    type: String,
    required: true,
    unique:true,
    lowercase:true
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
  userid: {
    type: Number,
    required: true,
    unique:true
  }


},  { collection: 'Students' });

StudentSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
StudentSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = Student = mongoose.model("Students", StudentSchema);
