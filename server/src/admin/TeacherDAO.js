var moment = require('moment');
var util = require('util');

var { check, validationResult } = require("express-validator/check");
var fs = require('fs');
const Teacher = require("../../models/Teacher");

module.exports = function (app) {

  const fetchTeacherValidation = [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Please Enter username"),
  ];

    /**
     * @description Post method for fetchTeachersSpecificDetails service
     */
    function fetchTeachersSpecificDetails(req, res) {

      console.log("TeacherDAO - fetchTeachersSpecificDetails - ENTRY");
  
      //Initial validation like fields empty check
      var errors = validationResult(req);
  
      //Mapping the value to the same object
      if (!errors.isEmpty()) {

        console.log("TeacherDAO - fetchTeachersSpecificDetails - errors - " + JSON.stringify(errors.mapped));
        return res.send({ errors: errors.mapped() });
      }
  
      var request = req.body;

      var fetchTeachersSpecificDetailsJSON = {};

      if(request.username) {
        fetchTeachersSpecificDetailsJSON.username = request.username;
      }

      var fetchTeachersSpecificDetailsResponseJSON = {};

      if(request.username) {
        fetchTeachersSpecificDetailsResponseJSON.username = 1
      }
      if(request.firstname) {
        fetchTeachersSpecificDetailsResponseJSON.firstname = 1
      }
      if(request.lastname) {
        fetchTeachersSpecificDetailsResponseJSON.lastname = 1
      }
      if(request.email) {
        fetchTeachersSpecificDetailsResponseJSON.email = 1
      }
      if(request.userid) {
        fetchTeachersSpecificDetailsResponseJSON.userid = 1
      }

      console.log("TeacherDAO - fetchTeachersSpecificDetails - fetchTeachersSpecificDetailsResponseJSON - " 
      + JSON.stringify(fetchTeachersSpecificDetailsResponseJSON));

      Teacher.findOne(
        fetchTeachersSpecificDetailsJSON,
        fetchTeachersSpecificDetailsResponseJSON
        )
        .then(function (teacherDetails) {
  
          console.log("TeacherDAO - fetchTeachersSpecificDetails - Teacher details -  " + teacherDetails);
  
          res.send(teacherDetails);
        })
        .catch(function (error) {
          console.log(error);
        });
  
    }

    /**
     * @description Post method for fetchAllTeachersSpecificDetails service
     */
    function fetchAllTeachersSpecificDetails(req, res) {

      console.log("TeacherDAO - fetchAllTeachersSpecificDetails - ENTRY");
  
      //Initial validation like fields empty check
      var errors = validationResult(req);
  
      //Mapping the value to the same object
      if (!errors.isEmpty()) {

        console.log("TeacherDAO - fetchAllTeachersSpecificDetails - errors - " + JSON.stringify(errors.mapped));
        return res.send({ errors: errors.mapped() });
      }
  
      var request = req.body;

      var fetchTeachersSpecificDetailsResponseJSON = {};

      if(request.username) {
        fetchTeachersSpecificDetailsResponseJSON.username = 1
      }
      if(request.firstname) {
        fetchTeachersSpecificDetailsResponseJSON.firstname = 1
      }
      if(request.lastname) {
        fetchTeachersSpecificDetailsResponseJSON.lastname = 1
      }
      if(request.email) {
        fetchTeachersSpecificDetailsResponseJSON.email = 1
      }
      if(request.userid) {
        fetchTeachersSpecificDetailsResponseJSON.userid = 1
      }

      console.log("TeacherDAO - fetchTeachersSpecificDetails - fetchTeachersSpecificDetailsResponseJSON - " 
      + JSON.stringify(fetchTeachersSpecificDetailsResponseJSON));

      Teacher.find(
        {},
        fetchTeachersSpecificDetailsResponseJSON
        )
        .then(function (teacherDetailsArray) {
  
          console.log("TeacherDAO - fetchTeachersSpecificDetails - Teacher details -  " + teacherDetailsArray);
  
          res.send(teacherDetailsArray);
        })
        .catch(function (error) {
          console.log(error);
        });
  
    }    

  app.post("/api/fetchTeachersSpecificDetails", fetchTeacherValidation, fetchTeachersSpecificDetails, (req, res) => {
    console.log("TeacherDAO - fetchTeachersSpecificDetails post method call");

  });

  app.post("/api/fetchAllTeachersSpecificDetails", fetchTeacherValidation, fetchAllTeachersSpecificDetails, (req, res) => {
    console.log("TeacherDAO - fetchAllTeachersSpecificDetails post method call");

  });

  app.get("/", (req, res) => res.json("TeacherDAO"));
};
