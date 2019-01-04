const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var PurchaseItemsSchema = new Schema({

  listId: {
    type: Number,
    required: true,
    unique:true
  },
  listName: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ listName: value })
          .exec(function(err, user){
              if(err){
                  throw err;
              }
              else if(user) {
                  if(self.id === user.id) {
                      return isValid(true);
                  }
                  return isValid(false);
              }
              else{
                  return isValid(true);
              }

          })
      },
      message:  'The List Name is already in use'
  },

    trim:true,
   lowercase:true
  },

  remarks:{
    type: String,
    trim:true,

  },

  itemRows: {
    type: Array,

    required: true,

    itemName:{
    type: String,
    trim:true,
    required: true,

  },
  quantity:{
    type: String,
    trim:true,
    required: true,

  },
  unit:{
    type: String,
    trim:true,
    required: true,

  },

costPerItem:{
    type: String,
    trim:true,
    required: true,

  },
  totalAmount:{
    type: String,
    trim:true,
    required: true,

  },

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
  grandTotal: {
    type: String,
    required: true,

  },

  dos: {
    type: Date,
    required: true}

},  { collection: 'PurchaseItems' });



PurchaseItemsSchema.plugin(autoIncrement.plugin, { model: 'PurchaseItems', field: 'listId', startAt: 1});
module.exports = PurchaseItems = mongoose.model("PurchaseItems", PurchaseItemsSchema);
