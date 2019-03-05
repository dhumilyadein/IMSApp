const BookCategories = require("../../models/BookCategories");
const Books = require("../../models/Books");
const IssuedBooks = require("../../models/IssuedBooks");
const Users = require("../../models/User");
const rimraf = require("rimraf");
var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var excelStorage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./BookUploads/");
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

var excelUpload = multer({
  //multer settings
  storage: excelStorage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname
          .split(".")
          [file.originalname.split(".").length - 1].toLowerCase()
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

module.exports = function (app) {

  async function importValidation(request) {
    var valError = {};
    console.log("in IMPORT VAL  " + request.bookName);


    try {


      if (!request.bookName) valError["bookName"] = "bookName can't be empty";
      else {
        const bookNameCheck = await Books.findOne({
          bookName: request.bookName
        });

        if (bookNameCheck)
          valError["BookExists"] =
            "bookName: " + request.bookName + " is already in use";
        //  console.log("unexists: " + valError['UserExists']);
      }


      if (!request.bookId) valError["bookId"] = "bookId can't be empty";
      else {
        const bookIdCheck = await Books.findOne({
          bookId: request.bookId
        });

        if (bookIdCheck)
          valError["BookIdExists"] =
            "bookId: " + request.bookId + " is already in use";
        //  console.log("unexists: " + valError['UserExists']);
      }

      if (!request.category) valError["Category"] = "Category can't be empty";
 else {
  const categoryCheck = await BookCategories.findOne({
    category: request.category
  });

  if (!categoryCheck)
  {
    var addCategory = new BookCategories({"category":request.category});
    addCategory.save()
    .then(user => {
       console.log("New Category: "+request.category +" saved: "+JSON.stringify(user));
    })
    .catch(err => {
    add=false;
      console.log("Category Error: "+JSON.stringify(err));
    });

  }
}


      if (!request.quantity) valError["Quantity"] = "Quantity can't be empty";


    } catch (e) {
      console.log(e);
    }

     return valError;
  }


  async function importBooks(req, res) {


    console.log("in import Books  ");

    var exceltojson;

    await rimraf("./BookUploads/*.*", function(e) {
      console.log(e);
      console.log("Deleted Excel");

      excelUpload(req, res, function(err) {
        if (err) {
          res.json({ error_code: 1, err_desc: err });
          return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
          res.json({ error_code: 1, err_desc: "No file passed" });

          return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ] === "xlsx"
        ) {
          exceltojson = xlsxtojson;
        } else {
          exceltojson = xlstojson;
        }
        //  console.log(req.file.path);
        try {
          exceltojson(
            {
              input: req.file.path,
              output: null, //since we don't need output.json

            },
            async function(err, result) {
              if (err) {
                return res.json({ error_code: 1, err_desc: err, data: null });
              }

              // console.log("Total records: " + Object.keys(result).length);
              var importErrors = {};
              for (let i = 0; i < result.length; i++) {
                console.log(
                  "Result: "+i + JSON.stringify(result[i])
                );

                var impValResult = await importValidation(result[i]);
                console.log(
                  "impValResultLength: " + Object.keys(impValResult).length
                );

                // impValResult length check

                if (Object.keys(impValResult).length === 0) {


                  var temp=[];
                  for(var c=0;c<result[i].quantity;c++)
                  {
                      temp.push({"label":result[i].bookId.charAt(0).toUpperCase()+
                      result[i].bookId.slice(1)+"-"+(c+1),
                  "value":result[i].bookId.charAt(0).toUpperCase()+result[i].bookId.slice(1)
                  +"-"+(c+1),"isIssued":false})

                  }

                  result[i]["uniqueBookIds"]=temp;

var addBook = new Books(result[i]);
 await addBook
  .save()
  .then(user => {
   console.log("Book: "+user.bookName+" saved!");
  })
  .catch(error => {
    console.log("BookSave Error: "+error);
    importErrors[
      "    record# " + (i + 1) + " of Book: " + result[i].bookName
    ] = error;
  });



                } else {
                  importErrors[
                    "    record# " + (i + 1) + " of Book: " + result[i].bookName
                  ] = impValResult;
                }
              }
              console.log("IMPORT ERRORS: " + JSON.stringify(importErrors));

              if (Object.keys(importErrors).length > 0)
                return res.send({ errors: importErrors });
              else return res.send({msg:"Imported Successfully", excelfilename:req.file.originalname});
            }
          );
        } catch (e) {
          console.log(e);
          res.json({ error_code: 2, error: e });
        }
      });
    });
  }
  function gettingBooks(req, res) {
    console.log("in gettingBooks ");

    Books
      .find({quantity:{$gt:0}})
      .then(data => {
          return res.send(data);
      })
      .catch(err => {
        return res.send({error:err});
      });

    }

     function gettingAllBooks(req, res) {
    console.log("in gettingAllBooks ");

    Books
      .find()
      .then(data => {
          return res.send(data);
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


async function deleteCategory(req,res)
{console.log("In deleteCategory for: "+ JSON.stringify(req.body));


BookCategories
.deleteOne({category:req.body.category})
.then(data => {
  return res.send({msg:"Deleted"});
})
.catch(err => {
return res.send({error:err});
});



}

async function deleteBook(req,res)
{console.log("In deleteBook for: "+ JSON.stringify(req.body));


Books
.deleteOne({bookName:req.body.bookName})
.then(data => {
  return res.send({msg:"Deleted"});
})
.catch(err => {
return res.send({error:err});
});



}

async function addBook(req,res)
{var add=true;
  console.log("in addBook: "+JSON.stringify(req.body));

  if(req.body.category.__isNew__)
{var addCategory = new BookCategories({"category":req.body.category.label});
await addCategory.save()
.then(user => {
   console.log("Category saved: "+JSON.stringify(user));
})
.catch(err => {
add=false;
  console.log("Category Error: "+JSON.stringify(err));
});

}
if(add){
var tempBook={"bookId":req.body.bookId, "bookName":req.body.bookName, "category":req.body.category.label,"author":req.body.author,
"publisher":req.body.publisher , "quantity":req.body.quantity, "cost":req.body.cost,   "doa":req.body.doa, location:req.body.location,
 "description":req.body.description,"uniqueBookIds" : req.body.uniqueBookIds  }




var addBook = new Books(tempBook);
await  addBook
  .save()
  .then(user => {
      return res.send({msg:"Success"});
  })
  .catch(error => {
    return res.send({error});
  });

}
else{ return res.send({error:"Couldn't update Category"});}

}

function editCategory(req,res)

{ console.log("In editCategory: "+JSON.stringify(req.body));

  BookCategories
  .updateOne({category:req.body.oldCategory},
    {$set: {category:req.body.newCategory,


    }})
  .then(data => {
    //console.log("Student Result: "+JSON.stringify(data))
      return res.send({msg:"Updated"
    });
  })
  .catch(error => {console.log("Error " +error);
    return res.send({error});
  });
}

function updateBook(req,res)

{ console.log("In editCategory: "+JSON.stringify(req.body.selectedBook.value));

  Books
  .updateOne({bookName:req.body.selectedBook.value},
    {$set: {bookId:req.body.bookId, bookName:req.body.bookName, category:req.body.category.label,author:req.body.author,
    publisher:req.body.publisher , quantity:req.body.quantity, cost:req.body.cost,   doa:req.body.doa, location:req.body.location,
     description:req.body.description,uniqueBookIds : req.body.uniqueBookIds 


    }})
  .then(data => {
    //console.log("Student Result: "+JSON.stringify(data))
      return res.send({msg:"Updated"
    });
  })
  .catch(error => {console.log("Error " +error);
    return res.send({error});
  });
}

async function issueBook(req,res)
{var temp=[]; var count=0;
  var books =req.body;


  console.log("in issueBook: "+JSON.stringify(books));

  for(var i=0;i<books.issuedBookDetails.length;i++)


books.issuedBookDetails[i]["isReturned"]=false




  var issueBook = new IssuedBooks(books);
await issueBook
  .save()
  .then(user => {
    console.log("in issueBook Save "+JSON.stringify(user))})

.catch(error=>{return res.send(error)})



  for(var b=0;b<books.issuedBookDetails.length;b++)
  {
  console.log("BookName "+JSON.stringify(books.issuedBookDetails[b].bookName.value))
var uniqueId=books.issuedBookDetails[b].uniqueBookId;
await Books.updateOne({bookName:books.issuedBookDetails[b].bookName.value,"uniqueBookIds.value":uniqueId},
  {"$set": {"uniqueBookIds.$.isIssued":true},
  $inc: {quantity:-1}
})
.then(data=>{count++})
.catch(error=>{
  console.log("Book UpdateOne error "+JSON.stringify(error))
  return res.send({error});})


}



if(count===books.issuedBookDetails.length)
return res.send({msg:"Success"});










}

function gettingStaff(req, res) {
  console.log("in gettingBooks ");

  Users
    .find({ $or:[ {role:"admin"}, {role:"teacher"} ]})
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
      return res.send({error:err});
    });

  }

  function gettingIssuedBooks(req,res)
  {console.log("gettingIssuedBooks: "+JSON.stringify(req.body))

    IssuedBooks
    .find({ issuedTo:req.body.issuedTo} )
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
      return res.send({error:err});
    });

  }

  function getIssuedBooks(req,res)
{console.log("In issuedBookDetails for: "+ JSON.stringify(req.body));


if(req.body.class&&req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{section:req.body.section},{ "issuedBookDetails.isReturned":false}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }

 else if(req.body.class&&!req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{ "issuedBookDetails.isReturned":false}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }


 else if(!req.body.class&&!req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } }, { "issuedBookDetails.isReturned":false}
    ] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }





}

function getReturnedBooks(req,res)
{console.log("In getReturnedBooks for: "+ JSON.stringify(req.body));


if(req.body.class&&req.body.section)
 { IssuedBooks
.find({ $and: [ { "issuedBookDetails.actualReturnedDate": { $gte : new Date(req.body.dos) } }, 
{ "issuedBookDetails.actualReturnedDate": { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{section:req.body.section},{ "issuedBookDetails.isReturned":true}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }

 else if(req.body.class&&!req.body.section)
 { IssuedBooks
.find({ $and: [ { "issuedBookDetails.actualReturnedDate": { $gte : new Date(req.body.dos) } },
 { "issuedBookDetails.actualReturnedDate": { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{ "issuedBookDetails.isReturned":true}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }


 else if(!req.body.class&&!req.body.section)
 { console.log("in else");
  IssuedBooks
  .find({  "issuedBookDetails.actualReturnedDate": { $gte: new Date(req.body.dos), $lte:  new Date(req.body.doe) },
   "issuedBookDetails.isReturned":true
    })



/* .find({ $and: [ { "issuedBookDetails":{"actualReturnedDate": { $gte : new Date(req.body.dos) } }}, 
{ "issuedBookDetails":{"actualReturnedDate": { $lte : new Date(req.body.doe) } }}, 
   { "issuedBookDetails.isReturned":true}
    ] }) */

.then(data => { 
console.log("Data"+ JSON.stringify(data))
return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }





}

function getBookDefaulters(req,res)
{console.log("In getReturnedBooks for: "+ JSON.stringify(req.body));


if(req.body.class&&req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{section:req.body.section},{ "issuedBookDetails.isReturned":true}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }

 else if(req.body.class&&!req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } },
  {class:req.body.class},{ "issuedBookDetails.isReturned":true}] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }


 else if(!req.body.class&&!req.body.section)
 { IssuedBooks
.find({ $and: [ { doi: { $gte : new Date(req.body.dos) } }, { doi: { $lte : new Date(req.body.doe) } },
   { "issuedBookDetails.isReturned":true}
    ] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});
 }





}

  async function returnBook(req,res)
  {var temp=[]; var success=true;
    var book =req.body.issuedBook;


    console.log("in returnBook: "+JSON.stringify(req.body));




     await  IssuedBooks.updateOne({"issuedBookDetails.uniqueBookId": book.uniqueBookId,"issuedTo": req.body.issuedTo,
       "issuedBookDetails.isReturned":false  },
      {'$set': {
        'issuedBookDetails.$.delayInReturn': book.delay,
        'issuedBookDetails.$.totalFine': book.totalFine,

        'issuedBookDetails.$.isReturned': true,
        'issuedBookDetails.$.actualReturnedDate': new Date(req.body.dor),
      

    }})

      .then(user => {
        console.log("IssuedBook returned: "+book.bookName)})

    .catch(error=>{
      success=false;
      return res.send(error)})




  await Books.updateOne({bookName:book.bookName.toLowerCase(),"uniqueBookIds.value":book.uniqueBookId },
    {'$set': {'uniqueBookIds.$.isIssued': false},
    $inc: {quantity:1}
  })
  .then(data=>{console.log("Book Updated "+JSON.stringify(data))}  )
  .catch(error=>{
    success=false;
    console.log("Book UpdateOne error "+JSON.stringify(error))
    return res.send({error});})






  if(success===true)
  return res.send({msg:"Success"});










  }

  
  app.post("/api/getBookDefaulters", getBookDefaulters);

  app.post("/api/importBooks", importBooks);
  app.post("/api/returnBook", returnBook);
  app.post("/api/issueBook", issueBook);
   app.get("/api/getCategories", getCategories);
   app.post("/api/deleteBook", deleteBook);
   app.post("/api/deleteCategory", deleteCategory);
   app.post("/api/addBook", addBook);
   app.post("/api/editCategory", editCategory);
   app.get("/api/gettingBooks", gettingBooks);
   app.get("/api/gettingAllBooks", gettingAllBooks);
   app.get("/api/gettingStaff", gettingStaff);
   app.post("/api/gettingIssuedBooks", gettingIssuedBooks);
   app.post("/api/updateBook", updateBook);
   app.post("/api/getIssuedBooks", getIssuedBooks);
   app.post("/api/getReturnedBooks", getReturnedBooks);
   



  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
