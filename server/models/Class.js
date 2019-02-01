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
    type: Array
  },
  subjects: {
    type: Array,
    required: true,
  },
  timeTable: {
    type: Array,

    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    classes: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    }
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

  attendance: {
    type: Array,

    date: {
      type: Date,
      required: true,
      unique: true
    },
    studentsInfo: {
      type: Array,
      required: true,

      username: {
        type: String,
        required: true
      },
      firstname: {
        type: String,
        required: true
      },
      lastname: {
        type: String,
        required: true
      },
      rollno: {
        type: String,
        required: true,
        trim: true
      },
      attendanceStatus: {
        type: String,
        required: true
      }
    }
    
  }
},  { collection: 'Class' });

// Composite primary key (class + section)
ClassSchema.index({class: 1, section: 1}, {unique: true});
// ClassSchema.index({"attendance.date": 1}, {unique: true});
// ClassSchema.ensureIndex({"attendance.date": 1}, {unique: true});

module.exports = Class = mongoose.model("Class", ClassSchema);