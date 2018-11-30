const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var UserSchema = new Schema({

  userid: {
    type: Number,
    required: true,
    unique:true
  },
  username: {
    type: String,
    required: true,
    unique:true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },


      email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
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
  role: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true}

},  { collection: 'user' });

UserSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};
UserSchema.methods.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};
UserSchema.plugin(autoIncrement.plugin, { model: 'user', field: 'userid', startAt: 1});
module.exports = User = mongoose.model("user", UserSchema);
