const express=require("express");
const Errorhandler = require("./utils/Errorhandler");
const app=express();
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const fileUpload=require("express-fileupload")

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload({useTempFiles:true}));




if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
}


app.use(Errorhandler);

module.exports=app;