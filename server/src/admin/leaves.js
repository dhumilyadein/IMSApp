const PurchaseItems = require("../../models/PurchaseItems");
const AppliedLeaves = require("../../models/AppliedLeaves");
const LeaveTypes = require("../../models/LeaveTypes");

module.exports = function (app) {


async function applyLeave(req, res) {
console.log("in applyLeave Req.body: "+JSON.stringify(req.body))

req.body["status"]="Applied";
var applyLeave= new AppliedLeaves(req.body);

applyLeave
.save()
.then(user => {
    return res.send({msg:"Success"});
})
.catch(err => {
  return res.send(err);
});


}

async function createLeave(req, res) {
  console.log("in createLeave Req.body: "+JSON.stringify(req.body))


  var createLeave = new LeaveTypes(req.body);

  await createLeave
    .save()
    .then(user => {
        return res.send({msg:"Success"});
    })
    .catch(err => {
      return res.send(err);
    });

  }

  async function approveLeave(req, res) {
    console.log("in approveLeave Req.body: "+JSON.stringify(req.body))

    AppliedLeaves
    .updateOne({_id:req.body._id},
      {status:"Approved",
      dateOfApproveOrReject:req.body.dateOfApproveOrReject
               }
      )

     .then(user => {
         return res.send({msg:"Leave Approved"});
     })
     .catch(err => {
       return res.send(err);
     });





    }

    async function rejectLeave(req, res) {
      console.log("in rejectLeave Req.body: "+JSON.stringify(req.body))

      AppliedLeaves
      .updateOne({_id:req.body._id},
        {status:"Rejected",
        dateOfApproveOrReject:req.body.dateOfApproveOrReject
                 }
        )

       .then(user => {
           return res.send({msg:"Leave Rejected"});
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
      return res.send({error:err});
    });

  }

  function deleteLeave(req,res)
  {console.log("In deleteLeave: "+ JSON.stringify(req.body.itemName));

LeaveTypes
.deleteOne({leaveName:req.body.leaveName})
.then(data => {
  return res.send({msg:"Leave Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}

async function editLeave(req,res)
{console.log("In editLeave for: "+ JSON.stringify(req.body));



  LeaveTypes
.updateOne({leaveName:req.body.existingLeaveTypes[req.body.leaveNo].leaveName},
  {$set: {leaveName:req.body.leaveName,
          leaveType:req.body.leaveType,
          leaveCount:req.body.leaveCount,
          carryForward:req.body.carryForward,
          maxLeaveCount:req.body.maxLeaveCount
           }}
  )
.then(data => {

return res.send({msg:"Leave Updated"});
})
.catch(err => {
return res.send({error:err});
});







}
async function getPendingleaves(req,res)
{console.log("In getPendingleaves for: "+ JSON.stringify(req.body));



  AppliedLeaves
.find({ status:"Applied" })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});







}


async function getAvailableLeaveCount(req,res)
{console.log("In getAvailableLeaveCount for: "+ JSON.stringify(req.body));




AppliedLeaves
.find({leaveType:req.body.leaveType, empName:req.body.empName,year:req.body.year,
  $or:[ {status:"Approved"}, {status:"Applied"} ]})

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});


}

async function getEmpAllLeaveDetails(req,res)
{console.log("In getEmpAllLeaveDetails for: "+ JSON.stringify(req.body));




AppliedLeaves
.find({empName:req.body.empName,year:req.body.year,
  $or:[ {status:"Approved"}, {status:"Applied"} ]})

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
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
  app.post("/api/getEmpAllLeaveDetails", getEmpAllLeaveDetails);





  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
