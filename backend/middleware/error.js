const ErrorHandler=require("../utils/Errorhandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode|| 500
    err.message=err.message|| "Internal server error"

    //mongodb id
    if(err.name==="CastError"){
        const message=`Resources not found with this id.. Invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }


    //Duplicate Key
    if(err.code===11000){
        const message=`Duplicate key ${Object.keys(err.keyValue)} Entered`;
        err= new ErrorHandler(message,400);
    }

    //wrong jwt
    if(err.name==="JsonWebTokenError"){
        const message="Your url is invalid"
        err=new ErrorHandler(message,400)
    }

    //jwt expired
    if(err.name==="TokenExpiredError"){
        const message="Session Expired. Please try again."
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}