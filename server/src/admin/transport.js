const Stops = require("../../models/Stops");
const ConsumedItems = require("../../models/ConsumedItems");
const Vehicles = require("../../models/Vehicles");

module.exports = function (app) {


async function addItems(req, res) {
console.log("in addItems Req.body: "+JSON.stringify(req.body))

var template = {
  "listName": req.body.listName, "dos": req.body.dos, "itemRows": req.body.rows,
  "grandTotal":req.body.grandTotal, "remarks":req.body.remarks

};
var addItem = new PurchaseItems(template);


for(var i=0;i<req.body.rows.length;i++)
{

  await Items
  .updateOne({itemName:req.body.rows[i].itemName.value},
    {$inc: {quantity:req.body.rows[i].quantity

             }}
    )
  .then(data => {



  })
  .catch(err => {
  return res.send({error:err});
  });



}

addItem
.save()
.then(user => {
    return res.send({msg:"Success"});
})
.catch(err => {
  return res.send(err);
});


}

async function addVehicle(req, res) {
  console.log("in addVehicle Req.body: "+JSON.stringify(req.body))

  
  var addVehicle = new Vehicles(req.body);





  await addVehicle
    .save()
    .then(user => {
        return res.send({msg:"Success"});
    })
    .catch(err => {
      return res.send(err);
    });

  }

  async function addStop(req, res) {
    console.log("in addStop Req.body: "+JSON.stringify(req.body))
  
    
    var addStop = new Stops(req.body);
  
  
  
  
  
    await addStop
      .save()
      .then(user => {
          return res.send({msg:"Success"});
      })
      .catch(err => {
        return res.send(err);
      });
  
    }

  async function consumeItem(req, res) {
    console.log("in consumeItem Req.body: "+JSON.stringify(req.body))

    Items
    .updateOne({itemName:req.body.itemName},
      {$inc: {quantity:-1*parseInt(req.body.consumedQuantity)

               }}
      )
    .then(data => {
     var consumeItems = new ConsumedItems(req.body);
     consumeItems.save()
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


function existingVehicles(req, res) {
  console.log("in existingVehicles ");

  Vehicles
    .find()
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
      return res.send({error:err});
    });

  }

  function existingStops(req, res) {
    console.log("in existingVehicles ");
  
    Stops
      .find()
      .then(data => {
          return res.send(data);
      })
      .catch(err => {
        return res.send({error:err});
      });
  
    }

  function deleteVehicle(req,res)
  {console.log("In deleteVehicle: "+ JSON.stringify(req.body.VehicleNo));

Vehicles
.deleteOne({VehicleNo:req.body.VehicleNo})
.then(data => {
  return res.send({msg:"Vehicle Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}
function deleteStop(req,res)
{console.log("In deleteVehicle: "+ JSON.stringify(req.body.VehicleNo));

Stops
.deleteOne({stopName:req.body.stopName})
.then(data => {
return res.send({msg:"Stop Deleted"});
})
.catch(err => {
return res.send({error:err});
});


}

async function editVehicle(req,res)
{console.log("In editVehicle for: "+ JSON.stringify(req.body));



  Vehicles
.updateOne({VehicleNo:req.body.existingVehicles[req.body.vNo].VehicleNo},
  {$set: req.body}
  )
.then(data => {

return res.send({msg:"Vehicle Updated"});
})
.catch(err => {
return res.send({error:err});
});







}
async function editStop(req,res)
{console.log("In editVehicle for: "+ JSON.stringify(req.body));



  Stops
.updateOne({stopName:req.body.existingStops[req.body.stopNo].stopName},
  {$set: req.body}
  )
.then(data => {

return res.send({msg:"Stop Updated"});
})
.catch(err => {
return res.send({error:err});
});







}

async function getAddedItems(req,res)
{console.log("In getAddedItems for: "+ JSON.stringify(req.body));



  PurchaseItems
.find({ $and: [ { dos: { $gte : new Date(req.body.dos) } }, { dos: { $lte : new Date(req.body.doe) } }] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});







}


async function getConsumedItems(req,res)
{console.log("In getConsumedItems for: "+ JSON.stringify(req.body));




ConsumedItems
.find({ $and: [ { doc: { $gte : new Date(req.body.dos) } }, { doc: { $lte : new Date(req.body.doe) } }] })

.then(data => {

return res.send({data});
})
.catch(err => {
return res.send({error:err});
});








}



  app.post("/api/addItems", addItems);
  app.post("/api/addVehicle", addVehicle);
  app.get("/api/existingVehicles", existingVehicles);
  app.get("/api/existingStops", existingStops);
  app.post("/api/deleteVehicle", deleteVehicle);
  app.post("/api/deleteStop", deleteStop);
  app.post("/api/editVehicle", editVehicle);
  app.post("/api/editStop", editStop);
  app.post("/api/consumeItem", consumeItem);
  app.post("/api/getAddedItems", getAddedItems);
  app.post("/api/getConsumedItems", getConsumedItems);
  app.post("/api/addStop", addStop);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
