
var fs = require('fs');
const rimraf = require('rimraf');
var { check, validationResult } = require("express-validator/check");
let photoPath=null;
const User = require("../../models/User");
const Student = require("../../models/Student");
const Parent = require("../../models/Parent");
const Teacher = require("../../models/Teacher");
const Admin = require("../../models/Admin");

var multer = require("multer");

var photoStorage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./PhotoUploads/");
  },
  filename: function(req, file, cb) {
    var datetimestamp =  Date.now();
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



 var photoUpload = multer({
  //multer settings
  storage: photoStorage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["jpg"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1].toLowerCase()
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");




module.exports = function (app) {



  const studentRegValidation = [


    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 6 letters"),

    check("parentusername")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 6 letters"),

    check("bloodgroup")
      .not()
      .isEmpty()
      .withMessage("Please select Bloodgroup"),

      check("selectedFeeTemplate")
      .not()
      .isEmpty()
      .withMessage("Please select Fee Template(s)"),

    check("gender")
      .not()
      .isEmpty()
      .withMessage("Please select Gender"),

    check("nationality")
      .not()
      .isEmpty()
      .withMessage("Please select Nationality"),

    check("dob")
      .not()
      .isEmpty()
      .withMessage("Please select Date of Birth"),

    check("doj")
      .not()
      .isEmpty()
      .withMessage("Please select Date of Joining"),

    check("religion")
      .not()
      .isEmpty()
      .withMessage("Please select Religion"),

    check("category")
      .not()
      .isEmpty()
      .withMessage("Please select Category"),

    check("phone")
      .not()
      .isEmpty()
      .withMessage("Please enter Phone No")
      .isLength({ min: 15 })
      .withMessage("Incorrect Phone No"),

    check("parentphone1")
      .not()
      .isEmpty()
      .withMessage("Please enter Phone No")
      .isLength({ min: 15 })
      .withMessage("Incorrect Phone No"),

    check("address")
      .not()
      .isEmpty()
      .withMessage("Please enter Address"),

    check("city")
      .not()
      .isEmpty()
      .withMessage("Please enter City"),

    check("postalcode")
      .not()
      .isEmpty()
      .withMessage("Please enter Postal Code"),

    check("state")
      .not()
      .isEmpty()
      .withMessage("Please enter State"),


    check("parentaddress")
      .not()
      .isEmpty()
      .withMessage("Please enter Address"),

    check("parentcity")
      .not()
      .isEmpty()
      .withMessage("Please enter City"),

    check("parentpostalcode")
      .not()
      .isEmpty()
      .withMessage("Please enter Postal Code"),

    check("parentstate")
      .not()
      .isEmpty()
      .withMessage("Please enter State"),

      check("relation")
      .not()
      .isEmpty()
      .withMessage("Please select Relation"),

    check("occupation")
      .not()
      .isEmpty()
      .withMessage("Please enter Occupation"),





    check("admissionno")
      .not()
      .isEmpty()
      .withMessage("Please enter Admission No")
      .isNumeric()
      .withMessage("Admission No should be Numeric"),



    check("rollno")
      .not()
      .isEmpty()
      .withMessage("Please enter Roll No")
      .isNumeric()
      .withMessage("Roll No should be Numeric"),

    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),

    check("parentemail")
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
      .withMessage("Number(s) not allowed here"),

    check("lastname")
      .not()
      .isEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 1 })
      .withMessage("Last name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Number(s) not allowed here"),

    check("parentfirstname")
      .not()
      .isEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("Name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Number(s) not allowed here"),

    check("parentlastname")
      .not()
      .isEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 1 })
      .withMessage("Last name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Number(s) not allowed here"),

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

    check("parentpassword")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4 })
      .withMessage("Password should be at least 6 characters"),
    check(
      "parentpassword_con",
      "Password confirmation  is required or should be the same as password"
    ).custom(function (value, { req }) {
      if (value !== req.body.parentpassword) {
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
    check("parentemail").custom(value => {
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
    }),

    check("parentusername").custom(value => {
      return User.findOne({ username: value }).then(function (user) {
        if (user) {
          throw new Error("This username is already in use");
        }
      });
    })

  ];

  const empRegValidation = [


    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 6 letters"),

    check("bloodgroup")
      .not()
      .isEmpty()
      .withMessage("Please select Bloodgroup"),

    check("gender")
      .not()
      .isEmpty()
      .withMessage("Please select Gender"),

    check("nationality")
      .not()
      .isEmpty()
      .withMessage("Please select Nationality"),

    check("dob")
      .not()
      .isEmpty()
      .withMessage("Please select Date of Birth"),

    check("doj")
      .not()
      .isEmpty()
      .withMessage("Please select Date of Joining"),

    check("religion")
      .not()
      .isEmpty()
      .withMessage("Please select Religion"),

    check("category")
      .not()
      .isEmpty()
      .withMessage("Please select Category"),

    check("phone")
      .not()
      .isEmpty()
      .withMessage("Please enter Phone No")
      .isLength({ min: 15 })
      .withMessage("Incorrect Phone No"),



    check("address")
      .not()
      .isEmpty()
      .withMessage("Please enter Address"),

    check("city")
      .not()
      .isEmpty()
      .withMessage("Please enter City"),

    check("postalcode")
      .not()
      .isEmpty()
      .withMessage("Please enter Postal Code"),

    check("state")
      .not()
      .isEmpty()
      .withMessage("Please enter State"),




    check("qualification")
      .not()
      .isEmpty()
      .withMessage("Please enter Qualification"),

    check("maritalstatus")
      .not()
      .isEmpty()
      .withMessage("Please enter Marital Status"),


    check("type")
      .not()
      .isEmpty()
      .withMessage("Please select Type of Employee"),

    check("department")
      .not()
      .isEmpty()
      .withMessage("Please select Department"),

    check("designation")
      .not()
      .isEmpty()
      .withMessage("Please select Designation"),

    check("experiencedetails")
      .not()
      .isEmpty()
      .withMessage("Please enter Experience Details"),



    check("employeeno")
      .not()
      .isEmpty()
      .withMessage("Please enter Employee No")
      .isNumeric()
      .withMessage("Employee No should be Numeric"),



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
      .withMessage("Number(s) not allowed here"),

    check("lastname")
      .not()
      .isEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 1 })
      .withMessage("Last name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Number(s) not allowed here"),



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


  async function studentRegister(req, res) {
    console.log("\n\n studentREGISTER req.body: " + JSON.stringify(req.body) + "\n");

    var errors = validationResult(req);
// if(req.body.photoerror||req.body.corruptphoto)

// return res.send({ photoerror: "Photo is corrupt or not selected" });

    if (!errors.isEmpty()) {
     // console.log("ERRORS" + errors.mapped());
      return res.send({ errors: errors.mapped() });
    }




    var parentUser = {
      "username": req.body.parentusername, "firstname": req.body.parentfirstname, "lastname": req.body.parentlastname,
      "email": req.body.parentemail, "password": req.body.parentpassword, "role": "parent", status: req.body.status
    };
    var user = new User(parentUser);
   // console.log("user = " + user);
    user.password = user.hashPassword(user.password);
    await user
      .save()
      .then(user => {
        //  return res.json(user);
      })
      .catch(err => {
        return res.send(err);
      });

req.body["userid"]=user.userid;
      user = new Parent(req.body);
     // console.log("user = " + user);
      user.parentpassword = user.hashPassword(user.parentpassword);
      await user
        .save()
        .then(user => {
          //  return res.json(user);
        })
        .catch(err => {
          return res.send(err);
        });

        var {userid, ...temp}=req.body;
        req.body=temp;

    var studentUser = {
      "username": req.body.username, "firstname": req.body.firstname, "lastname": req.body.lastname,
      "email": req.body.email, "password": req.body.password, "role": "student", "status": req.body.status
    };
    user = new User(studentUser);
  //  console.log("user = " + user);
    user.password = user.hashPassword(user.password);
    await user
      .save()
      .then(user => {
        // return res.json(user);
      })
      .catch(err => {
        return res.send(err);
      });


      req.body["userid"]=user.userid;


    user = new Student(req.body);
    //console.log("user = " + user);
    user.password = user.hashPassword(user.password);
    user.photo.data = fs.readFileSync(photoPath);
    user.photo.contentType = 'image/png';
    user.feeTemplate=req.body.selectedFeeTemplate;


    await user
      .save()
      .then(user => {
        //  return res.json(user);
      })
      .catch(err => {
        return res.send(err);
      });


    return res.send({ data: req.body, message: "Registered Successfully" });

  }

  async function empRegister(req, res) {
    console.log("\n\n EmpREGISTER req.body: " + JSON.stringify(req.body) + "\n");

    var errors = validationResult(req);
    // if(req.body.photoerror||req.body.corruptphoto)

    // return res.send({ photoerrors: "Photo is corrupt or not selected" });
    if (!errors.isEmpty()) {
      console.log("ERRORS" + errors.mapped());
      return res.send({ errors: errors.mapped() });
    }

    var empUser = {
      "username": req.body.username, "firstname": req.body.firstname, "lastname": req.body.lastname,
      "email": req.body.email, "password": req.body.password, "role": req.body.role, "status": req.body.status
    };
    user = new User(empUser);
    console.log("empUser = " + user);
    user.password = user.hashPassword(user.password);
    await user
      .save()
      .then(user => {
        // return res.json(user);
      })
      .catch(err => {
        return res.send(err);
      });

req.body["userid"]=user.userid;
    if (req.body.role.indexOf("admin") !== -1) {
      user = new Admin(req.body);
      console.log("Admin = " + user);
      user.password = user.hashPassword(user.password);
      user.photo.data = fs.readFileSync(photoPath);
    user.photo.contentType = 'image/png';
      await user
        .save()
        .then(user => {
          //  return res.json(user);
        })
        .catch(err => {
          return res.send(err);
        });
    }

    if (req.body.role.indexOf("teacher") !== -1) {
      user = new Teacher(req.body);
      console.log("Teacher = " + user);
      user.password = user.hashPassword(user.password);
      user.photo.data = fs.readFileSync(photoPath);
    user.photo.contentType = 'image/png';
      await user
        .save()
        .then(user => {
          //  return res.json(user);
        })
        .catch(err => {
          return res.send(err);
        });
    }



    return res.send({ data: req.body, message: "Registered Successfully" });
  }





async function photoUploading(req,res)
{
 console.log("in Photo Upload ");

 await rimraf('./PhotoUploads/*.*', function (e) {

  console.log(e);
  console.log('Register - Deleted Photo');
  photoUpload(req, res, function (err) {
    if (err) {
       res.json({ error_code: 1, err_desc: err });
    }
    /** Multer gives us file info in req.file object */
    else if (!req.file)
       res.json({ error_code: 1, err_desc: "No file passed" });
  else{
    console.log(req.file.path);
  photoPath = req.file.path;
  res.json({message:"photo uploaded to " +photoPath});
  }



  });
});


  }




  app.post("/api/empRegister", empRegValidation, empRegister);
  app.post("/api/studentRegister", studentRegValidation, studentRegister);
  app.post("/api/photoUploading", photoUploading);



  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------




};
