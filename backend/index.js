const express = require("express");
const mongooes = require("mongoose");
const cors = require("cors");
let config = require("./config.json")
let app = express();
const errorHandler = require("./utils").errorHandler;

// Middleware
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + "/public")); // for testing 


let url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=valtech`;

mongooes.connect(url)
    .then(res => console.log("Database Connected !!"))
    .catch(err => console.log("Error when connecting database :", err));

let objectId = mongooes.Schema.ObjectId;
let schema = mongooes.Schema;

//Schema Add below
//for user detail -- schema name --> users



// Routes
app.get("/",(req,res)=>{
    res.render("index.html");
});




app.listen(config.port, config.host, errorHandler);