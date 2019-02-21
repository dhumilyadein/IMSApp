const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });

var VehiclesSchema = new Schema({

  vehicleNo: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ vehicleNo: value })
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
      message:  'The Vehicle Number is already in use'
  },

    trim:true,
   lowercase:true
  },

  vehicleRegNo: {
    type: String,
    required: true,
    unique:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ vehicleRegNo: value })
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
      message:  'The Vehicle Registration Number is already in use'
  },

    trim:true,
   lowercase:true
  },


  vehicleMake:{
    type: String,
    trim:true,
  
  },

  routeDetails:{
    type: [
      Object
    ],
    trim:true,
  },

  studentDetails:{
    type: Array,
    trim:true,
  },


  capacity:{
    type: Number,
    trim:true,
    

  },

 driverName:{
  type: String,
  trim:true,
  required: true,
},

  driverPhone:{
    type: String,
    trim:true,
    required: true,
  },


  conductorName:{
    type: String,
    trim:true,
   
  },
  
    conductorPhone:{
      type: String,
      trim:true,
     
    },


    
  vendorName:{
    type: String,
    trim:true,
    required: true,
  },
  
    vendorPhone:{
      type: String,
      trim:true,
      required: true,
    },

    vendorAddress:{
        type: String,
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


},  { collection: 'Vehicles' });



module.exports = Exams = mongoose.model("Vehicles", VehiclesSchema);
