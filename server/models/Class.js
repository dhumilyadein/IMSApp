const mongoose = require("mongoose");
const Schema = mongoose.Schema;

connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });

var ClassSchema = new Schema({
  class: {
    type: String,
    required: true,
    unique:true
  },
  section: {
    type: String,
    required: true,
  },
  usernames: {
    type: Array,
    required: true,
    lowercase:true
  }
},  { collection: 'Class' });

module.exports = Class = mongoose.model("Class", ClassSchema);