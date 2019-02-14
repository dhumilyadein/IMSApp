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
const updateUser = require("./src/admin/updateUser");
const addFees = require("./src/admin/addFees");
const viewFees = require("./src/admin/viewFees");
const inventory = require("./src/admin/inventory");
const transport = require("./src/admin/transport");
const classDAO = require("./src/admin/classDAO");
const library = require("./src/admin/library");
const exam = require("./src/admin//exam");
const login = require("./src/login");
const SendEmail = require("./src/admin/sendemail/SendEmail");

const app = express();

app.use(bodyparser.json({limit: '10mb', extended: true}));
app.use(bodyparser.urlencoded({limit: '10mb', extended: true}));

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
updateUser(app);
addFees(app);
viewFees(app);
inventory(app);
classDAO(app);
library(app);
exam(app);
SendEmail(app);
transport(app);

var port=process.env.PORT|| 8001;
app.listen(port, () => console.log('Listening...on port: '+port));
