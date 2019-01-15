const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var issuedBooksSchema = new Schema({

  issuedBookDetails: {
    type: Array,
    required: true,

  },
  class: {
    type: String,
    required: true,
    trim:true,

  },

  section:{
    type: String,
    trim:true,
   required:true

  },


  issuedTo:{
    type: String,
    trim:true,
    required: true,


},

remarks:{
  type: String,
  trim:true,



},

doi:{
  type: Date,

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


},  { collection: 'issuedBooks' });



module.exports = issuedBooks = mongoose.model("issuedBooks", issuedBooksSchema);
