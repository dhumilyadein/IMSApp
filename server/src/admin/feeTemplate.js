const FeeTemplate = require("../../models/FeeTemplatesModel");

module.exports = function (app) {
async function addFeeTemplate(req, res) {
console.log("in Add Fee Req.body: "+JSON.stringify(req.body))

var template = {
  "templateName": req.body.templateName.toLowerCase(), "status": req.body.status, "templateRows": req.body.rows,

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

function existingTemplates(req, res) {
  console.log("in Existing temp");

  FeeTemplate
    .find({status:"Active"})
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
      return res.send({error:"Fail to fetch existing records"});
    });

  }

  function deleteTemplate(req,res)
  {console.log("In Delete Template for: "+ JSON.stringify(req.body));

//FeeTemplate
//.deleteOne({templateName:req.body.existingRows.})


}


  app.post("/api/feeTemplate", addFeeTemplate);
  app.get("/api/existingTemplates", existingTemplates);
  app.post("/api/deleteTemplate", deleteTemplate);



  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
