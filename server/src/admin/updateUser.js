var util = require('util');
var { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
const Student = require("../../models/Student");
const Parent = require("../../models/Parent");

module.exports = function (app) {

    const updateUserValidation = [
        // check("find")
        //   .not()
        //   .isEmpty()
        //   .withMessage("Please Enter find Text"),

        //   check("using")
        //   .not()
        //   .isEmpty()
        //   .withMessage("Please Enter using Text")
    ];

    async function updateUserDetails(req, res) {

        console.log("updateUser - updateUserDetails - Enter");

        var searchJSON = {};

        //Initial validation like fields empty check
        var errors = validationResult(req);

        //Mapping the value to the same object
        if (!errors.isEmpty()) {
            console.log('updateUser - updateuserDetails - Errors in updateUser - ' + JSON.stringify(errors.mapped()));
            return res.send({ errors: errors.mapped() });
        }

        var currentTime = new Date();
        console.log("current time - " + currentTime);

        var request = req.body;

        await User.findOneAndUpdate(
            { username: request.username },
            {
                $set: {
                    firstname: request.firstname,
                    lastname: request.lastname,
                    email: request.email,
                    status: request.status,
                    updatedAt: currentTime.getDate()
                }
            }
        ).then(function (userData) {

            // console.log("SEARCH USER RESULT " + searchCriteria + "\n" + userData + " find - " + find);
            //res.send(userData);
        }).catch(function (error) {
            console.log(error);
        });

        await Student.findOneAndUpdate(
            { username: request.username },
            {
                $set: {
                    email: request.email,
                    firstname: request.firstname,
                    lastname: request.lastname,
                    parentfirstname: request.parentfirstname,
                    parentlastname: request.parentlastname,
                    parentemail: request.parentemail,
                    parentphone1: request.parentphone1,
                    parentphone2: request.parentphone2,
                    parentpostalcode: request.parentpostalcode,
                    address: request.address,
                    city: request.city,
                    postalcode: request.postalcode,
                    state: request.state,
                    admissionno: request.admissionno,
                    rollno: request.rollno,
                    doj: request.doj,
                    dob: request.dob,
                    gender: request.gender,
                    religion: request.religion,
                    nationality: request.nationality,
                    bloodgroup: request.bloodgroup,
                    category: request.category,
                    phone: request.phone,
                    updatedAt: new Date()
                }
            }
        ).then(function (userData) {

            // console.log("SEARCH USER RESULT " + searchCriteria + "\n" + userData + " find - " + find);
            //res.send(userData);
        }).catch(function (error) {
            console.log(error);
        });

        await Parent.findOneAndUpdate(
            { parentusername: request.parentusername },
            {
                $set: {
                    parentfirstname: request.parentfirstname,
                    parentlastname: request.parentlastname,
                    parentemail: request.parentemail,
                    parentphone1: request.parentphone1,
                    parentphone2: request.parentphone2,
                    parentaddress: request.parentaddress,
                    parentcity: request.parentcity,
                    parentpostalcode: request.parentpostalcode,
                    parentstate: request.parentstate,
                    address: request.address,
                    relation: request.relation,
                    city: request.city,
                    occupation: request.occupation,
                    updatedAt: new Date()
                }
            }
        ).then(function (userData) {

            // console.log("SEARCH USER RESULT " + searchCriteria + "\n" + userData + " find - " + find);
            res.send("UserDetailUpdated");
        }).catch(function (error) {
            console.log(error);
        });
    }

    app.post("/api/updateUserDetails", updateUserValidation, updateUserDetails, (req, res) => {
        console.log("updateUser - updateUserDetails post method call");

    });
};