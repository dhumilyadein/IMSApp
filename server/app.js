const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const controller = require("./controller");

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
controller(app);
var port=process.env.PORT|| 8001;
app.listen(port, () => console.log('Listening...on port: '+port));
