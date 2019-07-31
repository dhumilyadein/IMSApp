const mongoose = require("mongoose");
const Schema = mongoose.Schema;

connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
var InstituteDetailsSchema = new Schema({

   instituteName: {
    type: String,
    required: true,
    trim:true,

  },

  address:{
    type: String,
    trim:true,
    required:true



  },

  city:{
    type: String,
    trim:true,
    required:true


  },

  state:{
    type: String,
    trim:true,
    required:true


  },

  pincode:{
    type: String,
    trim:true,
    required:true


  },

  telephone:{
    type: String,
    trim:true,


  },

  mobile:{
    type: String,
    trim:true,


  },

  fax:{
    type: String,
    trim:true,


  },
  email:{
    type: String,
    trim:true

  },


  website:{
    type: String,
    trim:true
},
logo: {
  data: Buffer,
  contentType: String,


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


},  { collection: 'InstituteDetails' });




module.exports = InstituteDetails = mongoose.model("InstituteDetails", InstituteDetailsSchema);
