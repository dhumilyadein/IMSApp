var util = require('util');

var { check, validationResult } = require("express-validator/check");
var fs = require('fs');
const User = require("../../models/User");
const Student = require("../../models/Student");

module.exports = function (app) {

  const serValidation = [
    check("find")
      .not()
      .isEmpty()
      .withMessage("Please Enter Search Text")
  ];


  function search(req, res) {
    console.log("\n SEARCH ENTER - " + req.body.username);

    var resMsg = null;
    var userData = null;

    //Initial validation like fields empty check

    var errors = validationResult(req);

    //Mapping the value to the same object

    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    // Terminating flow as validation fails.
    else {
      //Fetching user from Mongo after initial validation is done
      User.findOne({
        username: req.body.username,
        email: req.body.email
      })
        .then(function (userData) {
          console.log("userData - " + userData);
          if (!userData) {
            resMsg = {
              error: true,
              message: "User does not exist! Please check the username."
            };
          } else {
            req.session.user = userData;
            req.session.isLoggedIn = true;
            resMsg = { error: false, message: "user Found", userData };
          }

          if (resMsg) {
            return res.send(resMsg);
          } else {
            console.log("No response from the loginUser service");
            return res.send({
              error: true,
              message: "Login failed.. something went wrong."
            });
          }
          console.log("userData - " + userData + " resMsg - " + resMsg);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }


  /**
     * @description Post method for SearchUser service
     */
  function searchUsers(req, res) {

    console.log("SEARCH USER ENTRY");

    var searchJSON = {};
    //Initial validation like fields empty check
    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }

    var using = req.body.using;
    var find = req.body.find;
    var role = req.body.role;
    var searchCriteria = req.body.searchCriteria;

    console.log("find - " + find + " using - " + using + " role - " + role + " searchCriteria - " + searchCriteria);

    if ("containsSearchCriteria" === searchCriteria) {
      find = "/" + find + "/i";
    } else {
      find = "/^" + find + "$/i";
    }

    if (role.indexOf("anyRole") != -1) {
      searchJSON = {
        [using]: { $regex: eval(find) }
        //role: { $all: role }
      }
    } else {
      searchJSON = {
        [using]: { $regex: eval(find) },
        role: { $in: role }
      }
    }

    console.log("searchJSON - " + JSON.stringify(searchJSON));

    User.find(searchJSON)
      .then(function (userData) {

        console.log("SEARCH USER RESULT " + searchCriteria + "\n" + userData + " find - " + find);
        res.send(userData);
      })
      .catch(function (error) {
        console.log(error);
      });

    //console.log("searchString - " + JSON.stringify(searchString));

    console.log("SEARCH USER EXIT");
  }

  /**
     * @description Post method for SearchUser service
     */
    function searchStudents(req, res) {

      console.log("searchStudents ENTRY");
  
      var searchJSON = {};
      //Initial validation like fields empty check
      var errors = validationResult(req);
  
      //Mapping the value to the same object
      if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
      }
  
      var using = req.body.using;
      var find = req.body.find;
      var searchCriteria = req.body.searchCriteria;
  
      console.log("find - " + find + " using - " + using + " searchCriteria - " + searchCriteria);
  
      if ("containsSearchCriteria" === searchCriteria) {
        find = "/" + find + "/i";
      } else {
        find = "/^" + find + "$/i";
      }
  
      searchJSON = {
        [using]: { $regex: eval(find) }
      }

      console.log("searchStudentJSON - " + JSON.stringify(searchJSON));
  
      Student.find(searchJSON)
        .then(function (studentData) {
  
          console.log("SEARCH USER RESULT 1 " + studentData[0].photo.data 
          + " \n" + searchCriteria + "\n studentData - " + studentData + " find - " + find);

          fs.writeFileSync('../src/photoTemp/' + studentData[0].username + ".jpg", studentData[0].photo.data);

          res.send(studentData);
        })
        .catch(function (error) {
          console.log(error);
        });
  
      //console.log("searchString - " + JSON.stringify(searchString));
  
      console.log("searchStudents EXIT");
    }

  app.post("/api/searchUsers", serValidation, searchUsers, (req, res) => {
    console.log("SearchUsers post service running");

  });

  app.post("/api/searchStudents", serValidation, searchStudents, (req, res) => {
    console.log("SearchStudents post service running");

  });

  app.get("/", (req, res) => res.json("sdasdsa"));
};
