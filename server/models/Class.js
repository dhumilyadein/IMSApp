const mongoose = require("mongoose");
const Schema = mongoose.Schema;

connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });

var ClassSchema = new Schema({
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  studentsData: {
    type: Array,
    lowercase:true
  },
  subjects: {
    type: Array,
    required: true,
    lowercase:true
  }
},  { collection: 'Class' });

// Composite primary key (class + section)
ClassSchema.index({class: 1, section: 1}, {unique: true});

module.exports = Class = mongoose.model("Class", ClassSchema);