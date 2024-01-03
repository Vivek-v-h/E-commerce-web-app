const express=require("express");
const path=require("path");
const router=express.Router();
const { upload}=require("../multer");
const User = require("../model/user");
const Errorhandler = require("../utils/Errorhandler");
const { fstat } = require("fs");

router.post("/create-user", upload.single("file"), async(req,res,next)=>{
    const {name,email,password}=req.body;
    const userEmail=await User.findOne({email});

    if(userEmail){
        const filename=req.file.filename;
        const filePath=`uploads/${filename}`;
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
        avatar:fileUrl,
    }

    console.log(user);
    /*
    const newUser=await User.create(user);
    res.status(201).json({
        success:true,
        newUser,
    })
    */
})

module.exports=router;