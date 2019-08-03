const InstituteDetails = require("../../models/InstituteDetails");
var multer = require("multer");
let logoPath=null;
const rimraf = require("rimraf");
var fs = require('fs');

var logoStorage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./logoUploads/");
  },
  filename: function(req, file, cb) {
    var date = Date.now();
    cb(
      null,

      file.originalname
    );
  }
});


var logoUpload = multer({
  //multer settings
  storage: logoStorage,
  fileFilter: function(req, file, callback) {

    callback(null, true);
  }
}).single("file");

module.exports = function (app) {


async function addInstitute(req, res) {
console.log("in addInstitute Req.body: "+JSON.stringify(req.body))

var template = {
  "instituteName": req.body.instituteName, "address": req.body.address, "city": req.body.city, "state":req.body.state,
  "pincode":req.body.pinCode, "telephone":req.body.telephone, "mobile":req.body.mobile, "fax":req.body.faxNo,
  "email":req.body.email, "website":req.body.website, "logo":req.body.logo

};
var addInstitute = new InstituteDetails(template);
addInstitute.logo.data = fs.readFileSync(logoPath);
addInstitute.logo.contentType = 'image/png';

await addInstitute.deleteMany();

await addInstitute
.save()
.then(user => {
  return res.send({msg:"Success"});
})
.catch(err => {
  return res.send({error:err});
});


}



function existingItems(req, res) {
  console.log("in existingItems ");

  Items
    .find()
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
      return res.send({error:err});
    });

  }


async function logoUploading(req,res)
{
 console.log("in Logo Upload ");

 await rimraf('./logoUploads/*.*', function (e) {

  console.log(e);
  console.log('Add intitute - Deleted logo');
  logoUpload(req, res, function (err) {
    if (err) {
       res.json({ error_code: 1, err_desc: err });
    }
    /** Multer gives us file info in req.file object */
    else if (!req.file)
       res.json({ error_code: 1, err_desc: "No file passed" });
  else{
    console.log(req.file.path);
  logoPath = req.file.path;
  res.json({message:"Logo uploaded to " +logoPath});
  }



  });
});


  }



  app.post("/api/addInstitute", addInstitute);

  app.get("/api/existingItems", existingItems);

  app.post("/api/logoUploading", logoUploading);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
