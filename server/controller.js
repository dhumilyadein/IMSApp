const bodyparser = require("body-parser");
var { check, validationResult } = require("express-validator/check");

const User = require("./models/User");


module.exports = function(app) {
  const regValidation = [
    check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 6 })
    .withMessage("Last name should be at least 6 letters"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email should be an email address"),
    check("firstname")
      .not()
      .isEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("Name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Name cannot have numbers"),
    check("lastname")
      .not()
      .isEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2 })
      .withMessage("Last name should be at least 2 letters"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
    check(
      "password_con",
      "Password confirmation  is required or should be the same as password"
    ).custom(function(value, { req }) {
      if (value !== req.body.password) {
        throw new Error("Password don't match");
      }
      return value;
    }),
    check("email").custom(value => {
      return User.findOne({ email: value }).then(function(user) {
        if (user) {
          throw new Error("This email is already in use");
        }
      });
    })
  ];

  function register(req, res) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    console.log("req body  = " + req.body);
    var user = new User(req.body);
    console.log("user = " + user);
    user.password = user.hashPassword(user.password);
    user
      .save()
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        return res.send(err)
      });
  }

  app.post("/api/register", regValidation, register);
  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------
  const logValidation = [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
  ];
  function loginUser(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    User.findOne({
      username: req.body.username
         }) 
      .then(function(user) {
        if (!user) {
          return res.send({ error: true, message: "User does not exist!" });
        }
        if (!user.comparePassword(req.body.password, user.password)) {
          return res.send({ error: true, message: "Wrong password!" });
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        return res.send({ user, message: "You are signed in" });
        //res.send(user);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  app.post("/api/login", logValidation, loginUser);
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

  const postValidation = [
    check("post")
      .not()
      .isEmpty()
      .withMessage("Please write something.")
  ];

 
 
  app.get("/api/logout", (req, res) => {
    req.session.destroy();
    res.send({ message: "Logged out!" });
  });
};
