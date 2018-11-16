var util = require('util');

var { check } = require("express-validator/check");

const User = require("../../models/User");

<<<<<<< HEAD
module.exports = function (app) {
  const serValidation = [
    check("find")
      .not()
      .isEmpty()
      .withMessage("Please enter Search Text")
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

=======
module.exports = function(app) {
    const serValidation = [
        check("find")
          .not()
          .isEmpty()
          .withMessage("Please enter Search Text")
           ];

           
  
>>>>>>> 8faecca394416d5fb9bcfc01dfd2b1b961c93168
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
