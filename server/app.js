const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const adminRegister = require("./src/admin/registerUser");
const adminImport = require("./src/admin/importUsers");
const adminSearch = require("./src/admin/searchUser");
const studentSearch = require("./src/admin/searchStudent");
const parentSearch = require("./src/admin/searchParent");
const feetemplate = require("./src/admin/feeTemplate");
<<<<<<< HEAD
const updateUser = require("./src/admin/updateUser");
=======
const addFees = require("./src/admin/addFees");
const viewFees = require("./src/admin/viewFees");
>>>>>>> 60b26d584ccdb67dff36efbe711b3061dbed9eb6

const login = require("./src/login");
const app = express();

app.use(bodyparser.json());
mongoose.connect('mongodb://localhost:27017/IMS', { useNewUrlParser: true });
app.use(
  cors({
    origin: [
      "http://localhost:3000",

    ],
    methods: ["GET", "HEAD", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true //allow setting of cookies
  })
);
app.use(
  session({
    secret: "supersecretstring12345!",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60000 * 30 }
  })
);




adminRegister(app);
adminImport(app);
adminSearch(app);
studentSearch(app);
feetemplate(app);
login(app);
parentSearch(app);
<<<<<<< HEAD
updateUser(app);

=======
addFees(app);
viewFees(app);
>>>>>>> 60b26d584ccdb67dff36efbe711b3061dbed9eb6
var port=process.env.PORT|| 8001;
app.listen(port, () => console.log('Listening...on port: '+port));
