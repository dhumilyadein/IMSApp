const Student = require("../../models/Student");

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

  function deleteTemplate(req,res)
  {console.log("In Delete Template for: "+ JSON.stringify(req.body.templateName));

FeeTemplate
.deleteOne({templateName:req.body.templateName})
.then(data => {
  return res.send({msg:"Template Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}

async function updateFeeTemplate(req,res)
{console.log("In Update Template for: "+ JSON.stringify(req.body));
let feeData=null;
await FeeTemplate.findOne({ templateName: req.body.templateName })
.then(data => {
  if(data)
  return res.send({msg:"already exist"});
  else
  FeeTemplate
.updateOne({templateName:req.body.existingRows[req.body.templateNo].templateName},
  {$set: {templateName:req.body.templateName,
          templateRows:req.body.editRows,
          templateType:req.body.templateType

  }}
  )
.then(data => {

return res.send({msg:"Template Updated"});
})
.catch(err => {
return res.send({error:err});
});
  })
  .catch(err => {
  return res.send({error:err});
  });





}

async function copyFeeTemplate(req,res)
{console.log("In Copy Template for: "+ JSON.stringify(req.body));


var template = {
  "templateName": req.body.templateName, "status": req.body.status,
  "templateRows": req.body.editRows,"templateType":req.body.templateType

};
var copyTemplate = new FeeTemplate(template);





await copyTemplate
  .save()
  .then(user => {
      return res.send({msg:"Template Copied"});
  })
  .catch(err => {
    return res.send(err);
  });



}

  app.post("/api/selectStudentByClass", selectStudentByClass);
  app.post("/api/selectStudentBySection", selectStudentBySection);
  app.post("/api/deleteTemplate", deleteTemplate);
  app.post("/api/updateFeeTemplate", updateFeeTemplate);
  app.post("/api/copyFeeTemplate", copyFeeTemplate);





  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
