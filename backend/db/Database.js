const { default: mongoose } = require("mongoose");
const nmongoose=require("mongoose");


const connectDatabase=()=>{
    mongoose.connect(process.env.DBURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data)=>{
        console.log(`mongod connected with server:${data.connection.host}`)
    })
}

module.exports=connectDatabase;