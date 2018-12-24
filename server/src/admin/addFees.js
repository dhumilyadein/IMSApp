const Student = require("../../models/Student");
const FeeTemplate = require("../../models/FeeTemplatesModel");
const FeeRecord = require("../../models/FeeRecords");

module.exports = function (app) {


function selectStudentByClass(req, res) {
  console.log("in Selct Student "+ JSON.stringify(req.body));

  Student
    .find({class:req.body.class})
    .then(data => { var temp=[];
        for(var i=0;i<data.length;i++)
        {temp.push({"username":data[i].username, "firstname":data[i].firstname,"lastname":data[i].lastname})


        }
      //console.log("Student Result: "+JSON.stringify(data))
        return res.send(temp);
    })
    .catch(err => {
      return res.send({error:err});
    });

  }

  function selectfeeTemplate(req, res) {
    console.log("in selectfeeTemplate"+ JSON.stringify(req.body.selectedStudent));

    Student
      .findOne({username:req.body.selectedStudent.value})
      .then(data => {
        //console.log("Student Result: "+JSON.stringify(data))
          return res.send(data.feeTemplate);
      })
      .catch(err => {
        return res.send({error:err});
      });

    }

  function selectStudentBySection(req, res) {
    console.log("in Selct Student "+ JSON.stringify(req.body));

    Student
      .find({class:req.body.class,section:req.body.section})
      .then(data => { var temp=[];
          for(var i=0;i<data.length;i++)
          {temp.push({"username":data[i].username, "firstname":data[i].firstname,"lastname":data[i].lastname})


          }
        //console.log("Student Result: "+JSON.stringify(data))
          return res.send(temp);
      })
      .catch(err => {
        return res.send({error:err});
      });

    }



async function getfeeTemplate(req,res)
{console.log("In Get Template for: "+ JSON.stringify(req.body));


FeeTemplate
      .findOne({templateName:req.body.selectedFeeTemplate.value})
      .then(data => {
        //console.log("Student Result: "+JSON.stringify(data))
          return res.send(data);
      })
      .catch(err => {
        return res.send({error:err});
      });




}


async function getpendingFeeAmount(req,res)
{console.log("In getpendingFeeAmount for: "+ JSON.stringify(req.body));


Student
      .findOne({username:req.body.username})
      .then(data => {
        //console.log("Student Result: "+JSON.stringify(data))
          return res.send(data.pendingFeeAmount);
      })
      .catch(err => {
        return res.send({error:err});
      });




}

function feeSubmit(req,res)
{
  console.log("in Fee Submit: "+JSON.stringify(req.body));

  var tempStudentDetails=[{"name":req.body.selectedStudent.label.substr(0,req.body.selectedStudent.label.indexOf("(")).trim(),
                            "username":req.body.selectedStudent.value}];

                            console.log("in Fee Submit: "+JSON.stringify(tempStudentDetails));

  var template = {
    "templateName": req.body.selectedFeeTemplate.value,  "templateRows": req.body.rows,
    "templateType":req.body.templateType, "class":req.body.class, "section":req.body.section,
    "studentDetails": tempStudentDetails, "year":req.body.year,"quarter":req.body.quarter,
    "month":req.body.month, "halfYear":req.body.halfYear, "lateFeeFine":req.body.lateFeeFine,
    "pastPendingDue":req.body.pastPendingDue, "totalDueAmount":req.body.totalDueAmount,
    "paidAmount":req.body.paidAmount, "remarks":req.body.remarks, "dos":req.body.dos, "templateRows":req.body.templateRows,
    "totalFeeAmount":req.body.totalAmount



  };
  var addFee = new FeeRecord(template);

     addFee
    .save()
    .then(user => {
        return res.send({msg:"Success"});
    })
    .catch(err => {
      return res.send({error:err});
    });


}

function getStudentByRollNo(req,res)

{ console.log("In getStudentByRollNo: "+req.body.rollNo);

  Student
  .findOne({rollno:req.body.rollNo})
  .then(data => {
    //console.log("Student Result: "+JSON.stringify(data))
      return res.send({"firstname":data.firstname,"lastname":data.lastname, 
      "username":data.username, "feeTemplate":data.feeTemplate, "class":data.class, "section":data.section
    });
  })
  .catch(err => {console.log("Error"+err);
    return res.send({error:"Not Found"});
  });
}

  app.post("/api/selectStudentByClass", selectStudentByClass);
  app.post("/api/selectStudentBySection", selectStudentBySection);

  app.post("/api/selectfeeTemplate", selectfeeTemplate);
   app.post("/api/getfeeTemplate", getfeeTemplate);

   app.post("/api/getpendingFeeAmount", getpendingFeeAmount);
   app.post("/api/feeSubmit", feeSubmit);
   app.post("/api/getStudentByRollNo", getStudentByRollNo);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
