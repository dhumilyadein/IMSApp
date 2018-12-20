var util = require('util');

var { check } = require("express-validator/check");

const Parent = require("../../models/Parent");

module.exports = function (app) {
  const serValidation = [
    check("find")
      .not()
      .isEmpty()
      .withMessage("Please enter Search Text")
  ];



  //---------------------------------------------

  /**
     * @description Post method for SearchUser service
     */
  function searchParent(req, res) {

    console.log("SEARCH Parent ENTRY");

    var using = req.body.using;
    var find = req.body.find;
    var searchCriteria = req.body.searchCriteria;
    var searchJSON = {};

    if ("containsSearchCriteria" === searchCriteria) {
      find = "/" + find + "/i";
    } else {
      find = "/^" + find + "$/i";
    }

    searchJSON = {
      [using]: { $regex: eval(find) }
    }

    console.log("findValue - " + JSON.stringify(req.body));

    Parent.findOne(searchJSON)
      .then(function (parentData) {

        console.log("SEARCH PARENTS RESULT " + searchCriteria + "\n" + parentData + " find - " + find + " using - " + using);
        res.send(parentData);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  app.post("/api/searchParent", searchParent);
  app.get("/", (req, res) => res.json("Get request"));
};
