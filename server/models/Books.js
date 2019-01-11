const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });
autoIncrement.initialize(connection);
var BooksSchema = new Schema({

  bookId: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    lowecase:true,
    validate: {
        isAsync: true,
        validator: function(value, isValid) {
            const self = this;
            return self.constructor.findOne({ bookId: value })
            .exec(function(err, book){
                if(err){
                    throw err;
                }
                else if(book) {
                    if(self.id === book.id) {
                        return isValid(true);
                    }
                    return isValid(false);
                }
                else{
                    return isValid(true);
                }

            })
        },
        message:  'The Book Id is already in use'
    },

  },
  bookName: {
    type: String,
    required: true,
    unique:true,
    lowercase:true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
          const self = this;
          return self.constructor.findOne({ bookName: value })
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
      message:  'The Book Name is already in use'
  },

    trim:true,

  },

  publisher:{
    type: String,
    trim:true,



  },

  author:{
    type: String,
    trim:true,


  },

  location:{
    type: String,
    trim:true,


  },

  description:{
    type: String,
    trim:true,


  },

  uniqueBookIds:{
    type: Array,
    trim:true,
   required:true

  },

  cost:{
    type: Number,
    trim:true,


  },

  doa:{
    type: Date,
    trim:true,


  },
  category:{
    type: String,
    trim:true,

    required:true

  },


  quantity:{
    type: Number,
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


},  { collection: 'Books' });




module.exports = Books = mongoose.model("Books", BooksSchema);
