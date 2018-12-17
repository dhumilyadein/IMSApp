var unzipper = require("unzipper");
var fs = require("fs");
var lodash = require("lodash");
var path = require("path");

const rimraf = require("rimraf");
const User = require("../../models/User");
const Student = require("../../models/Student");
const Parent = require("../../models/Parent");
const Teacher = require("../../models/Teacher");
const Admin = require("../../models/Admin");
const FeeTemplate = require("../../models/FeeTemplatesModel");

var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var regex = require("regex-email");

var excelStorage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./ExcelUploads/");
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

var excelUpload = multer({
  //multer settings
  storage: excelStorage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname
          .split(".")
          [file.originalname.split(".").length - 1].toLowerCase()
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

var zipStorage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./ZipUploads/");
  },
  filename: function(req, file, cb) {
    var date = Date.now();
    cb(
      null,

      file.originalname
    );
  }
});

var zipUpload = multer({
  //multer settings
  storage: zipStorage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["zip"].indexOf(
        file.originalname
          .split(".")
          [file.originalname.split(".").length - 1].toLowerCase()
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

module.exports = function(app) {
  async function importValidation(request) {
    var valError = {};
    console.log("in IMPORT VAL  " + request.username);
    var unExp = /^[0-9a-zA-Z]+$/;
    var fnExp = /^[a-zA-Z]+$/;

    //password validaion
    //  if(request.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/))
    //  error[password]="Password should contain atleast 6 characters, inclding 1 special symbol and 1 number";
    try {


      if (!request.username) valError["UserName"] = "Username can't be empty";
      else {
        const usernameCheck = await User.findOne({
          username: request.username
        });

        if (usernameCheck)
          valError["UserExists"] =
            "UserName: " + request.username + " is already in use";
        //  console.log("unexists: " + valError['UserExists']);
      }

      if (!request.email) valError["Email"] = "Email can't be empty";
      else if (!regex.test(String(request.email).toLowerCase()))
        valError["Email"] = "Email is not valid";
      else {
        const emailCheck = await User.findOne({ email: request.email });

        if (emailCheck)
          valError["EmailExists"] =
            "email: " + request.email + " is already in use";
        //console.log("emailexists: " + valError['EmailExists']);
      }
    } catch (e) {
      console.log(e);
    }
if(request.role.indexOf("student")!==-1)
{if(request.feeTemplate.length===0)
valError["FeeTemplate"] = "Fee template is empty"
 else
   { for(var i=0;i<request.feeTemplate.length;i++)
    {
    const feeTemp = await FeeTemplate.findOne({ templateName: request.feeTemplate[i] });
if(!feeTemp){
valError["FeeTemplate"] = "Fee template "+request.feeTemplate[i]+" doesn't exist"
break;
    }}}}


    if (!request.firstname) valError["FirstName"] = "firstname can't be empty";
    else if (!request.firstname.match(fnExp))
      valError["FirstName"] = "firstname should contain only letters";

    if (!request.lastname) valError["LastName"] = "lastname can't be empty";
    else if (!request.lastname.match(fnExp))
      valError["LastName"] = "lastname should contain only letters";

    if (request.role.length === 0)
      valError["EmptyRole"] = "role can't be empty";
    else if (request.role.length > 1 && request.role.indexOf("student") !== -1)
      valError["InvalidRole"] = "Student can't have multiple roles";
    else {
      for (let i = 0; i < request.role.length; i++) {
        if (!/^(admin|teacher|student|parent)$/.exec(request.role[i]))
          valError["InvalidRole"] = "role(s) are not defined correctly";
      }
    }

    if (!request.dob) valError["DateOfBirth"] = "Date of Birth can't be empty";

    if (!request.gender) valError["Gender"] = "Gender can't be empty";

    if (!request.bloodgroup)
      valError["BloodGroup"] = "Bloodgroup can't be empty";

    if (!request.nationality)
      valError["Nationality"] = "Nationality can't be empty";

    if (!request.religion) valError["Religion"] = "Religion can't be empty";

    if (!request.category) valError["Category"] = "category can't be empty";

    if (!request.address) valError["Address"] = "Address can't be empty";

    if (!request.phone) valError["Phone"] = "Phone can't be empty";

    if (!request.city) valError["City"] = "City can't be empty";

    if (!request.postalcode)
      valError["PostalCode"] = "PostalCode can't be empty";

    if (!request.state) valError["State"] = "State can't be empty";

    if (request.role.indexOf("student") !== -1) {
      if (!request.admissionno)
        valError["AdmissionNo"] = "Admission no can't be empty";

      if (!request.rollno) valError["RollNo"] = "Roll No can't be empty";

      if (!request.parentfirstname)
        valError["ParentfirstName"] = "Parent's FirstName can't be empty";

      if (!request.parentlastname)
        valError["ParentLastName"] = "Parent's LastName can't be empty";

      if (!request.relation)
        valError["ParentRelation"] = "Parent's Relation can't be empty";

      if (!request.occupation)
        valError["Occupation"] = "Parent's Occupation can't be empty";

      if (!request.parentphone1)
        valError["ParentPhone1"] = "Parent's Phone Number1 can't be empty";

      if (!request.parentaddress)
        valError["ParentAddress"] = "Parent's Address can't be empty";

      if (!request.parentcity)
        valError["ParentCity"] = "Parent's City can't be empty";

      if (!request.parentpostalcode)
        valError["ParentPostalCode"] = "Parent's Postal code can't be empty";

      if (!request.parentstate)
        valError["ParentState"] = "Parent's State can't be empty";

      if (!request.parentpassword)
        valError["ParentPassword"] = "Parent's password can't be empty";

      if (!request.parentusername)
        valError["ParentUserName"] = "Parent Username can't be empty";
      else {
        const usernameCheck = await User.findOne({
          username: request.parentusername
        });
        if (usernameCheck)
          valError["ParentUserNameExists"] =
            "UserName: " + request.parentusername + " is already in use";
      }

      if (!request.parentemail)
        valError["ParentEmail"] = "Parent's Email can't be empty";
      else if (!regex.test(String(request.parentemail).toLowerCase()))
        valError["ParentEmail"] = "Email is not valid";
      else {
        const emailCheck = await User.findOne({ email: request.parentemail });
        if (emailCheck)
          valError["ParentEmailExists"] =
            "email: " + request.parentemail + " is already in use";
        // console.log("emailexists: " + valError['EmailExists']);
      }
    } else {
      if (!request.qualification)
        valError["Qualification"] = "Qualification can't be empty";

      if (!request.maritalstatus)
        valError["MaritalStatus"] = "Marital Status can't be empty";

      if (!request.employeeno)
        valError["EmployeeNo"] = "Employee No can't be empty";
      if (request.type.toLowerCase() === "experienced") {
        if (!request.experiencedetails)
          valError["ExperienceDetails"] = "Experience Details can't be empty";
      }

      if (!request.type)
        valError["EmployeeType"] = "Employee Type can't be empty";

      if (!request.department)
        valError["Department"] = "Department  can't be empty";

      if (!request.designation)
        valError["Designation"] = "Designation  can't be empty";
    }

    // console.log("Import error: " + JSON.stringify(valError));
    //var obj = JSON.parse(error);
    var errorLen = Object.keys(valError).length;
    // console.log("ValErrorLen: " + errorLen);

    return valError;
  }


  async function importExcel(req, res) {


    console.log("in import Excel  ");

    var exceltojson;

    await rimraf("./ExcelUploads/*.*", function(e) {
      console.log(e);
      console.log("Deleted Excel");

      excelUpload(req, res, function(err) {
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
        //  console.log(req.file.path);
        try {
          exceltojson(
            {
              input: req.file.path,
              output: null, //since we don't need output.json
              lowerCaseHeaders: true
            },
            async function(err, result) {
              if (err) {
                return res.json({ error_code: 1, err_desc: err, data: null });
              }

              // console.log("Total records: " + Object.keys(result).length);
              var importErrors = {};
              for (let i = 0; i < result.length; i++) {
                //console.log("Result: "+i+ " "+ JSON.stringify(result[i]));
                //console.log("record length: "+Object.keys(result[i]).length);
                var counter = 0;
                for (var key in result[i]) {
                  //console.log("key "+  result[i][key]  );
                  if (result[i][key] === "") counter++;
                }
                console.log(
                  "resLen counter: " +
                    Object.keys(result[i]).length +
                    "  " +
                    counter
                );
                if (counter === Object.keys(result[i]).length) continue;

                if (Object.keys(result[i]).length !== 43) {
                  importErrors["record: " + (i + 1) + " "] =
                    " Incomplete record as some columns are missing! ";

                  continue;
                }

                try {
                  var data = fs.readFileSync(
                    "ZipUploads//" + result[i].username + ".jpg"
                  );
                } catch (err) {
                  console.log("In Photo Catch: readFile Error " + err);
                  importErrors[
                    "record# " + (i + 1) + " of user: " + result[i].username
                  ] =
                    "User's Photo not found or incorrect data is passed in excel";
                  continue;
                }

                var roles =
                result[i].role.split(",").map(function(item) {
                  if(item!=="")
                  return item.trim();
                });

                result[i]["role"] =  roles.filter(function (el) {
                  return el;
                });

                 console.log("Result with Updated Roles: "+i+ " "+ JSON.stringify(result[i]));
                // console.log("Fresher Yes : " + result[i].type.toLowerCase);
                if (result[i].type.toLowerCase() === "fresher") {
                  result[i].experiencedetails = "NA";
                }
                if (result[i].role.indexOf("student") !== -1)
       {
        var  feeTemp= result[i].feetemplate.split(",").map(function(item) {
          if(item!=="")
          return item.trim();
        });


result[i]["feeTemplate"]=feeTemp.filter(function (el) {
  return el;
});

console.log("Fee temp: "+result[i].feeTemplate);
console.log("Role: "+result[i].role);
       }



                var impValResult = await importValidation(result[i]);
                console.log(
                  "impValResultLength: " + Object.keys(impValResult).length
                );

                // impValResult length check

                if (Object.keys(impValResult).length === 0) {
                  // console.log("result[i].role: " + result[i].role);
                  var user = null;
                  if (result[i].role.indexOf("student") !== -1) {
                    var parentUser = {
                      username: result[i].parentusername,
                      firstname: result[i].parentfirstname,
                      lastname: result[i].parentlastname,
                      email: result[i].parentemail,
                      password: result[i].parentpassword,
                      role: "parent",
                      status: result[i].status
                    };
                    //Saving Parent in users
                    user = await new User(parentUser);

                    user.password = user.hashPassword(user.password);

                    await user
                      .save()
                      .then(user => {})
                      .catch(err => {
                        return res.send(err);
                      });
                    // console.log("Parent user  = " + user);

                    result[i]["userid"] = user.userid;
                    user = new Parent(result[i]);

                    user.parentpassword = user.hashPassword(
                      user.parentpassword
                    );
                    await user
                      .save()
                      .then(user => {
                        //  return res.json(user);
                      })
                      .catch(err => {
                        return res.send(err);
                      });
                    // console.log("Parent = " + user);

                    var { userid, ...temp } = result[i];

                    result[i] = temp;

                    //Saving Student in users
                    user = await new User(result[i]);

                    user.password = user.hashPassword(user.password);
                    await user
                      .save()
                      .then(user => {})
                      .catch(err => {
                        return res.send(err);
                      });

                    // console.log(" Student user = " + user);
                    result[i]["userid"] = user.userid;

                    user = await new Student(result[i]);
                    // console.log("Student = " + user);
                    user.password = user.hashPassword(user.password);
                    user.photo.data = fs.readFileSync(
                      "ZipUploads//" + result[i].username + ".jpg"
                    );

                    user.photo.contentType = "image/png";
                    await user
                      .save()
                      .then(user => {
                        //  return res.json(user);
                      })
                      .catch(err => {
                        return res.send(err);
                      });
                  } else {
                    /* var empUser = {
                    "username": result[i].username, "firstname": result[i].firstname, "lastname": result[i].lastname,
                    "email": result[i].email, "password": result[i].password, "role": result[i].role, "status": result[i].status
                  }; */
                    user = new User(result[i]);

                    user.password = user.hashPassword(user.password);
                    await user
                      .save()
                      .then(user => {
                        result[i]["userid"] = user.userid;
                      })
                      .catch(err => {
                        return res.send(err);
                      });
                    //  console.log("empUser = " + user);

                    if (result[i].role.indexOf("admin") !== -1) {
                      user = new Admin(result[i]);
                      // console.log("Admin = " + user);
                      user.password = user.hashPassword(user.password);
                      user.photo.data = fs.readFileSync(
                        "ZipUploads//" + result[i].username + ".jpg"
                      );

                      user.photo.contentType = "image/png";
                      await user
                        .save()
                        .then(user => {
                          //  return res.json(user);
                        })
                        .catch(err => {
                          return res.send(err);
                        });
                    }

                    if (result[i].role.indexOf("teacher") !== -1) {
                      user = new Teacher(result[i]);
                      //console.log("Teacher = " + user);
                      user.password = user.hashPassword(user.password);
                      user.photo.data = fs.readFileSync(
                        "ZipUploads//" + result[i].username + ".jpg"
                      );

                      user.photo.contentType = "image/png";
                      await user
                        .save()
                        .then(user => {
                          //  return res.json(user);
                        })
                        .catch(err => {
                          return res.send(err);
                        });
                    }
                  }
                } else {
                  importErrors[
                    "    record# " + (i + 1) + " of user: " + result[i].username
                  ] = impValResult;
                }
              }
              console.log("IMPORT ERRORS: " + JSON.stringify(importErrors));

              if (Object.keys(importErrors).length > 0)
                return res.send({ errors: importErrors });
              else return res.send({msg:"Imported Successfully", excelfilename:req.file.originalname});
            }
          );
        } catch (e) {
          console.log(e);
          res.json({ error_code: 2, err_desc: "Corupted excel file" });
        }
      });
    });
  }



  function photoZipUploading(req, res) {
    console.log("in Photo ZipUpload");

    rimraf("./ZipUploads/*.*", function(e) {
      console.log(e);
      console.log("Deleted Photos");

      zipUpload(req, res, function(err) {
        if (err) {
          res.json({ error_code: 1, err_desc: err });
        } else if (!req.file)
        /** Multer gives us file info in req.file object */
          res.json({ error_code: 1, err_desc: "No file passed" });
        else {
          console.log(req.file.path);
          zipPath = req.file.path;

          fs.createReadStream(zipPath).pipe(
            unzipper.Extract({ path: "ZipUploads" })
          );

          res.json({
            success: true,
            message: "zip " + req.file.originalname + " uploaded to " + zipPath
          });
        }
      });
    });
  }


  app.post("/api/photoZipUploading", photoZipUploading);
  app.post("/api/importExcel", importExcel);
  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------
};
