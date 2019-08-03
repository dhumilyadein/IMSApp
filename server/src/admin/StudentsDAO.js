var util = require('util');

var { check, validationResult } = require("express-validator/");
const Student = require("../../models/Student");

module.exports = function (app) {

  const serValidation = [
    check("find")
      .not()
      .isEmpty()
      .withMessage("Please Enter Search Text")
  ];

  const updateValidation = [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Please Enter Username")
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

    function updateStudentDetails(req, res) {

      console.log("StudentsDAO - updateStudentDetails - Enter");

      var searchJSON = {};

      //Initial validation like fields empty check
      var errors = validationResult(req);

      //Mapping the value to the same object
      if (!errors.isEmpty()) {
          console.log('StudentsDAO - updateStudentDetails - Errors in updateStudentDetails - ' + JSON.stringify(errors.mapped()));
          return res.send({ errors: errors.mapped() });
      }

      var currentTime = new Date();
      // console.log("current time - " + currentTime);
      console.log("StudentsDAO - updateStudentDetails - selectedFeeTemplate - " + req.selectedFeeTemplate);

      var request = req.body;

      var updateStudentJSON = {};
      var templatesJSON = {};

      if(request.feeTemplate) templatesJSON.feeTemplate = request.feeTemplate;

      if(request.class) updateStudentJSON.class = request.class;
      if(request.section) updateStudentJSON.section = request.section;
      if(request.email) updateStudentJSON.email = request.email;
      if(request.firstname) updateStudentJSON.firstname = request.firstname;
      if(request.lastname) updateStudentJSON.lastname = request.lastname;
      if(request.parentfirstname) updateStudentJSON.parentfirstname = request.parentfirstname;
      if(request.parentlastname) updateStudentJSON.parentlastname = request.parentlastname;
      if(request.parentemail) updateStudentJSON.parentemail = request.parentemail;
      if(request.parentphone1) updateStudentJSON.parentphone1 = request.parentphone1;
      if(request.parentphone2) updateStudentJSON.parentphone2 = request.parentphone2;
      if(request.parentpostalcode) updateStudentJSON.parentpostalcode = request.parentpostalcode;
      if(request.address) updateStudentJSON.address = request.address;
      if(request.city) updateStudentJSON.city = request.city;
      if(request.postalcode) updateStudentJSON.postalcode = request.postalcode;
      if(request.state) updateStudentJSON.state = request.state;
      if(request.admissionno) updateStudentJSON.admissionno = request.admissionno;
      if(request.rollno) updateStudentJSON.rollno = request.rollno;
      if(request.doj) updateStudentJSON.doj = request.doj;
      if(request.dob) updateStudentJSON.dob = request.dob;
      if(request.gender) updateStudentJSON.gender = request.gender;
      if(request.religion) updateStudentJSON.religion = request.religion;
      if(request.nationality) updateStudentJSON.nationality = request.nationality;
      if(request.bloodgroup) updateStudentJSON.bloodgroup = request.bloodgroup;
      if(request.category) updateStudentJSON.category = request.category;
      if(request.phone) updateStudentJSON.phone = request.phone;

      updateStudentJSON.updatedAt = new Date();

      var updateJSON = {};

      updateJSON.$set = updateStudentJSON;
      if(templatesJSON && templatesJSON.feeTemplate) updateJSON.$addToSet = templatesJSON;

      var findBy = {};


      console.log("StudentsDAO - updateStudentDetails - \nfindBy - " + findBy + "\nupdateJSON - "
      + JSON.stringify(updateJSON));

    Student.findOneAndUpdate(
        { username:request.username },
        updateJSON
    ).then(function () {

        response = { response: "Student details updated successfully", message: "Student details updated successfully" };
        console.log("StudentsDAO - updateStudentDetails - Student details updated successfully.\nServer final response - " + JSON.stringify(response));
        return res.send(response);

    }).catch(function (error) {

        response = { errors: error };
        console.log("StudentsDAO - updateStudentDetails - Errors in StudentsDAO.\nServer final response - " + JSON.stringify(response));
        return res.send(response);
    });

    }

    /**
     * Update students details on the basis of username array, all at once.
     */
    function updateStudentDetailsByUsernameArray(req, res) {

      console.log("StudentsDAO - updateStudentDetailsByUsernameArray - Enter");

      var searchJSON = {};

      //Initial validation like fields empty check
      var errors = validationResult(req);

      //Mapping the value to the same object
      if (!errors.isEmpty()) {
          console.log('StudentsDAO - updateStudentDetailsByUsernameArray - Errors in updateStudentDetailsByUsernameArray - ' + JSON.stringify(errors.mapped()));
          return res.send({ errors: errors.mapped() });
      }

      var currentTime = new Date();
      // console.log("current time - " + currentTime);
      console.log("StudentsDAO - updateStudentDetailsByUsernameArray - selectedFeeTemplate - " + req.selectedFeeTemplate);

      var request = req.body;

      var updateStudentJSON = {};
      var templatesJSON = {};

      if(request.feeTemplate) templatesJSON.feeTemplate = request.feeTemplate;

      if(request.class) updateStudentJSON.class = request.class;
      if(request.section) updateStudentJSON.section = request.section;
      if(request.email) updateStudentJSON.email = request.email;
      if(request.firstname) updateStudentJSON.firstname = request.firstname;
      if(request.lastname) updateStudentJSON.lastname = request.lastname;
      if(request.parentfirstname) updateStudentJSON.parentfirstname = request.parentfirstname;
      if(request.parentlastname) updateStudentJSON.parentlastname = request.parentlastname;
      if(request.parentemail) updateStudentJSON.parentemail = request.parentemail;
      if(request.parentphone1) updateStudentJSON.parentphone1 = request.parentphone1;
      if(request.parentphone2) updateStudentJSON.parentphone2 = request.parentphone2;
      if(request.parentpostalcode) updateStudentJSON.parentpostalcode = request.parentpostalcode;
      if(request.address) updateStudentJSON.address = request.address;
      if(request.city) updateStudentJSON.city = request.city;
      if(request.postalcode) updateStudentJSON.postalcode = request.postalcode;
      if(request.state) updateStudentJSON.state = request.state;
      if(request.admissionno) updateStudentJSON.admissionno = request.admissionno;
      if(request.rollno) updateStudentJSON.rollno = request.rollno;
      if(request.doj) updateStudentJSON.doj = request.doj;
      if(request.dob) updateStudentJSON.dob = request.dob;
      if(request.gender) updateStudentJSON.gender = request.gender;
      if(request.religion) updateStudentJSON.religion = request.religion;
      if(request.nationality) updateStudentJSON.nationality = request.nationality;
      if(request.bloodgroup) updateStudentJSON.bloodgroup = request.bloodgroup;
      if(request.category) updateStudentJSON.category = request.category;
      if(request.phone) updateStudentJSON.phone = request.phone;

      updateStudentJSON.updatedAt = new Date();

      var updateJSON = {};

      updateJSON.$set = updateStudentJSON;
      if(templatesJSON && templatesJSON.feeTemplate) updateJSON.$addToSet = templatesJSON;

      var findBy = {};


      console.log("StudentsDAO - updateStudentDetailsByUsernameArray - \nfindBy - " + findBy + "\nupdateJSON - "
      + JSON.stringify(updateJSON));

    Student.updateMany(
        { username: { $in : request.username} },
        updateJSON
    ).then(function () {

        response = { response: "Student details updated successfully", message: "Student details updated successfully" };
        console.log("StudentsDAO - updateStudentDetailsByUsernameArray - Student details updated successfully.\nServer final response - " + JSON.stringify(response));
        return res.send(response);

    }).catch(function (error) {

        response = { errors: error };
        console.log("StudentsDAO - updateStudentDetailsByUsernameArray - Errors in StudentsDAO.\nServer final response - " + JSON.stringify(response));
        return res.send(response);
    });

    }


  app.post("/api/searchStudentsByUsername", serValidation, searchStudentsByUsername, (req, res) => {
    console.log("searchStudentsByUsername post service running");

  });

  app.post("/api/searchStudentsByUsernameArray", serValidation, searchStudentsByUsernameArray, (req, res) => {
    console.log("searchStudentsByUsernameArray post service running");

  });

  app.post("/api/updateStudentDetails", updateValidation, updateStudentDetails, (req, res) => {
    console.log("updateStudentDetails post service running");

  });

  app.post("/api/updateStudentDetailsByUsernameArray", updateValidation, updateStudentDetailsByUsernameArray, (req, res) => {
    console.log("updateStudentDetailsByUsernameArray post service running");

  });

  app.get("/", (req, res) => res.json("sdasdsa"));
};
