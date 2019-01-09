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

        var classData = {
          "class": element.class, 
          "section": element.section, 
          "subjects": element.subjects,
          "studentsData": element.studentsData
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

      var classData = {
        "class": req.body.class, 
        "section": req.body.section, 
        "subjects": req.body.subjects,
        "studentsData": req.body.studentsData,
      };

      console.log("NORMAL FLOW server - classData - " + JSON.stringify(classData));

      var classObj = new Class(classData);
      classObj
        .save()
        .then(classObj => {
          console.log("Data inserted successfully in class");
          console.log("server time success - " + new Date().getMinutes() + " " + new Date().getMilliseconds());
          response = { reqbody: req.body, message: "Class details inserted successfully" };
          console.log("server final response - " + JSON.stringify(response));
    return res.send(response);
        })
        .catch(err => {
          console.log("Catching server err - " + err);
          console.log("server time error - " + + new Date().getMinutes() + " " + new Date().getMilliseconds());
          response = { errors: err };
          console.log("server final response - " + JSON.stringify(response));
    return res.send(response);
          //return res.send();
        });

    }
    // console.log("server final response - " + JSON.stringify(response));
    // return res.send(response);

  }

  app.get("/api/fetchAllClassDetails", fetchAllClassDetails, (req, res) => {
    console.log("fetchAllClassDetails get service running");
  });

  app.post("/api/insertClassDetails", insertClassDetailsValidation, insertClassDetails, (req, res) => {
    console.log("insertClassDetails post service running");
  });

  app.get("/", (req, res) => res.json("classDAO"));
};
