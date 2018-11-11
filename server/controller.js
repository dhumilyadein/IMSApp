
var { check, validationResult } = require("express-validator/check");

const User = require("./models/User");

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' +
       file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var upload = multer({ //multer settings
              storage: storage,
              fileFilter : function(req, file, callback) { //file filter
                  if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                      return callback(new Error('Wrong extension type'));
                  }
                  callback(null, true);
              }
          }).single('file');


module.exports = function (app) {


   
  const serValidation= [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 6 letters"),

      check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ];


  const regValidation = [
    check("role")
      .not()
      .isEmpty()
      .withMessage("Please select atleast one Role"),

    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 6 letters"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),
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
      .isLength({ min: 1 })
      .withMessage("Last name should be at least 2 letters"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4 })
      .withMessage("Password should be at least 6 characters"),
    check(
      "password_con",
      "Password confirmation  is required or should be the same as password"
    ).custom(function (value, { req }) {
      if (value !== req.body.password) {
        throw new Error("Password don't match");
      }
      return value;
    }),
    check("email").custom(value => {
      return User.findOne({ email: value }).then(function (user) {
        if (user) {
          throw new Error("This email is already in use");
        }
      });
    }),
    check("username").custom(value => {
      return User.findOne({ username: value }).then(function (user) {
        if (user) {
          throw new Error("This username is already in use");
        }
      });
    })
  ];

  const importValidation= [];

  function search(req, res) {

    console.log("\n SEARCH ENTER - " + req.body.username );

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
            resMsg = { error: true, message: "User does not exist! Please check the username." }
          
          } else {
            req.session.user = userData;
            req.session.isLoggedIn = true;
            resMsg = { error: false, message: "user Found", userData };
          }

          if (resMsg) {
            return res.send(resMsg);
          } else {
            console.log("No response from the loginUser service");
            return res.send({ error: true, message: "Login failed.. something went wrong." });
          }
          console.log("userData - " + userData + " resMsg - " + resMsg);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function register(req, res) {

    console.log("in Register");
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
function importExcel(req,res)
{ 
  console.log("in import  " + !req.file);

  var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
               
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                      
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    res.json({error_code:0,err_desc:null, data: result});
                    //console.log("result length: " +data.length)
                   for(i=0;i<result.length;i++)
                   {
                    var user=new User(result[i]);
                    if(result[i].role1)
                    user.role.push(result[i].role1);
                    if(result[i].role2)
                    user.role.push(result[i].role2);
                    if(result[i].role3)
                    user.role.push(result[i].role3);
                    console.log("User: " + user);

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


                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
       

 
      }





  app.post("/api/importExcel", importValidation, importExcel);
  app.post("/api/register", regValidation, register);
  app.post("/api/search", serValidation, search );
  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------
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

  /**
   * @description Used to authenticate user
   * @param {*} req
   * @param {*} res
   */
  function loginUser(req, res) {

    console.log("\n\nloginUser ENTER - " + req.body.username + " " + req.body.password);

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
        resMsg = { error: true, message: "Login validation failed... Something went wrong!" };
      }

      // Terminating flow as validation fails.
      return res.send(resMsg);
    } else {
      //Fetching user from Mongo after initial validation is done
      User.findOne({
        username: req.body.username
      })
        .then(function (userData) {

          console.log("userData - " + userData);
          if (!userData) {
            resMsg = { error: true, message: "User does not exist! Please check the username." }
          } else if (!userData.comparePassword(req.body.password, userData.password)) {
            resMsg = { error: true, message: "Wrong password! Try again." }
          } else {
            req.session.user = userData;
            req.session.isLoggedIn = true;
            resMsg = { error: false, message: "Authentication Successful.. You are signed in.", userData };
          }

          if (resMsg) {
            return res.send(resMsg);
          } else {
            console.log("No response from the loginUser service");
            return res.send({ error: true, message: "Login failed.. something went wrong." });
          }
          console.log("userData - " + userData + " resMsg - " + resMsg);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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




  app.get("/api/logout", (req, res) => {
    req.session.destroy();
    res.send({ message: "Logged out!" });
  });
};
