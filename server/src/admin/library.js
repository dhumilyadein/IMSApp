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
"publisher":req.body.publisher , "quantity":req.body.quantity, "cost":req.body.cost,   "doa":req.body.doa,
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

async function issueBook(req,res)
{var temp=[]; var count=0;
  var books =req.body.issuedBookDetails;


  console.log("in issueBook: "+JSON.stringify(req.body));


var issueBook = new IssuedBooks(req.body);
await issueBook
  .save()
  .then(user => {
    console.log("in issueBook Save "+JSON.stringify(user))})

.catch(error=>{return res.send(error)})



  for(var b=0;b<books.length;b++)
  {
  console.log("BookName "+JSON.stringify(books[b].bookName.value))
 await Books.findOne({bookName:books[b].bookName.value})
  .then (book=> { console.log("in findOneBook "+JSON.stringify(book));

  temp=book.uniqueBookIds;

  for(var i=0;i<temp.length;i++)
 {
  if(temp[i].value===books[b].uniqueBookId)
  {
temp[i].isIssued=true;


break;

  }

}



})
.catch(error => { console.log("Book findOne error "+JSON.stringify(error))
  return res.send({error});
});

await Books.updateOne({bookName:books[b].bookName.value,},
  {$set: {uniqueBookIds:temp},
  $inc: {quantity:-1}
})
.then(data=>{count++})
.catch(error=>{
  console.log("Book UpdateOne error "+JSON.stringify(error))
  return res.send({error});})


}



if(count===books.length)
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

  app.post("/api/importBooks", importBooks);

  app.post("/api/issueBook", issueBook);
   app.get("/api/getCategories", getCategories);

   app.post("/api/deleteCategory", deleteCategory);
   app.post("/api/addBook", addBook);
   app.post("/api/editCategory", editCategory);
   app.get("/api/gettingBooks", gettingBooks);
   app.get("/api/gettingStaff", gettingStaff);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
