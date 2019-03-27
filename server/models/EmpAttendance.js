const mongoose = require("mongoose");
const Schema = mongoose.Schema;

connection = mongoose.createConnection('mongodb://localhost:27017/IMS',{ useNewUrlParser: true });

var EmpAttendanceSchema = new Schema({
 

      date: {
        type: Date,
        required: true,
       
      } ,
        
      empType: {
        type: String,
        required: true
      },

    empInfo: {
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
     
      attendanceStatus: {
        type: String,
        required: true
      },
      attendanceColor: {
        type: String,
        required: true
      }
    } 
    
  
},  { collection: 'EmpAttendance' });

EmpAttendanceSchema.index({"empType": 1, "date": 1}, {unique: true});

module.exports = EmpAttendance = mongoose.model("EmpAttendance", EmpAttendanceSchema);