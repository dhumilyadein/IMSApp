var moment = require('moment');
var util = require('util');

var { check, validationResult } = require("express-validator/check");
var fs = require('fs');
const Class = require("../../models/Class");

module.exports = function (app) {

  const insertClassDetailsValidation = [
    check("class")
      .not()
      .isEmpty()
      .withMessage("Please Enter class"),

    check("section")
      .not()
      .isEmpty()
      .withMessage("Please Enter section"),

    check("subjects")
      .not()
      .isEmpty()
      .withMessage("Please Enter Subjects")
  ];

  const updateClassValidation = [
    check("class")
      .not()
      .isEmpty()
      .withMessage("Please Enter class"),

    check("section")
      .not()
      .isEmpty()
      .withMessage("Please Enter section"),

  ];

  /**
     * @description Post method for fetchAllClassDetails service
     */
  function fetchAllClassDetails(req, res) {

    // console.log("fetchAllClassDetails ENTRY");

    //var searchJSON = {};

    //Initial validation like fields empty check
    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }

    // var using = req.body.using;
    // var find = req.body.find;
    // var searchCriteria = req.body.searchCriteria;

    // console.log("find - " + find + " using - " + using + " searchCriteria - " + searchCriteria);

    // if ("containsSearchCriteria" === searchCriteria) {
    //   find = "/" + find + "/i";
    // } else {
    //   find = "/^" + find + "$/i";
    // }

    // searchJSON = {
    //   [using]: { $regex: eval(find) }
    // }

    //console.log("searchStudentJSON - " + JSON.stringify(searchJSON));

    Class.find()
      .then(function (classDetails) {

        // console.log("classDAO - fetchAllClassDetails - All Class details -  " + classDetails);

        res.send(classDetails);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  /**
     * @description Post method for fetchAllClassDetails service
     */
    function fetchAllClassesAndSections(req, res) {

      console.log("ClassDAO - fetchAllClassesAndSections - ENTRY");
  
      //Initial validation like fields empty check
      var errors = validationResult(req);
  
      //Mapping the value to the same object
      if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
      }
  
      Class.find({},
        {
        "class":1, 
        "section":1,
      })
        .then(function (classDetails) {
  
          console.log("classDAO - fetchAllClassesAndSections - All Classes and Sections -  " + classDetails);
  
          res.send(classDetails);
        })
        .catch(function (error) {
          console.log(error);
        });
  
    }

  /**
     * @description Post method for fetchSelectedClassStudentsData service
     */
    async function fetchSelectedClassStudentsData(req, res) {

      // console.log("fetchSelectedClassStudentsData ENTRY");
  
      //var searchJSON = {};
  
      //Initial validation like fields empty check
      var errors = validationResult(req);
  
      //Mapping the value to the same object
      if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
      }
  
      var request = req.body;
      var className = request.class;
      var section = request.section;

      console.log("classDAO - class - " + className + " section - " + section);

      await Class.findOne(
        { "class": className , "section": section },
        {
          "class":1, 
          "section":1,
          "studentsData":1
        }
      ).then(function (classData) {
  
        response = { response: classData, message: "Class details fetched successfully" };
        console.log("ClassDAO - fetchSelectedClassStudentsData - Class details fetched successfully.\nServer final response - " + JSON.stringify(response));
        return res.send(response);

      }).catch(function (err) {

        console.log("ClassDAO - fetchSelectedClassStudentsData- Catching server err - " + err);
        response = { errors: err };
        console.log("ClassDAO - fetchSelectedClassStudentsData - Errors in classDAO.\nServer final response - " + JSON.stringify(response));
        return res.send(response);
      });
  
    }

  async function insertClassDetails(req, res) {

    //console.log("req.body.AllData - " + JSON.stringify(req.body.AllData));

    var response = {};
    if (req.body.AllData) {

      req.body.AllData.forEach(element => {

        // console.log("element - " + JSON.stringify(element));

        var errors = validationResult(element);

        if (!errors.isEmpty()) {
          return res.send({ errors: errors.mapped() });
        }

        var currentTime = new Date();

        var classData = {
          "class": element.class,
          "section": element.section,
          "subjects": element.subjects,
          "studentsData": element.studentsData,
          "createdAt": currentTime,
          "updatedAt": currentTime
        };

        console.log("server - classData - " + JSON.stringify(classData));

        var classObj = new Class(classData);

        // console.log("classObj - " + classObj);

        classObj
          .save()
          .then(classObj => {
            console.log("Data inserted successfully in class");
          })
          .catch(err => {
            console.log("err err err - " + err);
            //break;
            return res.send(err);
          });
      });
    } else {

      console.log("NORMAL FLOW - " + JSON.stringify(req.body));

      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("THROWING VALIDATOIN ERROR");
        response = { errors: errors.mapped() };
        console.log("server final response - " + JSON.stringify(response));
        return res.send(response);
        //return res.send({ errors: errors.mapped() });
      }

      var currentTime = new Date();


      var classData = {
        "class": req.body.class,
        "section": req.body.section,
        "subjects": req.body.subjects,
        "studentsData": req.body.studentsData,
        "createdAt": currentTime,
        "updatedAt": currentTime
      };

      console.log("NORMAL FLOW server - classData - " + JSON.stringify(classData));

      var classObj = new Class(classData);
      classObj
        .save()
        .then(classObj => {
          // console.log("Data inserted successfully in class");
          response = { reqbody: req.body, message: "Class details inserted successfully" };
          console.log("ClassDAO - insertClassDetails - Data inserted successfully in class. Server final response - " + JSON.stringify(response));
          return res.send(response);
        })
        .catch(err => {
          console.log("Catching server err - " + err);
          response = { errors: err };
          console.log("server final response - " + JSON.stringify(response));
          return res.send(response);
          //return res.send();
        });

    }
    // console.log("server final response - " + JSON.stringify(response));
    // return res.send(response);

  }

  async function updateClassDetails(req, res) {

    // console.log("classDAO - updateClassDetails - Enter");

    //Initial validation like fields empty check
    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      console.log("ClassDAO - updateClassDetails - Errors in classDAO - THROWING VALIDATOIN ERROR");
      response = { errors: errors.mapped() };
      console.log("server final response - " + JSON.stringify(response));
      return res.send(response);
    }

    var currentTime = new Date();

    var request = req.body;
    var objForUpdate = {};

    console.log("ClassDAO - updateClassDetails req.body - " + JSON.stringify(req.body));

    /*
    If the class/section is updated in register user we have to remove the user from the previous code. This logic is present here.
    */
    if(request.previousClass && request.previousSection) {

      var username = {};
      var pullStudentsDataJSON = {};

      if (request.studentsData.username) username.username = request.studentsData.username;
      if(username.username) pullStudentsDataJSON.studentsData = username;

      console.log("pullStudentsDataJSON - " + pullStudentsDataJSON);

      await Class.findOneAndUpdate(
        { $and: [{ "class": request.previousClass }, { "section": request.previousSection }] },
        {
          $pull: { "studentsData" : { "username" : request.studentsData.username} }
        }
      ).then(function (classData) {
  
        console.log("Class details udpated successfully");
        response = { reqbody: req.body, message: "Class details updated successfully" };
        console.log("ClassDAO - updateClassDetails - Class details udpated successfully - Server final response - " + JSON.stringify(response));
        return res.send(response);
      }).catch(function (err) {
        console.log("Catching server err - " + err);
        response = { errors: err };
        console.log("ClassDAO - updateClassDetails - Errors in classDAO - server final response - " + JSON.stringify(response));
        return res.send(response);
      });
    }

    var studentsDataJSON = {};
    if (request.studentsData) studentsDataJSON.studentsData = request.studentsData;

    if (request.subjects) objForUpdate.subjects = request.subjects;
    // if (request.timeTable) objForUpdate.timeTable = request.timeTable;
    
    // Storing date as date (converting string date to date type)
    if (request.timeTable) {

      var timeTableArrayTemp = [];

      request.timeTable.forEach(element => {

        var timeTableTemp = {};
        
        timeTableTemp._id = element._id;
        timeTableTemp.name = element.name;
        timeTableTemp.teacher = element.teacher;
        timeTableTemp.classes = element.classes;
        timeTableTemp.startDateTime = new Date(element.startDateTime);
        timeTableTemp.endDateTime = new Date(element.endDateTime);

        timeTableArrayTemp.push(timeTableTemp);

        // console.log("classDAO - updateClassDetails FIRST FIRST - startDateTime - " 
        //     + timeTableTemp.startDateTime 
        //     + " endDateTime - " + timeTableTemp.endDateTime);

        /*
        Code to repeat schedule every week for the next 52 weeks
        */
        if (element.repeatScheduleEveryWeek) {

          for (i = 1; i <= 52; i++) {

            var timeTableTemp = {};

            timeTableTemp._id = element._id;
            timeTableTemp.name = element.name;
            timeTableTemp.teacher = element.teacher;
            timeTableTemp.classes = element.classes;

            var dayOfWeek = moment(element.startDateTime).day();
            timeTableTemp.startDateTime = new Date(moment(element.startDateTime).day(dayOfWeek + 7*i));
            timeTableTemp.endDateTime = new Date(moment(element.endDateTime).day(dayOfWeek + 7*i));

            // console.log("classDAO - updateClassDetails - " + " dayOfWeek - " + dayOfWeek + " startDateTime - " 
            // + timeTableTemp.startDateTime 
            // + " endDateTime - " + timeTableTemp.endDateTime);
            
            timeTableArrayTemp.push(timeTableTemp);
          }
        }

        // console.log("classDAO - updateClassDetails - element.startDateTime - " + element.startDateTime);

      });

      objForUpdate.timeTable = timeTableArrayTemp;
    }

    objForUpdate.updatedAt = currentTime;

    console.log("objForUpdate - " + JSON.stringify(objForUpdate) 
    + " studentsDataJSON - " + JSON.stringify(studentsDataJSON));

    var udpateJSON = {};
    if (Object.keys(objForUpdate).length !== 0 && Object.keys(studentsDataJSON).length !== 0) {
      udpateJSON = {
        $set: objForUpdate,
        $push: studentsDataJSON
      }
    } else if (Object.keys(objForUpdate).length !== 0) {
      udpateJSON = {
        $set: objForUpdate,
      }
    }

    
    console.log("udpateJSON - " + JSON.stringify(udpateJSON));

    await Class.findOneAndUpdate(
      { $and: [{ "class": request.class }, { "section": request.section }] },
      udpateJSON
    ).then(function (classData) {

      // console.log("Class details udpated successfully");
      response = { reqbody: req.body, message: "Class details updated successfully" };
      console.log("ClassDAO - updateClassDetails - Class details udpated successfully - server final response - " + JSON.stringify(response));

      return res.send(response);
    }).catch(function (err) {
      console.log("Catching server err - " + err);
      response = { errors: err };
      console.log("ClassDAO - updateClassDetails - Errors in classDAO - server final response - " + JSON.stringify(response));
      return res.send(response);
    });

  }

  async function updateStudentsAttendance(req, res) {

    await console.log("updateStudentsAttendance");

    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      console.log("ClassDAO - updateClassDetails - Errors in classDAO - THROWING VALIDATOIN ERROR");
      response = { errors: errors.mapped() };
      console.log("server final response - " + JSON.stringify(response));
      return res.send(response);
    }

    var request = req.body;

console.log("\n\nclass - " + request.class + " section - " + request.section + " attendance.date - " + request.attendance.date);

     Class.findOneAndUpdate(
      // Class.findOne(
      {"class": request.class, 
      "section": request.section 
      ,"attendance.date": request.attendance.date
    } 
      ,{
        // $addToSet: {'attendance': attendance}

        $unset: {"attendance.$.studentsInfo": 1},
        
        // $set: {'attendance.$.studentsInfo': request.attendance.studentsInfo}
      },
      // {upsert: true}
    )

    .then(function (classData) {

      response = { response: classData, message: "Class details updated successfully" };
      console.log("ClassDAO - updateStudentsAttendance - Class details udpated successfully - server final response - " + JSON.stringify(classData));

      if(null === classData) {
        
        console.log("No record for attendance found so ADDING the record");

        Class.findOneAndUpdate(
          {"class": request.class, 
          "section": request.section 
        } ,
          {
            $addToSet: {'attendance': request.attendance}
          },
        ).then(function (classData) {
    
          response = { response: classData, message: "Class details updated successfully - ATTENDANCE ADDED" };
          console.log("ClassDAO - server response while set attendance - " + JSON.stringify(classData));
        }).catch(function (err) {
          console.log("Catching server ERROR while set attendance - " + err);
          response = { errors: err };
          console.log("ClassDAO - updateStudentsAttendance - ERRORS in classDAO - ERR while set attendance - " + JSON.stringify(err));
          return res.send(response);
        });

      } else {

        console.log("ClassDAO - updateStudentsAttendance - attendance record found - so MODIFYING data");

        Class.findOneAndUpdate(
          {"class": request.class, 
          "section": request.section
          ,"attendance.date": request.attendance.date
        } ,
          {
            $set: {'attendance.$.studentsInfo': request.attendance.studentsInfo}
          },
        ).then(function (classData) {
    
          response = { response: classData, message: "Class details updated successfully - ATTENDANCE MODIFIED" };
          console.log("ClassDAO - server response while set attendance studentInfo - " + JSON.stringify(classData));
        }).catch(function (err) {
          console.log("Catching server ERROR while set attendance studentInfo - " + err);
          response = { errors: err };
          console.log("ClassDAO - updateStudentsAttendance - ERRORS in classDAO - ERR while set attendance studentInfo - " + JSON.stringify(err));
          return res.send(response);
        });
      }

      return res.send(response);


    }).catch(function (err) {
      console.log("Catching server err while unset - " + err);
      response = { errors: err };
      console.log("ClassDAO - updateStudentsAttendance - ERRORS in classDAO - server final ERR for unset - " + JSON.stringify(err));
      return res.send(response);
    });
  }

  async function fetchAttendanceOnDate(req, res) {

    await console.log("fetchAttendanceOnDate");

    console.log("ClassDAO - fetchAttendanceOnDate - Errors in classDAO - THROWING VALIDATOIN ERROR");

    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      console.log("ClassDAO - fetchAttendanceOnDate - Errors in classDAO - THROWING VALIDATOIN ERROR");
      response = { errors: errors.mapped() };
      console.log("ClassDAO - fetchAttendanceOnDate - server final response - " + JSON.stringify(response));
      return res.send(response);
    }

    var request = req.body;

    console.log("\n\nfetchAttendanceOnDate - class - " + request.class
    + " section - " + request.section
    + " \nattendance date - " + request.date);

    Class.findOne(
      {"class": request.class, 
      "section": request.section
      // ,"attendance.date": request.date
      ,"attendance" : { $elemMatch : { date : request.date } },
    },
    {
      "class":1, 
      "section":1,
      "attendance.date":1,
      "attendance.$.studentsInfo":1
    }
    ).then(function (classData) {

      response = { response: classData, message: "Attendance details fetched successfully" };
      console.log("ClassDAO - fetchAttendanceOnDate - Attendance details fetched successfull - " + JSON.stringify(classData));
      return res.send(response);
    }).catch(function (err) {
      console.log("Catching server ERROR while set attendance studentInfo - " + err);
      response = { errors: err };
      console.log("ClassDAO - fetchAttendanceOnDate - ERRORS in classDAO - ERR while fetching attendance - " + JSON.stringify(err));
      return res.send(response);
    });
  }

  async function removeSchedule(req, res) {

    // console.log("classDAO - updateClassDetails - Enter");

    //Initial validation like fields empty check
    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      console.log("ClassDAO - removeSchedule - Errors in classDAO - THROWING VALIDATOIN ERROR");
      response = { errors: errors.mapped() };
      console.log("server final response - " + JSON.stringify(response));
      return res.send(response);
    }

    var currentTime = new Date();

    var request = req.body;
    var objForUpdate = {};

    console.log("ClassDAO - removeSchedule req.body - " + JSON.stringify(request));

      var id = {};
      var pullTimeTableJSON = {};
      var pullTimeTableUdpateJSON = {};

      if (request.timeTable._id) id._id = request.timeTable._id;
      if(id._id) pullTimeTableJSON.timeTable = id;

      if (Object.keys(pullTimeTableJSON).length !== 0) {

        pullTimeTableUdpateJSON = {
          $pull: pullTimeTableJSON
        }
      

      console.log("ClassDAO - removeSchedule - pullTimeTableUdpateJSON - " + JSON.stringify(pullTimeTableUdpateJSON));

      await Class.findOneAndUpdate(
        { $and: [{ "class": request.class }, { "section": request.section }] },
        pullTimeTableUdpateJSON
      ).then(function (classData) {
  
        response = { reqbody: req.body, message: "Class details updated successfully" };
        console.log("ClassDAO - removeSchedule - Class details udpated successfully - Server final response - " + JSON.stringify(response));
        return res.send(response);
      }).catch(function (err) {
        console.log("Catching server err - " + err);
        response = { errors: err };
        console.log("ClassDAO - removeSchedule - Errors in classDAO - server final response - " + JSON.stringify(response));
        return res.send(response);
      });

    } else {

      console.log("ClassDAO - removeSchedule - pullStudentsDataJSON empty - nothing to remove");
    }

  }

  app.get("/api/fetchAllClassDetails", fetchAllClassDetails, (req, res) => {
    console.log("fetchAllClassDetails get service running");
  });

  app.get("/api/fetchAllClassesAndSections", fetchAllClassesAndSections, (req, res) => {
    console.log("fetchAllClassesAndSections get service running");
  });

  app.post("/api/fetchSelectedClassStudentsData", fetchSelectedClassStudentsData, (req, res) => {
    console.log("fetchSelectedClassStudentsData post service running");
  });

  app.post("/api/insertClassDetails", insertClassDetailsValidation, insertClassDetails, (req, res) => {
    console.log("insertClassDetails post service running");
  });

  app.post("/api/updateClassDetails", updateClassValidation, updateClassDetails, (req, res) => {
    console.log("ClassDAO - updateClassDetails post method call");

  });

  app.post("/api/removeSchedule", updateClassValidation, removeSchedule, (req, res) => {
    console.log("ClassDAO - updateClassValidation post method call");

  });

  app.post("/api/updateStudentsAttendance", updateClassValidation, updateStudentsAttendance, (req, res) => {
    console.log("ClassDAO - updateStudentsAttendance post method call");

  });

  app.post("/api/fetchAttendanceOnDate", updateClassValidation, fetchAttendanceOnDate, (req, res) => {
    console.log("ClassDAO - fetchAttendanceOnDate post method call");

  });

  app.get("/", (req, res) => res.json("classDAO"));
};
