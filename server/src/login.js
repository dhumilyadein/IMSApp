var { check, validationResult } = require("express-validator/");

const User = require("../models/User");
module.exports = function(app) {
const logValidation = [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required."),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required.")
  ];


  app.post("/api/login", logValidation, loginUser);
  function loginUser(req, res) {
    console.log(
      "\n\nloginUser ENTER - " + req.body.username + " " + req.body.password
    );

    var resMsg = null;
    var userData = null;

    //Initial validation like fields empty check
    var valResult = validationResult(req);
    if (!valResult.isEmpty()) {
      //Mapping the value to the same object
      valResult = valResult.mapped();

      var validationResultString = JSON.stringify(valResult);
      console.log("validationResultString - " + validationResultString);

      if (valResult.username && valResult.username.msg) {
        resMsg = { error: true, message: valResult.username.msg };
      } else if (valResult.password && valResult.password.msg) {
        resMsg = { error: true, message: valResult.password.msg };
      } else {
        resMsg = {
          error: true,
          message: "Login validation failed... Something went wrong!"
        };
      }

      // Terminating flow as validation fails.
      return res.send(resMsg);
    } else {
      //Fetching user from Mongo after initial validation is done
      User.findOne({
        username: req.body.username
      })
        .then(function(userData) {
          console.log("userData - " + userData);
          if (!userData) {
            resMsg = {
              error: true,
              message: "User does not exist! Please check the username."
            };
          } else if (
            !userData.comparePassword(req.body.password, userData.password)
          ) {
            resMsg = { error: true, message: "Wrong password! Try again." };
          } else {
            req.session.user = userData;
            req.session.isLoggedIn = true;
            resMsg = {
              error: false,
              message: "Authentication Successful.. You are signed in.",
              userData
            };
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


  //----------------------------------------------------
  function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
      res.send(true);
    } else {
      res.send(false);
    }
  }
  app.get("/api/isloggedin", isLoggedIn);

  //--------------------------------------

  app.get("/api/logout", (req, res) => {
    req.session.destroy();
    res.send({ message: "Logged out!" });
  });
};
