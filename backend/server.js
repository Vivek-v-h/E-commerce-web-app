const app=require("./app");
const connectDatabase = require("./db/Database");



process.on("uncaughtException",(err)=>{
    console.log(`Uncaught Exception: ${err.message}`);
    console.log("shutting down server due to uncaught exception");
})



if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
}


//db

connectDatabase();

const server=app.listen(process.env.port,()=>{
    console.log(`Listening on ${process.env.port}`);
})


process.on("unhandledRejection",(err)=>{
    console.log(`Shutting the server due to Unhandled Rejection: ${err.message}`);

    server.close(()=>{
        process.exit(1);
    })
})