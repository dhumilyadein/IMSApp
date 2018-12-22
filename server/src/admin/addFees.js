const Student = require("../../models/Student");
const FeeTemplate = require("../../models/FeeTemplatesModel");

module.exports = function (app) {
async function addFeeTemplate(req, res) {
console.log("in Add Fee Req.body: "+JSON.stringify(req.body))

var template = {
  "templateName": req.body.templateName, "status": req.body.status, "templateRows": req.body.rows,
  "templateType":req.body.templateType

};
var addTemplate = new FeeTemplate(template);





await addTemplate
  .save()
  .then(user => {
      return res.send({msg:"Success"});
  })
  .catch(err => {
    return res.send(err);
  });

}

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
      .findOne({username:req.body.selectedStudent.value})
      .then(data => {
        //console.log("Student Result: "+JSON.stringify(data))
          return res.send(data.pendingFeeAmount);
      })
      .catch(err => {
        return res.send({error:err});
      });




}

  app.post("/api/selectStudentByClass", selectStudentByClass);
  app.post("/api/selectStudentBySection", selectStudentBySection);

  app.post("/api/selectfeeTemplate", selectfeeTemplate);
   app.post("/api/getfeeTemplate", getfeeTemplate);

   app.post("/api/getpendingFeeAmount", getpendingFeeAmount);



  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
