const Student = require("../../models/Student");

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

function getFeesDetails(req,res)
{
  console.log("in getFeesDetails: "+JSON.stringify(req.body.selectedStudent));

  var tempStudentDetails=[{"name":req.body.selectedStudent.label.substr(0,req.body.selectedStudent.label.indexOf("(")).trim(),
  "username":req.body.selectedStudent.value}];


  FeeRecord.find({studentDetails:tempStudentDetails })
       .then(data => {
         return res.send(data);
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


   app.post("/api/getfeeTemplate", getfeeTemplate);

   app.post("/api/getpendingFeeAmount", getpendingFeeAmount);
   app.post("/api/getFeesDetails", getFeesDetails);
   app.post("/api/getStudentByRollNo", getStudentByRollNo);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
