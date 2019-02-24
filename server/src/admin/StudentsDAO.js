var util = require('util');

var { check, validationResult } = require("express-validator/check");
const Student = require("../../models/Student");

module.exports = function (app) {

  const serValidation = [
    check("find")
      .not()
      .isEmpty()
      .withMessage("Please Enter Search Text")
  ];

  /**
     * @description Post method for SearchUser service
     */
  function searchStudentsByUsername(req, res) {

    console.log("StudentsDAO - searchStudentsByUsername ENTRY");

    var request = req.body;

    Student.find({
      "username": request.username
    }, {
        "username": 1,
        "email": 1,
        "parentfirstname": 1,
        "parentlastname": 1,
        "parentusername": 1,
        "parentemail": 1,
        "parentphone1": 1,
        "parentphone2": 1
      })
      .then(function (studentData) {

        console.log("StudentsDAO - searchStudentsByUsername - " + studentData);

        if (null === studentData) {
          response = { response: studentData, message: "No Data found for username - " + request.username };
        } else {
          response = { response: studentData, message: "Student details fetched successfully" };
        }
        return res.send(response);

      })
      .catch(function (err) {

        console.log("StudentsDAO - searchStudentsByUsername - Catching server ERROR - " + err);
        response = { errors: err };
        return res.send(response);
      });

  }

  /**
     * @description Post method for SearchUser service
     */
    function searchStudentsByUsernameArray(req, res) {

      console.log("StudentsDAO - searchStudentsByUsernameArray ENTRY");
  
      var request = req.body;
  
      Student.find({
        "username": { $in : request.usernameArray} 
      }, {
          "username": 1,
          "email": 1,
          "parentfirstname": 1,
          "parentlastname": 1,
          "parentusername": 1,
          "parentemail": 1,
          "parentphone1": 1,
          "parentphone2": 1
        })
        .then(function (studentData) {
  
          console.log("StudentsDAO - searchStudentsByUsernameArray - " 
          + studentData + " studentData.length - " + studentData.length + " usernameArray - " + request.usernameArray);
  
          if (null === studentData || (null !== studentData && studentData.length === 0) ) {
            response = { response: studentData, message: "No Data found for username - " + request.usernameArray };
          } else {
            response = { response: studentData, message: "Students details fetched successfully" };
          }
          return res.send(response);
  
        })
        .catch(function (err) {
  
          console.log("StudentsDAO - searchStudentsByUsernameArray - Catching server ERROR - " + err);
          response = { errors: err };
          return res.send(response);
        });
  
    }

  app.post("/api/searchStudentsByUsername", serValidation, searchStudentsByUsername, (req, res) => {
    console.log("searchStudentsByUsername post service running");

  });

  app.post("/api/searchStudentsByUsernameArray", serValidation, searchStudentsByUsernameArray, (req, res) => {
    console.log("searchStudentsByUsernameArray post service running");

  });

  app.get("/", (req, res) => res.json("sdasdsa"));
};
