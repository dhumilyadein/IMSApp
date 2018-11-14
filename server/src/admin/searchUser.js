var util = require('util');

var { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

module.exports = function(app) {
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
        .then(function(userData) {
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
        .catch(function(error) {
          console.log(error);
        });
    }
  }

 

  app.post("/api/search", serValidation, search);
  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------
 

 
 
};
