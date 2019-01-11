const BookCategories = require("../../models/BookCategories");
const Books = require("../../models/Books");


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

  if(req.body.category.__isNew__)
{var addCategory = new BookCategories({"category":req.body.category.label});
addCategory.save()
.then(user => {
   console.log("Category saved: "+JSON.stringify(user));
})
.catch(err => {
  console.log("Category Error: "+JSON.stringify(err));
});

}

var tempBook={"bookId":req.body.bookId, "bookName":req.body.bookName, "category":req.body.category.label,"author":req.body.author,
"publisher":req.body.publisher , "quantity":req.body.quantity, "cost":req.body.cost,   "doa":req.body.doa,
 "description":req.body.description,"uniqueBookIds" : req.body.uniqueBookIds  }




var addBook = new Books(tempBook);
  addBook
  .save()
  .then(user => {
      return res.send({msg:"Success"});
  })
  .catch(error => {
    return res.send({error});
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
   app.get("/api/getCategories", getCategories);

   app.post("/api/getpendingFeeAmount", getpendingFeeAmount);
   app.post("/api/addBook", addBook);
   app.post("/api/getStudentByRollNo", getStudentByRollNo);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
