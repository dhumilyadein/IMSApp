const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var ItemsSchema = new Schema({

  itemId: {
    type: Number,
    required: true,
    unique:true
  },
  itemName: {
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
      message:  'The Item Name is already in use'
  },

    trim:true,
   lowercase:true
  },

  unit:{
    type: String,
    trim:true,

  },


  quantity:{
    type: String,
    trim:true,
    required: true,
    default:0

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


},  { collection: 'Items' });



ItemsSchema.plugin(autoIncrement.plugin, { model: 'Items', field: 'itemId', startAt: 1});
module.exports = Items = mongoose.model("Items", ItemsSchema);
