var { check, validationResult } = require("express-validator/check");
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
      .withMessage("Please Enter Applicable for Classes"),
  ];

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
    var examRequest = {
      "examName": request.examName,
      "examDescription":request.examDescription,
      "applicableForClasses": request.applicableForClasses,
      "percentageShareInFinalResult": request.percentageShareInFinalResult,
      "isMandatryToAttendForFinalResult": request.isMandatryToAttendForFinalResult,
      "createdAt": new Date(date.getTime()-(date.getTimezoneOffset() * 60000)),
      "updatedAt": new Date(date.getTime()-(date.getTimezoneOffset() * 60000))
    };
    var insertExam = new Exams(examRequest);

    await insertExam
      .save()
      .then(user => {
        return res.send({ msg: "Exam inserted successfully" });
      })
      .catch(err => {
        console.log("ExamsDAO - insertExam - ERROR - " + err);
        return res.send(err);
      });

  }

  async function updateExam(req, res) {

    var request = req.body;
    console.log("examsDAO - in updateExam -  request - " + JSON.stringify(request))

    var date = new Date();
    
    var objForUpdate = {};
    if(request.examDescription) objForUpdate.examDescription = request.examDescription;
    if(request.applicableForClasses) objForUpdate.applicableForClasses = request.applicableForClasses;
    if(request.percentageShareInFinalResult) objForUpdate.percentageShareInFinalResult = request.percentageShareInFinalResult;
    if(request.examDescription) objForUpdate.isMandatryToAttendForFinalResult = request.isMandatryToAttendForFinalResult;

    objForUpdate.updatedAt = new Date(date.getTime()-(date.getTimezoneOffset() * 60000));

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
        "examName":1, 
        "examDescription":1,
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
          return res.send({ "errors" : err});
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

  app.post("/api/insertExam", insertExamValidation, insertExam, (req, res) => {
    console.log("examsDAO - insertExam post method call");
  });

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
