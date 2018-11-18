var util = require('util');

var { check } = require("express-validator/check");

const User = require("../../models/User");

module.exports = function(app) {
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
  function searchUsers(req, res) {

    console.log("SEARCH USER ENTRY");

    var using = req.body.using;
    var find = req.body.find;
    var searchCriteria = req.body.searchCriteria;
    console.log("find - " + find + " using - " + using + " searchCriteria - " + searchCriteria);

    if ("contains" === searchCriteria) {

      User.find({ [using]: /[find]/ })
        .then(function (userData) {

          console.log("SEARCH USER RESULT CONTAINS- \n" + userData);
          res.send(userData);

        })
        .catch(function (error) {
          console.log(error);
        });

    } else {

      console.log("find - " + find + " using - " + using + " searchCriteria - " + searchCriteria);

      User.find({ [using]: [find] })
        .then(function (userData) {

          console.log("SEARCH USER RESULT EQUALS - \n" + userData);
          res.send(userData);

        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //console.log("searchString - " + JSON.stringify(searchString));

    console.log("SEARCH USER EXIT");
  }

  app.post("/api/searchUsers", serValidation, searchUsers);
  app.get("/", (req, res) => res.json("sdasdsa"));
};
