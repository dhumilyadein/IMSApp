var util = require('util')

var { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

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
  function importExcel(req, res) {
    console.log("in import  " + !req.file);

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

            for (let i = 0; i < result.length; i++) {
              var roles = [];
              if (result[i].role1) roles.push(result[i].role1);
              if (result[i].role2) roles.push(result[i].role2);
              if (result[i].role3) roles.push(result[i].role3);
              console.log("roles: " + roles);
              var newrole = "role";
              result[i][newrole] = roles;
              var { role1, ...temp } = result[i];
              var { role2, ...temp } = temp;
              var { role3, ...temp } = temp;

              result[i] = temp;

             /*  console.log("\n\n\n\n\n\nBEFORE req: " + util.inspect(req));
              //console.log("\n\nBEFORE req.body: " + JSON.stringify(req) + "\n");
              req.body = result[i];
              console.log("\n\n\n\n\n\nAFTER req.body: " + JSON.stringify(req.body) + "\n");
              console.log("\n\n\n\n\n\nAFTER req.body: " + JSON.stringify(req.body) + "\n");
              console.log("\n\nIMPORT EXCEL req.body: " + JSON.stringify(req.body) + "\n");
              var errors = validationResult(req);

              if (!errors.isEmpty()) {
                return res.json({ errors: errors.mapped() });
              } */
              console.log("result "+i+" : "+ JSON.stringify(result[i]));
            }

            //console.log("New result: " + result);

            var warning = [];

            var counter = 0;
            for (let i = 0; i < result.length; i++) {
              let user = new User(result[i]);
              //console.log(" result.username: " + result[i].username);
              User.findOne(
                {
                  $or: [
                    { username: result[i].username },
                    { email: result[i].email }
                  ]
                },
                function(err, doc) {
                  if (doc === null) {
                    console.log(
                      "result: " + i + " :" + JSON.stringify(result[i])
                    );

                    console.log("User: " + user);

                    user.password = user.hashPassword(user.password);

                    user
                      .save()
                      .then(user => {
                        return res.json(user);
                      })
                      .catch(err => {
                        return res.send(err);
                      });
                  } else if (doc) {
                    warning.push(
                      "#" +
                        i +
                        " Username: " +
                        result[i].username +
                        " or Email: " +
                        result[i].email +
                        " already exists"
                    );


                    console.log("warn: " + warning);
                  }
                  counter++;

                  if (counter === result.length) {
                    return res.json({
                      error_code: 0,
                      err_desc: null,
                      data: result,
                      warn: warning
                    });
                  }
                }
              );
            }
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
