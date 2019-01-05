const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var ConsumedItemsSchema = new Schema({

  id: {
    type: Number,
    required: true,
    unique:true
  },
  

 

 

    itemName:{
    type: String,
    trim:true,
    required: true,

  },
  consumedQuantity:{
    type: Number,
    trim:true,
    required: true,

  },

  availableQuantity:{
    type: Number,
    trim:true,
    required: true,

  },
  unit:{
    type: String,
    trim:true,
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
 

  doc: {
    type: Date,
    required: true}

},  { collection: 'ConsumedItems' });



ConsumedItemsSchema.plugin(autoIncrement.plugin, { model: 'ConsumedItems', field: 'id', startAt: 1});
module.exports = ConsumedItems = mongoose.model("ConsumedItems", ConsumedItemsSchema);
