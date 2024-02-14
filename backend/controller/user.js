const express=require("express");
const path=require("path");
const router=express.Router();
const { upload}=require("../multer");
const User = require("../model/user");
const Errorhandler = require("../utils/Errorhandler");
const catchAsyncErrors=require("../middleware/catchAsysncErrors")
const fs = require("fs");
const jwt=require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken=require("../utils/jwtToken")

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
        await sendMail({
            email:user.email,
            subject:"Activate your account",
            message: `Hello ${user.name},\n\nPlease click on the following link to activate your account \n ${activationUrl}`
        })
        res.status(201).json({
            success:true,
            message:`click on the link sent to  ${user.email} to activate your account`
        })
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

router.post("/activation",catchAsyncErrors(async(req,res,next)=>{
    try{
        const {activation_token}=req.body;
        const newUser=jwt.verify(activation_token,process.env.ACTIVATION_SECRET);

        if(!newUser){
            return next(new Errorhandler("Invalid token",400));

        }
        const {name,email,password,avatar}=newUser;
        let user=await User.findOne({email});

        if(user){
            return next(new Errorhandler("User already exists,400"))
        }
        user=await User.create({
            name,
            email,
            avatar,
            password
        })

        sendToken(user,201,res)
    }catch(error){
        return next(new Errorhandler(error.message,500))
    }
}))

module.exports=router;