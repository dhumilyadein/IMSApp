const Stops = require("../../models/Stops");
const ConsumedItems = require("../../models/ConsumedItems");
const Vehicles = require("../../models/Vehicles");

module.exports = function (app) {


async function addRoute(req, res) {
console.log("in addRoute Req.body: "+JSON.stringify(req.body))

var template = {
  "route": req.body.route, "description":req.body.description

};

Vehicles
.updateOne({vehicleNo:req.body.vehicleNo},
  {$push: {routeDetails:template}}
  )
.then(data => {

return res.send({msg:"Success"});
})
.catch(err => {
return res.send({error:err});
});

}

async function addStudent(req, res) {
  console.log("in addStudent Req.body: "+JSON.stringify(req.body));
  var tempStudent=[];
  for(var i=0;i<req.body.students.length;i++)
  tempStudent.push(req.body.students[i].label);
  var template = {
    "stopName": req.body.stopName, "students":tempStudent
  
  };
 
 await Vehicles
  .findOne({vehicleNo:req.body.vehicleNo, "studentDetails.stopName":req.body.stopName})
  .then(data => {
  if(data)
  {
   console.log("Stopname: "+JSON.stringify(data));
  /*  var temp;
for(var i=0;i<data.studentDetails.length;i++)
{if(data.studentDetails[i].stopName===req.body.stopName)
temp=data.studentDetails[i].students;
break;}
console.log("Students: "+JSON.stringify(temp));
for(var i=0;i<tempStudent.length;i++)
temp.push(tempStudent[i]);
temp=Array.from(new Set(temp));

console.log("Students Updated: "+JSON.stringify(temp)); */



 Vehicles.updateOne({vehicleNo:req.body.vehicleNo,"studentDetails.stopName":req.body.stopName},
  {"$set": {"studentDetails.$.students":template.students}}
  )
.then(data => {

return res.send({msg:"Success"});
})
.catch(err => {
return res.send({error:err});
});


  }
  else{

    Vehicles.updateOne({vehicleNo:req.body.vehicleNo},
      {$push: {studentDetails:template}}
      )
    .then(data => {
    
    return res.send({msg:"Success"});
    })
    .catch(err => {
    return res.send({error:err});
    });
  }
    
    })
    .catch(err => {
    return res.send({error:err});
    });




 /*  .updateOne({vehicleNo:req.body.vehicleNo},
    {$push: {students:template}}
    )
  .then(data => {
  
  return res.send({msg:"Success"});
  })
  .catch(err => {
  return res.send({error:err});
  }); */
  
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

function deleteRoute(req,res)
{console.log("In deleteRoute: "+ JSON.stringify(req.body));

Vehicles
.update(
  {'vehicleNo': req.body.vehicleNo},
  { $pull: { "routeDetails" : { route: req.body.route } } },

)
.then(data => {
return res.send({msg:"Route Deleted"});
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

async function editRoute(req,res)
{console.log("In editRoute for: "+ JSON.stringify(req.body));


Vehicles
.update(
  {'vehicleNo': req.body.vehicleNo},
  { $set: { "routeDetails" : { route: req.body.route , description:req.body.description} } },

)
.then(data => {
return res.send({msg:"Route Updated"});
})
.catch(err => {
return res.send({error:err});
});








}






  app.post("/api/addRoute", addRoute);
  app.post("/api/addVehicle", addVehicle);
  app.post("/api/addStudent", addStudent);
  app.get("/api/existingVehicles", existingVehicles);
  app.get("/api/existingStops", existingStops);
  app.post("/api/deleteVehicle", deleteVehicle);
  app.post("/api/deleteStop", deleteStop);
  app.post("/api/deleteRoute", deleteRoute);
  app.post("/api/editVehicle", editVehicle);
  app.post("/api/editStop", editStop);
  app.post("/api/editRoute", editRoute);
 
  
 
  app.post("/api/addStop", addStop);






  app.get("/", (req, res) => res.json("sdasdsa"));
  //---------------------------------------------

}
