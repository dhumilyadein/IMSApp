var { check, oneOf, validationResult } = require("express-validator/check");
const exams = require("../../models/Exams");

module.exports = function (app) {

  const insertExamValidation = [
    check("examName")
      .not()
      .isEmpty()
      .withMessage("Please Enter exam name"),

    check("applicableForClasses")
      .not()
      .isEmpty()
      .withMessage("Please Enter Applicable for Classes")
  ];

  const insertClassAndSectionInExamsValidation = [
    check("examName")
      .not()
      .isEmpty()
      .withMessage("Please Enter exam name"),

    check("class")
      .not()
      .isEmpty()
      .withMessage("Please Enter Class"),
    check("section")
      .not()
      .isEmpty()
      .withMessage("Please Enter section"),
  ];

  const fetchExamValidation = oneOf([
    check("applicableForClasses")
      .not()
      .isEmpty()
      .withMessage("Please Enter Applicable for Classes")
  ],
    [
      check("examName")
        .not()
        .isEmpty()
        .withMessage("Please Enter Exam name"),
      check("className")
        .not()
        .isEmpty()
        .withMessage("Please Enter Class name")
    ]);

  const ExamNameValidation = [
    check("examName")
      .not()
      .isEmpty()
      .withMessage("Please Enter exam name")
  ];

  async function addexams(req, res) {
    console.log("in addexams Req.body: " + JSON.stringify(req.body))

    var template = {
      "listName": req.body.listName, "dos": req.body.dos, "examRows": req.body.rows,
      "grandTotal": req.body.grandTotal, "remarks": req.body.remarks

    };
    var addexam = new Purchaseexams(template);


    for (var i = 0; i < req.body.rows.length; i++) {

      await exams
        .updateOne({ examName: req.body.rows[i].examName.value },
          {
            $inc: {
              quantity: req.body.rows[i].quantity

            }
          }
        )
        .then(data => {

        })
        .catch(err => {
          return res.send({ error: err });
        });
    }

    addexam
      .save()
      .then(user => {
        return res.send({ "message": "Success" });
      })
      .catch(err => {
        return res.send({ "errors": err });
      });


  }

  async function insertExam(req, res) {

    var request = req.body;
    console.log("in insertExam request - " + JSON.stringify(request))

    var date = new Date();

    // var classWiseExamDetailsArray = [];
    // request.applicableForClasses.forEach(element => {

    //   var emptyArray = [];
    //   var json = {};
    //    json[element] = "emptyArray";
    //   classWiseExamDetailsArray.push(json);
    // });

    // var tempJSON = {};
    // tempJSON.tempExamName = request.examn;

    var examRequest = {
      "examName": request.examName,
      "examDescription": request.examDescription,
      "applicableForClasses": request.applicableForClasses,
      "percentageShareInFinalResult": request.percentageShareInFinalResult,
      "isMandatryToAttendForFinalResult": request.isMandatryToAttendForFinalResult,
      // "classWiseExamDetailsArray": tempJSON,
      "createdAt": new Date(date.getTime() - (date.getTimezoneOffset() * 60000)),
      "updatedAt": new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    };
    var insertExam = new Exams(examRequest);

    await insertExam
      .save()
      .then(user => {
        return res.send({ msg: "Exam inserted successfully" });
      })
      .catch(err => {
        console.log("ExamsDAO - insertExam - ERROR - " + err);
        return res.send({ errors: err });
      });

  }

  async function updateExam(req, res) {

    var request = req.body;
    console.log("examsDAO - in updateExam -  request - " + JSON.stringify(request))

    var date = new Date();


    // request.applicableForClasses.forEach(element => {
    //   classWiseExamDetailsArray.push(element);
    // });
    // var classWiseExamDetailsArray = [];
    // request.applicableForClasses.forEach(element => {

    //   var emptyArray = [];
    //   var json = {};
    //    json[element] = emptyArray;
    //   classWiseExamDetailsArray.push(json);
    // });

    var objForUpdate = {};
    if (request.examDescription) objForUpdate.examDescription = request.examDescription;
    if (request.applicableForClasses) objForUpdate.applicableForClasses = request.applicableForClasses;
    if (request.percentageShareInFinalResult) objForUpdate.percentageShareInFinalResult = request.percentageShareInFinalResult;
    if (request.isMandatryToAttendForFinalResult) objForUpdate.isMandatryToAttendForFinalResult = request.isMandatryToAttendForFinalResult;
    // if(classWiseExamDetailsArray) objForUpdate.classWiseExamDetailsArray = classWiseExamDetailsArray;

    // if(request.classWiseExamDetailsArray) {
    //   objForUpdate.$push = request.classWiseExamDetailsArray;
    // }

    // {"$set": {"studentDetails.$.students":template.students}}

    objForUpdate.updatedAt = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    console.log("\nexamName - " + request.examName + "\nobjForUpdate objForUpdate - " + JSON.stringify(objForUpdate));

    // var udpateJSON = {};
    // if (Object.keys(objForUpdate).length !== 0 && Object.keys(studentsDataJSON).length !== 0) {
    //   udpateJSON = {
    //     $set: objForUpdate,
    //   }
    // } else if (Object.keys(objForUpdate).length !== 0) {
    //   udpateJSON = {
    //     $set: objForUpdate,
    //   }
    // }

    await exams.findOneAndUpdate(
      { "examName": request.examName },
      objForUpdate
    ).then(function (examData) {

      response = { reqbody: req.body, message: "Exam details updated successfully" };
      console.log("examsDAO - updateExam - Exam details udpated successfully - server final response - " + JSON.stringify(response));

      return res.send(response);
    }).catch(function (err) {
      console.log("Catching server err - " + err);
      response = { errors: err };
      console.log("examsDAO - updateExam - Errors in examsDAO - server final response - " + JSON.stringify(response));
      return res.send(response);
    });


  }

  // async function insertClassAndSectionInExamsFind(req, res) {

  //   var request = req.body;

  //   await exams.find(
  //     {
  //       'examName': request.examName,
  //       'classWiseExamDetailsArray.class': request.class,
  //       'classWiseExamDetailsArray.sectionWiseExamDetailsArray.section': request.section
  //     },
  //     {
  //       'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': 1
  //     }
  //   ).then(function (examData) {

  //     console.log("examData HERE HERE HERE HERE- " + examData);
  //     response = { reqbody: examData, message: "Class wise Exam details updated successfully" };
  //     console.log("examsDAO - insertClassAndSectionInExams - Class wise Exam details udpated successfully - server final response - " + JSON.stringify(response));

  //     return res.send(response);
  //   }).catch(function (err) {
  //     console.log("Catching server err - " + err);
  //     response = { errors: err };
  //     console.log("examsDAO - insertClassAndSectionInExams - Errors in examsDAO - server final response - " + JSON.stringify(response));
  //     return res.send(response);
  //   });


  // }

  async function insertClassAndSectionInExams(req, res) {

    var request = req.body;
    console.log("examsDAO - insertClassAndSectionInExams - request - " + JSON.stringify(request));

    var date = new Date();

    await exams.find(
      {
        'examName': request.examName,
        'classWiseExamDetailsArray.class': request.class
      },
      {
        'classWiseExamDetailsArray.$.class': 1
      }
    ).then(function (availableExamClassData) {
      console.log("ExamsDAO - insertClassAndSectionInExams - Fetched already present Class and section array details from Exams collection - availableExamClassData - " + JSON.stringify(availableExamClassData));

      // If availableExamClassData is null, it means the class is not present in the collection and so inserting it for the first time
      if (availableExamClassData.length === 0) {

        console.log("ExamsDAO - insertClassAndSectionInExams - Inserting class first and then section will be inserted");

        /*
        Inserting class details first
        */
        exams.findOneAndUpdate(
          {
            "examName": request.examName
          },
          {
            $addToSet: {
              'classWiseExamDetailsArray': {
                'class': request.class,
                sectionWiseExamDetailsArray: []
              }
            }
          }
        ).then(function (examclassData) {

          console.log("ExamsDAO - insertClassAndSectionInExams - ONLY CLASS array details updated successfully - EXAM MODIFIED - examclassData - " + JSON.stringify(examclassData));

          /**
           * Second, Before updating the new section wise details, deleting the previous section wise details
           */
          exams.update(
            {
              'examName': request.examName,
              'classWiseExamDetailsArray.class': request.class,
            },
            {
              $pull: {
                'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': {
                  'section': request.section,
                }
              }
            }
          ).then(function (examSectionData) {

            console.log("examsDAO deleteSubjectWiseExamDetails - exam subject details updated successfully - " + JSON.stringify(examSectionData));

            /*
                  Third adding the section(s) in the exam
                */
            exams.findOneAndUpdate(
              {
                'examName': request.examName,
                'classWiseExamDetailsArray.class': request.class
                // $set: {'attendance.$.studentsInfo': request.attendance.studentsInfo}
              },
              {
                $addToSet: {
                  'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': {
                    'section': request.section,
                    'examDetails': request.examDetails
                  }
                },
                $set: {
                  'classWiseExamDetailsArray.$.percentageShareInFinalResult': request.percentageShareInFinalResult,
                  'classWiseExamDetailsArray.$.isMandatryToAttendForFinalResult': request.isMandatryToAttendForFinalResult
                }
                // $addToSet: { "classWiseExamDetailsArray.$": request.section }
              }
            ).then(function (examSectionData) {

              console.log("examsDAO - insertClassAndSectionInExams - Class and section array details updated successfully - EXAM MODIFIED - " + JSON.stringify(examSectionData));

              response = { response: examSectionData, message: "examsDAO - insertClassAndSectionInExams - Class and section array details updated successfully - EXAM MODIFIED" };
              return res.send(response);

            }).catch(function (err) {

              console.log("examsDAO - insertClassAndSectionInExams - Catching server ERROR while setting Exam SECTION array details - " + JSON.stringify(err));

              response = { errors: err };
              return res.send(response);
            });

          }).catch(function (err) {
            console.log("examsDAO deleteSubjectWiseExamDetails - Catching server ERROR - " + JSON.stringify(err));
            response = { errors: err };
            return res.send(response);
          });


        }).catch(function (err) {

          console.log("examsDAO - insertClassAndSectionInExams - Catching server ERROR while setting Exam CLASS array details - " + JSON.stringify(err));

          response = { errors: err };
          return res.send(response);
        });

      } else {

        /*
      Class alrady present so  adding the section(s) in the exam
    */
        console.log("Class alrady present so  adding the section(s) in the exam - request - " + JSON.stringify(request));

        exams.update(
          {
            'examName': request.examName,
            'classWiseExamDetailsArray.class': request.class,
          },
          {
            $pull: {
              'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': {
                'section': request.section,
              }
            }
          }
        ).then(function (examSectionData) {
    
          console.log("examsDAO deleteSubjectWiseExamDetails - exam subject details updated successfully - " + JSON.stringify(examSectionData));
          
          exams.findOneAndUpdate(
            {
              'examName': request.examName,
              'classWiseExamDetailsArray.class': request.class
              // $set: {'attendance.$.studentsInfo': request.attendance.studentsInfo}
            },
            {
              $addToSet: {
                'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': {
                  'section': request.section,
                  'examDetails': request.examDetails
                }
              },
              $set: {
                'classWiseExamDetailsArray.$.percentageShareInFinalResult': request.percentageShareInFinalResult,
                'classWiseExamDetailsArray.$.isMandatryToAttendForFinalResult': request.isMandatryToAttendForFinalResult
              }
              // $addToSet: { "classWiseExamDetailsArray.$": request.section }
            }
          ).then(function (examSectionData) {
  
            console.log("examsDAO - insertClassAndSectionInExams - Class and section array details updated successfully - EXAM MODIFIED - " + JSON.stringify(examSectionData));
  
            response = { response: examSectionData, message: "examsDAO - insertClassAndSectionInExams - Class and section array details updated successfully - EXAM MODIFIED" };
            return res.send(response);
  
          }).catch(function (err) {
  
            console.log("examsDAO - insertClassAndSectionInExams - Catching server ERROR while setting Exam SECTION array details - " + JSON.stringify(err));
  
            response = { errors: err };
            return res.send(response);
          });

        }).catch(function (err) {
          console.log("examsDAO deleteSubjectWiseExamDetails - Catching server ERROR - " + JSON.stringify(err));
          response = { errors: err };
          return res.send(response);
        });

      }

    }).catch(function (err) {

      console.log("examsDAO - insertClassAndSectionInExams - Catching server ERROR while setting Exam SECTION array details - " + JSON.stringify(err));

      response = { errors: err };
      return res.send(response);
    });

  }

  /**
     * @description get method for fetchExamDetails service
     */
  function fetchExamDetails(req, res) {

    console.log("examsDAO - fetchExamDetails - ENTRY");

    //Initial validation like fields empty check
    var errors = validationResult(req);

    //Mapping the value to the same object
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }

    exams.find({},
      {
        "examName": 1,
        "examDescription": 1,
        "percentageShareInFinalResult": 1,
        "applicableForClasses": 1,
        "isMandatryToAttendForFinalResult": 1
      })
      .then(function (examDetails) {

        console.log("examsDAO - fetchExamDetails - Exam details -  " + examDetails);

        res.send(examDetails);
      })
      .catch(function (err) {
        console.log("examsDAO - fetchExamDetails - ERROR - " + err);
        return res.send({ "errors": err });
      });

  }

  async function fetchExamDetailsOnInput(req, res) {

    var request = req.body;
    console.log("in fetchExamDetailsOnInput request - " + JSON.stringify(request))

    // KAPILTODO Commented to check later 
    // //Initial validation like fields empty check
    // var errors = validationResult(req);

    // //Mapping the value to the same object
    // if (!errors.isEmpty()) {
    //   return res.send({ errors: errors.mapped() });
    // }

    var examRequest = {};
    var examResponse = {};

    if (!(typeof (request.applicableForClasses) === 'undefined' || request.applicableForClasses === null)) {
      examRequest = {

        "applicableForClasses": { $elemMatch: { $eq: request.applicableForClasses } }
      };
      examResponse = {
        "examName": 1,
        "examDescription": 1,
        "percentageShareInFinalResult": 1,
        "applicableForClasses": 1,
        "isMandatryToAttendForFinalResult": 1
      }
    } else if (!(typeof (request.examName) === 'undefined' || request.examName === null) && !(typeof (request.className) === 'undefined' || request.className === null)) {

      //For fetching class subject details to show on ScheduleExam view on page load

      examRequest = {
        "examName": request.examName,
        "classWiseExamDetailsArray.class": request.className
      };
      examResponse = {
        "examName": 1,
        "examDescription": 1,
        "percentageShareInFinalResult": 1,
        "applicableForClasses": 1,
        "isMandatryToAttendForFinalResult": 1,
        "classWiseExamDetailsArray.$.sectionWiseExamDetailsArray": 1,
        // "classWiseExamDetailsArray.$.class": 1,
        // "classWiseExamDetailsArray.$.percentageShareInFinalResult": 1,
        // "classWiseExamDetailsArray.$.isMandatryToAttendForFinalResult": 1
      }
    }

    console.log("ExamsDAO - fetchExamDetailsOnInput - searchString - examRequest - " + JSON.stringify(examRequest) + " examResponse - " + JSON.stringify(examResponse));

    exams.find(examRequest,
      examResponse)
      .then(function (examDetails) {

        console.log("examsDAO - fetchExamDetailsOnInput - Exam details -  " + examDetails);

        res.send(examDetails);
      })
      .catch(function (err) {
        console.log("examsDAO - fetchExamDetailsOnInput - ERROR - " + err);
        return res.send({ "errors": err });
      });
  }

  async function deleteSubjectWiseExamDetails(req, res) {

    var request = req.body;
    console.log("examsDAO deleteSubjectWiseExamDetails request - " + JSON.stringify(request));

    exams.update(
      {
        'examName': request.examName,
        'classWiseExamDetailsArray.class': request.class,
      },
      {
        $pull: {
          'classWiseExamDetailsArray.$.sectionWiseExamDetailsArray': {
            'section': request.section,
          }
        }
      }
    ).then(function (examSectionData) {

      console.log("examsDAO deleteSubjectWiseExamDetails - exam subject details updated successfully - " + JSON.stringify(examSectionData));
      response = { response: examSectionData, message: "examsDAO deleteSubjectWiseExamDetails - exam subject details updated successfully" };
      return res.send(response);
    }).catch(function (err) {
      console.log("examsDAO deleteSubjectWiseExamDetails - Catching server ERROR - " + JSON.stringify(err));
      response = { errors: err };
      return res.send(response);
    });
  }

  async function consumeexam(req, res) {
    console.log("in consumeexam Req.body: " + JSON.stringify(req.body))

    exams
      .updateOne({ examName: req.body.examName },
        {
          $inc: {
            quantity: -1 * parseInt(req.body.consumedQuantity)

          }
        }
      )
      .then(data => {
        var consumeexams = new Consumedexams(req.body);
        consumeexams.save()
          .then(user => {
            return res.send({ msg: "Success" });
          })
          .catch(err => {
            return res.send(err);
          });
      })
      .catch(err => {
        return res.send({ error: err });
      });

  }


  function existingExams(req, res) {
    console.log("in existingexams ");

    Exams
      .find()
      .then(data => {
        return res.send(data);
      })
      .catch(err => {
        return res.send({ error: err });
      });

  }

  function deleteExam(req, res) {
    console.log("In deleteexam: " + JSON.stringify(req.body.examName));

    Exams
      .deleteOne({ examName: req.body.examName })
      .then(data => {
        return res.send({ msg: "Exam Deleted" });
      })
      .catch(err => {
        return res.send({ error: err });
      });


  }

  async function editExam(req, res) {
    console.log("In editexam for: " + JSON.stringify(req.body));

    exams
      .updateOne({ examName: req.body.existingExams[req.body.examNo].examName },
        {
          $set: {
            examName: req.body.examName, unit: req.body.unit, totalMarks: req.body.totalMarks,
            passingMarks: req.body.passingMarks, description: req.body.description, timeLimit: req.body.timeLimit
          }
        }
      )
      .then(data => {

        return res.send({ msg: "Exam Updated" });
      })
      .catch(err => {
        return res.send({ error: err });
      });

  }
  async function getAddedexams(req, res) {
    console.log("In getAddedexams for: " + JSON.stringify(req.body));



    Purchaseexams
      .find({ $and: [{ dos: { $gte: new Date(req.body.dos) } }, { dos: { $lte: new Date(req.body.doe) } }] })

      .then(data => {

        return res.send({ data });
      })
      .catch(err => {
        return res.send({ error: err });
      });

  }


  async function getConsumedexams(req, res) {
    console.log("In getConsumedexams for: " + JSON.stringify(req.body));

    Consumedexams
      .find({ $and: [{ doc: { $gte: new Date(req.body.dos) } }, { doc: { $lte: new Date(req.body.doe) } }] })

      .then(data => {

        return res.send({ data });
      })
      .catch(err => {
        return res.send({ error: err });
      });
  }

  function removeExam(req, res) {

    var request = req.body;
    console.log("examsDAO - RemoveExam - request " + JSON.stringify(request.examName) + " req.body - " + JSON.stringify(req.body));

    exams
      .deleteOne({ examName: request.examName })
      .then(data => {
        return res.send({ msg: "Exam Deleted - " + request.examName });
      })
      .catch(err => {
        return res.send({ errors: err });
      });
  }

  app.post("/api/addexams", addexams);

  app.get("/api/fetchExamDetails", fetchExamDetails, (req, res) => {
    console.log("examsDAO - fetchExamDetails get method call");
  });

  app.post("/api/fetchExamDetailsOnInput", fetchExamDetailsOnInput, (req, res) => {
    console.log("examsDAO - fetchExamDetailsOnInput post method call");
  });

  app.post("/api/insertExam", insertExamValidation, insertExam, (req, res) => {
    console.log("examsDAO - insertExam post method call");
  });

  app.post("/api/insertClassAndSectionInExams", insertClassAndSectionInExamsValidation, insertClassAndSectionInExams, (req, res) => {
    console.log("examsDAO - insertClassAndSectionInExams post method call");
  });

  app.post("/api/deleteSubjectWiseExamDetails", deleteSubjectWiseExamDetails, (req, res) => {
    console.log("examsDAO - deleteSubjectWiseExamDetails post method call");
  });

  // app.post("/api/insertClassAndSectionInExamsFind", insertClassAndSectionInExamsValidation, insertClassAndSectionInExamsFind, (req, res) => {
  //   console.log("examsDAO - insertClassAndSectionInExamsFind post method call");
  // });

  app.post("/api/updateExam", ExamNameValidation, updateExam, (req, res) => {
    console.log("examsDAO - updateExam post method call");
  });

  app.post("/api/removeExam", ExamNameValidation, removeExam, (req, res) => {
    console.log("examsDAO - remove post method call");
  });

  app.get("/api/existingExams", existingExams);
  app.post("/api/deleteExam", deleteExam);
  app.post("/api/editExam", editExam);
  app.post("/api/consumeexam", consumeexam);
  app.post("/api/getAddedexams", getAddedexams);

  app.post("/api/getConsumedexams", getConsumedexams);
  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
