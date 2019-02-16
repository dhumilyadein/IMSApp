const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var StopsSchema = new Schema({

  stopId: {
    type: Number,
    required: true,
    unique:true
  },
  stopName: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ stopName: value })
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
      message:  'Bus Stop Name is already in use'
  },

    trim:true,
   lowercase:true
  },

  description:{
    type: String,
    trim:true,
    lowercase:true

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


},  { collection: 'Stops' });



StopsSchema.plugin(autoIncrement.plugin, { model: 'Stops', field: 'stopId', startAt: 1});
module.exports = Stops = mongoose.model("Stops", StopsSchema);
