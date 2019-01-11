const BookCategories = require("../../models/BookCategories");
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



async function getCategories(req,res)
{console.log("In getCategories for: "+ JSON.stringify(req.body));


BookCategories
      .find()
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

function addBook(req,res)
{
  console.log("in addBook: "+JSON.stringify(req.body));

  for(var i=0;i<req.body.uniqueBookIds;i++)
  {
req.body.uniqueBookIds[i]["isIssued"]="N";

  }
  console.log("in addBook: "+JSON.stringify(req.body.uniqueBookIds));



  if(parseInt(req.body.totalDueAmount)>0)

  {
    Student
    .updateOne({username:req.body.selectedStudent.value},
      {$set: {pendingFeeAmount:req.body.totalDueAmount,


      }}
      )
    .then(data => {
      var addFee = new FeeRecord(template);

      addFee
     .save()
     .then(user => {
         return res.send({msg:"Success",pendingAmount:"Updated"});
     })
     .catch(err => {
       return res.send({error:err});
     });

    })
    .catch(err => {
     res.send({error:err});
    });



  }
else{
  Student
  .updateOne({username:req.body.selectedStudent.value},
    {$set: {pendingFeeAmount:req.body.totalDueAmount,


    }}
    )
    .then(user => {
     console.log("Pending amount 0 updated");
  })
  .catch(err => {
    console.log("Pending amount error 0");  });


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
   app.post("/api/getCategories", getCategories);

   app.post("/api/getpendingFeeAmount", getpendingFeeAmount);
   app.post("/api/addBook", addBook);
   app.post("/api/getStudentByRollNo", getStudentByRollNo);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
