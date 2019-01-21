
const exams = require("../../models/Exams");

module.exports = function (app) {


async function addexams(req, res) {
console.log("in addexams Req.body: "+JSON.stringify(req.body))

var template = {
  "listName": req.body.listName, "dos": req.body.dos, "examRows": req.body.rows,
  "grandTotal":req.body.grandTotal, "remarks":req.body.remarks

};
var addexam = new Purchaseexams(template);


for(var i=0;i<req.body.rows.length;i++)
{

  await exams
  .updateOne({examName:req.body.rows[i].examName.value},
    {$inc: {quantity:req.body.rows[i].quantity

             }}
    )
  .then(data => {



  })
  .catch(err => {
  return res.send({error:err});
  });



}

addexam
.save()
.then(user => {
    return res.send({msg:"Success"});
})
.catch(err => {
  return res.send(err);
});


}

async function createExam(req, res) {
  console.log("in createexam Req.body: "+JSON.stringify(req.body))

  var template = {
    "examName": req.body.examName, "unit": req.body.unit, "totalMarks": req.body.totalMarks,
    "passingMarks": req.body.passingMarks, "description":req.body.description

  };
  var createExam = new Exams(template);





  await createExam
    .save()
    .then(user => {
        return res.send({msg:"Success"});
    })
    .catch(err => {
      return res.send(err);
    });

  }

  async function consumeexam(req, res) {
    console.log("in consumeexam Req.body: "+JSON.stringify(req.body))

    exams
    .updateOne({examName:req.body.examName},
      {$inc: {quantity:-1*parseInt(req.body.consumedQuantity)

               }}
      )
    .then(data => {
     var consumeexams = new Consumedexams(req.body);
     consumeexams.save()
     .then(user => {
         return res.send({msg:"Success"});
     })
     .catch(err => {
       return res.send(err);
     });


    })
    .catch(err => {
    return res.send({error:err});
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
      return res.send({error:err});
    });

  }

  function deleteExam(req,res)
  {console.log("In deleteexam: "+ JSON.stringify(req.body.examName));

Exams
.deleteOne({examName:req.body.examName})
.then(data => {
  return res.send({msg:"Exam Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}

async function editExam(req,res)
{console.log("In editexam for: "+ JSON.stringify(req.body));



  exams
.updateOne({examName:req.body.existingExams[req.body.examNo].examName},
  {$set: {examName: req.body.examName, unit: req.body.unit, totalMarks: req.body.totalMarks,
  passingMarks: req.body.passingMarks,description:req.body.description
           }}
  )
.then(data => {

return res.send({msg:"Exam Updated"});
})
.catch(err => {
return res.send({error:err});
});







}
async function getAddedexams(req,res)
{console.log("In getAddedexams for: "+ JSON.stringify(req.body));



  Purchaseexams
.find({ $and: [ { dos: { $gte : new Date(req.body.dos) } }, { dos: { $lte : new Date(req.body.doe) } }] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});







}


async function getConsumedexams(req,res)
{console.log("In getConsumedexams for: "+ JSON.stringify(req.body));




Consumedexams
.find({ $and: [ { doc: { $gte : new Date(req.body.dos) } }, { doc: { $lte : new Date(req.body.doe) } }] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});








}



  app.post("/api/addexams", addexams);
  app.post("/api/createexam", createExam);
  app.get("/api/existingExams", existingExams);
  app.post("/api/deleteExam", deleteExam);
  app.post("/api/editExam", editExam);
  app.post("/api/consumeexam", consumeexam);
  app.post("/api/getAddedexams", getAddedexams);
  app.post("/api/getConsumedexams", getConsumedexams);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
