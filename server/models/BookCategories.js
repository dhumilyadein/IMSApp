const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var BookCategoriesSchema = new Schema({

  categoryId: {
    type: Number,
    required: true,
    unique:true
  },
  category: {
    type: String,
    required: true,
    unique:true,


    trim:true,

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


},  { collection: 'BookCategories' });



BookCategoriesSchema.plugin(autoIncrement.plugin, { model: 'BookCategories', field: 'categoryId', startAt: 1});
module.exports = BookCategories = mongoose.model("BookCategories", BookCategoriesSchema);


