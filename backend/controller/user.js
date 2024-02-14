const express=require("express");
const path=require("path");
const router=express.Router();
const { upload}=require("../multer");
const User = require("../model/user");
const Errorhandler = require("../utils/Errorhandler");
const fs = require("fs");
const jwt=require("jsonwebtoken")

router.post("/create-user", upload.single("file"), async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
    const userEmail=await User.findOne({email});

    if(userEmail){
        const filename=req.file.filename;
        const filePath=`./../../uploads${filename}`;
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error deleting file"})
            }else{
                res.json({message:"File deleted succesfully"})
            }
        })
        return next(new Errorhandler("user already exists",400));
    }

    const filename=req.file.filename;
    const fileUrl=path.join(filename);

    const user={
        name:name,
        email:email,
        password:password,
        avatar:{public_id:filename,url:fileUrl},
    }
    
    const activationToken=createActivationToken(user)

    const activationUrl=`http://localhost:3000/activation/${activationToken}`
    try{
        
    }catch(err){
        return next(new Errorhandler(err.message,500))
    }

    }catch(err){
        return next(new Errorhandler(err.message,400))
    }
    
})

const createActivationToken=(user)=>{
    return jwt.sign(user,process.env.ACTIVATION_SECRET,{
        expiresIn: "5m"
    })
}

module.exports=router;