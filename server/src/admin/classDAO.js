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

    console.log("fetchAllClassDetails ENTRY");

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

        console.log("element - " + JSON.stringify(element));

        var errors = validationResult(element);

        if (!errors.isEmpty()) {
          return res.send({ errors: errors.mapped() });
        }

        var currentTime = new Date();
        console.log("current time - " + currentTime);

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

        console.log("classObj - " + classObj);

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
      console.log("current time - " + currentTime);


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
          console.log("Data inserted successfully in class");
          response = { reqbody: req.body, message: "Class details inserted successfully" };
          console.log("server final response - " + JSON.stringify(response));
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

    console.log("classDAO - updateClassDetails - Enter");

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
        console.log("ClassDAO - updateClassDetails - server final response - " + JSON.stringify(response));
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
    if (request.timeTable) objForUpdate.timeTable = request.timeTable;
    objForUpdate.updatedAt = currentTime;

    var udpateJSON = {};
    if (Object.keys(objForUpdate).length === 0 && Object.keys(studentsDataJSON).length === 0) {
      udpateJSON = {
        $set: objForUpdate,
        $push: studentsDataJSON
      }
    } else if (objForUpdate) {
      udpateJSON = {
        $set: objForUpdate,
      }
    }

    
    console.log("udpateJSON - " + JSON.stringify(udpateJSON));

    await Class.findOneAndUpdate(
      { $and: [{ "class": request.class }, { "section": request.section }] },
      udpateJSON
    ).then(function (classData) {

      console.log("Class details udpated successfully");
      response = { reqbody: req.body, message: "Class details updated successfully" };
      console.log("ClassDAO - updateClassDetails - server final response - " + JSON.stringify(response));
      return res.send(response);
    }).catch(function (err) {
      console.log("Catching server err - " + err);
      response = { errors: err };
      console.log("ClassDAO - updateClassDetails - Errors in classDAO - server final response - " + JSON.stringify(response));
      return res.send(response);
    });

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

  app.get("/", (req, res) => res.json("classDAO"));
};
