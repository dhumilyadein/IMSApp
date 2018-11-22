var util = require('util');

var { check } = require("express-validator/check");

const User = require("../../models/User");

module.exports = function(app) {
    const serValidation = [
        check("find")
          .not()
          .isEmpty()
          .withMessage("Please enter Search Text")
           ];

           
  
  //---------------------------------------------
 
  /**
     * @description Post method for SearchUser service
     */
    function searchStudent(req, res) {

      console.log("SEARCH Student ENTRY");
  
      var findValue = req.body.find;
      
      console.log(" findValue - " + JSON.stringify(req.body));
  
      User.find({$or: [{firstname: {$regex: new RegExp(req.body.find, "ig")}},
                        {lastname:{$regex: new RegExp(req.body.find, "ig")}},
                       
      ]


},function(err, doc) {
                   console.log("results: "+JSON.stringify(doc));
});

      console.log("SEARCH USER EXIT");
    }

    app.post("/api/searchStudent", searchStudent);
  app.get("/", (req, res) => res.json("sdasdsa"));
};
