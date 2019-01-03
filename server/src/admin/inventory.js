const InventoryItems = require("../../models/InventoryItems");

module.exports = function (app) {


async function addItems(req, res) {
console.log("in addItems Req.body: "+JSON.stringify(req.body))

var template = {
  "listName": req.body.listName, "dos": req.body.dos, "itemRows": req.body.rows,
  "grandTotal":req.body.grandTotal

};
var addItem = new InventoryItems(template);





await addItem
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







}



  app.post("/api/addItems", addItems);
  app.get("/api/existingTemplates", existingTemplates);
  app.post("/api/deleteTemplate", deleteTemplate);
  app.post("/api/updateFeeTemplate", updateFeeTemplate);
 



  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
