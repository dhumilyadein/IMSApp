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
      .withMessage("Please Enter section")
  ];

  /**
     * @description Post method for searchAllClassDetails service
     */
  function searchAllClassDetails(req, res) {

    console.log("searchAllClassDetails ENTRY");

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

        console.log("classDAO - searchAllClassDetails - All Class details -  " + classDetails);

        res.send(classDetails);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async function insertClassDetails(req, res) {

    //console.log("req.body.AllData - " + JSON.stringify(req.body.AllData));

    if (req.body.AllData) {

      req.body.AllData.forEach(element => {

        console.log("element - " + JSON.stringify(element));

        var errors = validationResult(element);
  
        if (!errors.isEmpty()) {
          return res.send({ errors: errors.mapped() });
        }

        var classData = {
          "class": element.class, "section": element.section, "usernames": element.usernames
        };

        var classObj = new Class(classData);

        console.log("classObj - " + classObj);

        classObj
          .save()
          .then(classObj => {
            //return res.json(user);
          })
          .catch(err => {
            console.log("err err err - " + err);
            //break;
            return res.send(err);
          });
      });
    } else {

      var errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send({ errors: errors.mapped() });
      }

      var classData = {
        "class": req.body.class, "section": req.body.section, "usernames": req.body.usernames
      };

      var classObj = new Class(classData);
      classObj
        .save()
        .then(classObj => {
          //return res.json(user);
        })
        .catch(err => {
          console.log("err " + err);
          return res.send(err);
        });

    }

    return res.send({ data: req.body, message: "Calss details inserted successfully" });

  }

  app.get("/api/searchAllClassDetails", searchAllClassDetails, (req, res) => {
    console.log("searchAllClassDetails get service running");
  });

  app.post("/api/insertClassDetails", insertClassDetailsValidation, insertClassDetails, (req, res) => {
    console.log("insertClassDetails post service running");
  });

  app.get("/", (req, res) => res.json("classDAO"));
};
