const express=require("express");
const Errorhandler = require("./middleware/error");
const app=express();
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors=require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/",express.static("uploads"));




if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
}


const user=require("./controller/user");

app.use("/api/v2/user",user);



app.use(Errorhandler);

module.exports=app;