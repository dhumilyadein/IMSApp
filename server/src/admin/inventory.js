const PurchaseItems = require("../../models/PurchaseItems");
const Items = require("../../models/Items");

module.exports = function (app) {


async function addItems(req, res) {
console.log("in addItems Req.body: "+JSON.stringify(req.body))

var template = {
  "listName": req.body.listName, "dos": req.body.dos, "itemRows": req.body.rows,
  "grandTotal":req.body.grandTotal, "remarks":req.body.remarks

};
var addItem = new PurchaseItems(template);





await addItem
  .save()
  .then(user => {
      return res.send({msg:"Success"});
  })
  .catch(err => {
    return res.send(err);
  });

}

async function createItem(req, res) {
  console.log("in createItem Req.body: "+JSON.stringify(req.body))

  var template = {
    "itemName": req.body.itemName, "unit": req.body.unit, "quantity": 0,

  };
  var createItem = new Items(template);





  await createItem
    .save()
    .then(user => {
        return res.send({msg:"Success"});
    })
    .catch(err => {
      return res.send(err);
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

  function deleteItem(req,res)
  {console.log("In deleteItem: "+ JSON.stringify(req.body.itemName));

Items
.deleteOne({itemName:req.body.itemName})
.then(data => {
  return res.send({msg:"Item Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}

async function editItem(req,res)
{console.log("In editItem for: "+ JSON.stringify(req.body));



  Items
.updateOne({itemName:req.body.existingItems[req.body.itemNo].itemName},
  {$set: {itemName:req.body.itemName,
          unit:req.body.unit,
           }}
  )
.then(data => {

return res.send({msg:"Item Updated"});
})
.catch(err => {
return res.send({error:err});
});







}



  app.post("/api/addItems", addItems);
  app.post("/api/createItem", createItem);
  app.get("/api/existingItems", existingItems);
  app.post("/api/deleteItem", deleteItem);
  app.post("/api/editItem", editItem);




  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
