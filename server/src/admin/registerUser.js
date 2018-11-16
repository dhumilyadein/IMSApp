var util = require('util')

var { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var regex = require('regex-email');
var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

module.exports = function(app) {
 function importValidation(request)
 { error ={};
  console.log("in IMPORT VAL  "+ request.username);
  var unExp = /^[0-9a-zA-Z]+$/;
  var fnExp = /^[a-zA-Z]+$/;

//password validaion
//  if(request.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) 
//  error[password]="Password should contain atleast 6 characters, inclding 1 special symbol and 1 number";

  if(!request.username)
  error["username"]="Username can't be empty";
  else if(!request.username.match(unExp))
  error["username"]="Username should be alphanumeric";
  else{
    User.findOne({ username: request.username }).then(function(user) {
      if (user) {
        error["user-exists"]="This username is already in use";
      }
    });
  }


  if(!request.firstname)
  error["firstname"]="firstname can't be empty";
  else if(!request.firstname.match(fnExp))
  error["firstname"]="firstname should contain only letters";

  
  if(!request.lastname)
  error["lastname"]="lastname can't be empty";
  else if(!request.lastname.match(fnExp))
  error["lastname"]="lastname should contain only letters";

  if(!request.email)
  error["email"]="Email can't be empty";
 else if(!regex.test(String(request.email).toLowerCase()))
  error["email"]="Email is not valid";
  else
  { User.findOne({ email: request.email }).then(function(user) {
    if (user) {
      error["email-exists"]="This email is already in use";
    }
  });

  }

  
  if(request.role.length===0)
  error["role"]="role can't be empty";
  else{
    for(let i=0;i<request.role.length;i++)
    {if (!/^(admin|teacher|student|parent)$/.exec(request.role[i]))
      error["role"]="role(s) are not defined correctly";

    }
  }
//console.log("Import error: "+JSON.stringify(error));
return error;


 }


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
    }),
    check("username").custom(value => {
      return User.findOne({ username: value }).then(function(user) {
        if (user) {
          throw new Error("This username is already in use");
        }
      });
    })
  ];

  function register(req, res) {
    console.log("\n\nREGISTER req.body: " + JSON.stringify(req.body) + "\n");

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }

    var user = new User(req.body);
    console.log("user = " + user);
    user.password = user.hashPassword(user.password);
    user
      .save()
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        return res.send(err);
      });
  }

  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
  function importExcel(req, res) {
   // console.log("in import  " + !req.file);

    var exceltojson;
    upload(req, res, function(err) {
      if (err) {
        res.json({ error_code: 1, err_desc: err });
        return;
      }
      /** Multer gives us file info in req.file object */
      if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });

        return;
      }
      /** Check the extension of the incoming file and
       *  use the appropriate module
       */
      if (
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ] === "xlsx"
      ) {
        exceltojson = xlsxtojson;
      } else {
        exceltojson = xlstojson;
      }
      console.log(req.file.path);
      try {
        exceltojson(
          {
            input: req.file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders: true
          },
          function(err, result) {
            if (err) {
              return res.json({ error_code: 1, err_desc: err, data: null });
            }
            var importErrors ={};
            for (let i = 0; i < result.length; i++) {
              var roles = [];
              if (result[i].role1) roles.push(result[i].role1);
              if (result[i].role2) roles.push(result[i].role2);
              if (result[i].role3) roles.push(result[i].role3);
            
              
              result[i]["role"] = roles;
              var { role1, ...temp } = result[i];
              var { role2, ...temp } = temp;
              var { role3, ...temp } = temp;

              result[i] = temp;

              result[i].role =  result[i].role.filter( onlyUnique );
              
              var impValResult=importValidation(result[i]);
             
               
              if (impValResult) {

                importErrors["record# "+(i+1)] = impValResult;
                
              }

              else
              {let user = new User(result[i]);
                //console.log(" result.username: " + result[i].username);
                
                  
  
                      console.log("User: " + user);
  
                      user.password = user.hashPassword(user.password);
  
                      user
                        .save()
                        .then(user => {
                          return res.json(user);
                        })
                        .catch(err => {
                          return res.send(err);
                        });}

              
         
                          }
                          console.log("IMPORT ERRORS: "+ JSON.stringify(importErrors));
                          return res.send({errors:importErrors});
           
                      
                 
                 
                }
              );
            
          
        
      } catch (e) {
        console.log(e);
        res.json({ error_code: 2, err_desc: "Corupted excel file" });
      }
    });
  }

  app.post("/api/importExcel", regValidation, importExcel);
  app.post("/api/register", regValidation, register);

  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------




};