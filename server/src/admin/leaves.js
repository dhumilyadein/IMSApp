const PurchaseItems = require("../../models/PurchaseItems");
const AppliedLeaves = require("../../models/AppliedLeaves");
const LeaveTypes = require("../../models/LeaveTypes");
const EmpLeaveStatus = require("../../models/EmpLeaveStatus");

module.exports = function (app) {


  async function applyLeave(req, res) {
    console.log("in applyLeave Req.body: " + JSON.stringify(req.body))

    req.body["status"] = "Applied";
    var applyLeave = new AppliedLeaves(req.body);

    applyLeave
      .save()
      .then(user => {
        return res.send({ msg: "Success" });
      })
      .catch(err => {
        return res.send(err);
      });


  }

  async function createLeave(req, res) {
    console.log("in createLeave Req.body: " + JSON.stringify(req.body))


    var createLeave = new LeaveTypes(req.body);

    await createLeave
      .save()
      .then(user => {
        return res.send({ msg: "Success" });
      })
      .catch(err => {
        return res.send(err);
      });

  }

  async function approveLeave(req, res) {
    console.log("in approveLeave Req.body: " + JSON.stringify(req.body))

    AppliedLeaves
      .findOneAndUpdate({ _id: req.body._id },
        {
          status: "Approved",
          dateOfApproveOrReject: req.body.dateOfApproveOrReject
        }
      )

      .then(user => {
        return res.send({ msg: "Leave Approved" });
      })
      .catch(err => {
        return res.send(err);
      });





  }

  async function rejectLeave(req, res) {
    console.log("in rejectLeave Req.body: " + JSON.stringify(req.body))

    AppliedLeaves
      .findOneAndUpdate({ _id: req.body._id },
        {
          status: "Rejected",
          dateOfApproveOrReject: req.body.dateOfApproveOrReject
        }
      )

      .then(user => {
        return res.send({ msg: "Leave Rejected" });
      })
      .catch(err => {
        return res.send(err);
      });





  }

  function getExistingLeaveTypes(req, res) {
    console.log("in getExistingLeaveTypes ");

    LeaveTypes
      .find()
      .then(data => {
        return res.send(data);
      })
      .catch(err => {
        return res.send({ error: err });
      });

  }

  function deleteLeave(req, res) {
    console.log("In deleteLeave: " + JSON.stringify(req.body.itemName));

    LeaveTypes
      .deleteOne({ leaveName: req.body.leaveName })
      .then(data => {
        return res.send({ msg: "Leave Deleted" });
      })
      .catch(err => {
        return res.send({ error: err });
      });


  }

  async function editLeave(req, res) {
    console.log("In editLeave for: " + JSON.stringify(req.body));



    LeaveTypes
      .findOneAndUpdate({ leaveName: req.body.existingLeaveTypes[req.body.leaveNo].leaveName },
        {
          $set: {
            leaveName: req.body.leaveName,
            leaveType: req.body.leaveType,
            leaveCount: req.body.leaveCount,
            carryForward: req.body.carryForward,
            maxLeaveCount: req.body.maxLeaveCount
          }
        }
      )
      .then(data => {

        return res.send({ msg: "Leave Updated" });
      })
      .catch(err => {
        return res.send({ error: err });
      });







  }
  async function getPendingleaves(req, res) {
    console.log("In getPendingleaves for: " + JSON.stringify(req.body));



    AppliedLeaves
      .find({ status: "Applied" })

      .then(data => {

        return res.send({ data });
      })
      .catch(err => {
        return res.send({ error: err });
      });







  }


  async function getAvailableLeaveCount(req, res) {
    console.log("In getAvailableLeaveCount for: " + JSON.stringify(req.body));




    AppliedLeaves
      .find({
        leaveType: req.body.leaveType, empName: req.body.empName, year: req.body.year,
        $or: [{ status: "Approved" }, { status: "Applied" }]
      })

      .then(data => {

        return res.send({ data });
      })
      .catch(err => {
        return res.send({ error: err });
      });


  }

  async function getEmpAllLeaveDetails(req, res) {
    console.log("In getEmpAllLeaveDetails for: " + JSON.stringify(req.body));




    AppliedLeaves
      .find({
        empName: req.body.empName, year: req.body.year,
        $or: [{ status: "Approved" }, { status: "Applied" }]
      })

      .then(data => {

        return res.send({ data });
      })
      .catch(err => {
        return res.send({ error: err });
      });


  }

  async function assignLeave(req, res) {
    console.log("In assignLeave for: " + JSON.stringify(req.body));

    if (req.body.carryForward) {
      console.log("Carry Forwarded");
      var recordsUpdated = 0;
      for (var i = 0; i < req.body.selectedEmp.length; i++) {
        var empDataFound = null;
        await EmpLeaveStatus.findOne({
          empName: req.body.selectedEmp[i].label.toLowerCase()
          //leaveDetails: {$elemMatch: {leaveType:req.body.leaveType}}
        })
          .then(data => {
            if (data != null) {
              console.log("Emp Leave Data Found: " + JSON.stringify(data));
              empDataFound = data;
            }
          })
          .catch(err => {
            return res.send({ error: JSON.stringify(err) });
          });


        if (empDataFound) {
          var leaveTypeFound = false;
          for (var j = 0; j < empDataFound.leaveDetails.length; j++)
            if (empDataFound.leaveDetails[j].leaveType === req.body.leaveType) {
              leaveTypeFound = true;

              if ((parseInt(empDataFound.leaveDetails[j].total) + parseInt(empDataFound.leaveDetails[j].remaining)) > req.body.maxLeaveCount) {
                console.log("MAX Count crossed " + empDataFound.empName);
                await EmpLeaveStatus.findOneAndUpdate({
                  empName: req.body.selectedEmp[i].label.toLowerCase(),
                  'leaveDetails.leaveType': req.body.leaveType
                }, {
                  '$set': {
                    'leaveDetails.$.total': req.body.maxLeaveCount,
                    'leaveDetails.$.used': 0,
                    'leaveDetails.$.remaining': req.body.maxLeaveCount,
                    'leaveDetails.$.carryForward': req.body.carryForward,
                    'leaveDetails.$.maxLeaveCount': req.body.maxLeaveCount,


                  }
                  }, { new: true }).then(data => {
                    console.log("ESLE data: " + JSON.stringify(data));

                    recordsUpdated=recordsUpdated+1;
                  })
                  .catch(err => {
                    return res.send({ error: JSON.stringify(err) });
                  });
              }
              else {
                console.log("UNDER MAX COUNT");
                await EmpLeaveStatus.findOneAndUpdate({
                  empName: empDataFound.empName,
                  'leaveDetails.leaveType': req.body.leaveType
                }, {
                  '$set': {
                    'leaveDetails.$.total': req.body.leaveCount + empDataFound.leaveDetails[j].remaining,
                    'leaveDetails.$.used': 0,
                    'leaveDetails.$.remaining': req.body.leaveCount + empDataFound.leaveDetails[j].remaining,
                    'leaveDetails.$.carryForward': req.body.carryForward,
                    'leaveDetails.$.maxLeaveCount': req.body.maxLeaveCount,

                  }
                  }, { new: true }).then(data => {
                    console.log("ESLE data: " + JSON.stringify(data));
                    recordsUpdated=recordsUpdated+1;
                  })
                  .catch(err => {
                    return res.send({ error: JSON.stringify(err) });
                  });
              }


            }


          if (!leaveTypeFound) {
            if (!req.body.CFLC)
              return res.send({ error: "Please Enter Carry Forwarded Leave Count from Last Year. Carry Forwarded Count is required for the first time only!" });

            else {
              if ((parseInt(req.body.leaveCount) + parseInt(req.body.CFLC)) > req.body.maxLeaveCount)
                await EmpLeaveStatus.findOneAndUpdate(
                  { empName: req.body.selectedEmp[i].label.toLowerCase() },
                  {
                    $push: {
                      leaveDetails: {
                        "leaveType": req.body.leaveType, "total": req.body.maxLeaveCount, "used": 0, remaining: req.body.maxLeaveCount, carryForward: req.body.carryForward,
                        maxLeaveCount: req.body.maxLeaveCount
                      }
                    }
                  }, { new: true })
                  .then(data => {
                    if (data != null) {

                      recordsUpdated=recordsUpdated+1;
                    }
                  })
                  .catch(err => {
                    return res.send({ error: JSON.stringify(err) });
                  });

              else

                await EmpLeaveStatus.findOneAndUpdate(
                  { empName: req.body.selectedEmp[i].label.toLowerCase() },
                  {
                    $push: {
                      leaveDetails: {
                        "leaveType": req.body.leaveType,
                        "total": parseInt(req.body.leaveCount) + parseInt(req.body.CFLC),
                        "used": 0, "remaining": parseInt(req.body.leaveCount) + parseInt(req.body.CFLC),
                        "carryForward": req.body.carryForward,
                        "maxLeaveCount": req.body.maxLeaveCount
                      }
                    }
                  }, { new: true })
                  .then(data => {
                    if (data != null) {

                      recordsUpdated=recordsUpdated+1;
                    }
                  })
                  .catch(err => {
                    return res.send({ error: JSON.stringify(err) });
                  });

            }}}
            

     else {
              console.log("Emp data not found.. creating new entry")
              if (!req.body.CFLC)
              return res.send({ error: "Please Enter Carry Forwarded Leave Count from Last Year. Carry Forwarded Count is required for the first time only!" });
              else{
              var addLeaveDetails = new EmpLeaveStatus({
                "empName": req.body.selectedEmp[i].label,
                leaveDetails: [{ "leaveType": req.body.leaveType, "total": parseInt(req.body.leaveCount) + parseInt(req.body.CFLC), "used": 0, remaining: parseInt(req.body.leaveCount) + parseInt(req.body.CFLC), "carryForward": req.body.carryForward, maxLeaveCount: req.body.maxLeaveCount }]
              });

             await addLeaveDetails
                .save()
                .then(user => { recordsUpdated=recordsUpdated+1;

                })
                .catch(err => {
                  return res.send({ error: JSON.stringify(err) });
                });
              }
            }






          } console.log("recordUpdate: " + recordsUpdated);
          if (recordsUpdated === req.body.selectedEmp.length)
            res.send({ msg: "Leave Assigned" });
          else
            res.send({ error: "Error Occured" });
        }

        else {
          console.log("No Carry Forwarded");
          var recordsUpdated = 0;
          for (var i = 0; i < req.body.selectedEmp.length; i++) {
            var empDataFound = null;
            await EmpLeaveStatus.findOne({
              empName: req.body.selectedEmp[i].label.toLowerCase()
              //leaveDetails: {$elemMatch: {leaveType:req.body.leaveType}}
            })
              .then(data => {
                if (data != null) {
                  console.log("Emp Leave Data Found: " + JSON.stringify(data));
                  empDataFound = data;
                }
              })
              .catch(err => {
                return res.send({ error: JSON.stringify(err) });
              });
    
    
            if (empDataFound) {
              var leaveTypeFound = false;
              for (var j = 0; j < empDataFound.leaveDetails.length; j++)
                if (empDataFound.leaveDetails[j].leaveType === req.body.leaveType) {
                  leaveTypeFound = true;
                       await EmpLeaveStatus.findOneAndUpdate({
                      empName: empDataFound.empName,
                      'leaveDetails.leaveType': req.body.leaveType
                    }, {
                      '$set': {
                        'leaveDetails.$.total': req.body.leaveCount,
                        'leaveDetails.$.used': 0,
                        'leaveDetails.$.remaining': req.body.leaveCount,
                        'leaveDetails.$.carryForward': req.body.carryForward,
                       
    
                      }
                      }, { new: true }).then(data => {
                        console.log("ESLE data: " + JSON.stringify(data));
                        recordsUpdated=recordsUpdated+1;
                      })
                      .catch(err => {
                        return res.send({ error: JSON.stringify(err) });
                      });
                  
    
    
                }
    
    
              if (!leaveTypeFound) {
             
                        await EmpLeaveStatus.findOneAndUpdate(
                      { empName: req.body.selectedEmp[i].label.toLowerCase() },
                      {
                        $push: {
                          leaveDetails: {
                            "leaveType": req.body.leaveType,
                            "total": parseInt(req.body.leaveCount),
                            "used": 0, "remaining": parseInt(req.body.leaveCount),
                            "carryForward": req.body.carryForward,
                          }
                        }
                      }, { new: true })
                      .then(data => {
                        if (data != null) {
    
                          recordsUpdated=recordsUpdated+1;
                        }
                      })
                      .catch(err => {
                        return res.send({ error: JSON.stringify(err) });
                      });
    
                }}
         else {
                  console.log("Emp data not found.. creating new entry")
                  var addLeaveDetails = new EmpLeaveStatus({
                    "empName": req.body.selectedEmp[i].label,
                    leaveDetails: [{ "leaveType": req.body.leaveType, "total": parseInt(req.body.leaveCount) , "used": 0, remaining: parseInt(req.body.leaveCount) , "carryForward": req.body.carryForward }]
                  });
    
                await  addLeaveDetails
                    .save()
                    .then(user => { recordsUpdated=recordsUpdated+1; 
                      console.log("recordUpdated+ "+recordsUpdated)

    
                    })
                    .catch(err => {
                      return res.send({ error: JSON.stringify(err) });
                    });
    
                }
    
    
    
    
    
    
              } console.log("recordUpdate: " + recordsUpdated);
              if (recordsUpdated === req.body.selectedEmp.length)
                res.send({ msg: "Leave Assigned" });
              else
                res.send({ error: "Error Occured" });
        }











      }

      async function getEmployeeLeaveDetails(req, res) {
        console.log("In getEmployeeLeaveDetails for: " + JSON.stringify(req.body));
    
    
    
    
        EmpLeaveStatus
          .find({
            empName: req.body.empName})
    
          .then(data => {
    
            return res.send({ data });
          })
          .catch(err => {
            return res.send({ error: err });
          });
    
    
      }
    



      app.post("/api/applyLeave", applyLeave);
      app.post("/api/createLeave", createLeave);
      app.get("/api/getExistingLeaveTypes", getExistingLeaveTypes);
      app.post("/api/deleteLeave", deleteLeave);
      app.post("/api/editLeave", editLeave);
      app.post("/api/approveLeave", approveLeave);
      app.get("/api/getPendingleaves", getPendingleaves);
      app.post("/api/getAvailableLeaveCount", getAvailableLeaveCount);
      app.post("/api/rejectLeave", rejectLeave);
      app.post("/api/assignLeave", assignLeave);
      app.post("/api/getEmployeeLeaveDetails", getEmployeeLeaveDetails);
      
      app.post("/api/getEmpAllLeaveDetails", getEmpAllLeaveDetails);





      app.get("/", (req, res) => res.json("sdasdsa"));
      //---------------------------------------------

    }
