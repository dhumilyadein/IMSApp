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

        console.log("classDAO - fetchAllClassDetails - All Class details -  " + classDetails);

        res.send(classDetails);
      })
      .catch(function (error) {
        console.log(error);
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

    // var attendanceJSON = {};
    // if (request.attendance) attendanceJSON.attendance = request.attendance;

    var attendance = {};
    var attendanceJSON = {};
    if (request.attendance) {
      if (request.attendance.date) attendance.date = moment(request.attendance.date).startOf('day').toDate();
      if (request.attendance.studentsInfo) attendance.studentsInfo = request.attendance.studentsInfo;
      attendanceJSON.attendance = attendance;
    }
    

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

    // if (request.attendance) objForUpdate.attendance = request.attendance;

    objForUpdate.updatedAt = currentTime;

    console.log("objForUpdate - " + JSON.stringify(objForUpdate) 
    + " studentsDataJSON - " + JSON.stringify(studentsDataJSON)
    + " attendanceJSON - " + JSON.stringify(attendanceJSON));

    var udpateJSON = {};
    if (Object.keys(objForUpdate).length !== 0 && Object.keys(studentsDataJSON).length !== 0) {
      udpateJSON = {
        $set: objForUpdate,
        $push: studentsDataJSON
      }
    } else if (Object.keys(objForUpdate).length !== 0 && Object.keys(attendanceJSON).length !== 0) {

      console.log("\nnew Date(moment(request.attendance.date).startOf('day')" + new Date(moment(request.attendance.date).startOf('day')));
      udpateJSON = {
        $set: objForUpdate,
        // $push: attendanceJSON
        // $addToSet: attendanceJSON,

        $addToSet: {
          "attendance": {
            "date" : new Date(moment(request.attendance.date).startOf('day').day(2)),
            // "studentsInfo" : request.attendance.studentsInfo
          }
        },

        upsert: true
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

      if (request.attendance) {
        updateStudentsInfoInClassAttendance(request.class, request.section, new Date(moment(request.attendance.date).startOf('day').day(2)), request.attendance.studentsInfo);
      }

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

  async function updateStudentsInfoInClassAttendance(classValue, section, date, studentsInfo) {

    await Class.findOneAndUpdate(
      { $and: [{ "class": classValue }, { "section": section }, {"attendance.date": date}] },
      {
        // $set: {
        // "attendance.studentsInfo" : studentsInfo
        // },
        $set: {'attendance.$.studentsInfo': studentsInfo}
      },
      {upsert: true}
    ).then(function (classData) {

      // console.log("Class details udpated successfully");
      // response = { reqbody: req.body, message: "Class details updated successfully" };
      console.log("ClassDAO - updateStudentsInfoInClassAttendance - Class details udpated successfully - server final response - " + JSON.stringify(classData));
      // return res.send(response);
    }).catch(function (err) {
      console.log("Catching server err - " + err);
      // response = { errors: err };
      console.log("ClassDAO - updateStudentsInfoInClassAttendance - Errors in classDAO - server final response - " + JSON.stringify(err));
      // return res.send(response);
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

  app.post("/api/insertClassDetails", insertClassDetailsValidation, insertClassDetails, (req, res) => {
    console.log("insertClassDetails post service running");
  });

  app.post("/api/updateClassDetails", updateClassValidation, updateClassDetails, (req, res) => {
    console.log("ClassDAO - updateClassDetails post method call");

  });

  app.post("/api/removeSchedule", updateClassValidation, removeSchedule, (req, res) => {
    console.log("ClassDAO - updateClassValidation post method call");

  });

  app.get("/", (req, res) => res.json("classDAO"));
};
