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
const teacherDAO = require("./src/admin/TeacherDAO");
const studentsDAO = require("./src/admin/studentsDAO");
const library = require("./src/admin/library");
const examsDAO = require("./src/admin/examsDAO");
const login = require("./src/login");
const sendmail = require("./src/admin/sendmail/sendmail");
const payroll = require("./src/admin/payroll");
const leaves = require("./src/admin/leaves");


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
teacherDAO(app);
studentsDAO(app);
library(app);
examsDAO(app);
sendmail(app);
transport(app);
payroll(app);
leaves(app);

var port=process.env.PORT|| 8001;
app.listen(port, () => console.log('Listening...on port: '+port));
