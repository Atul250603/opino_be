const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Auth=require('../modals/Auth');
const express=require('express');
const router=express.Router();
router.post('/signup',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await Auth.findOne({email:email});
        if(user){
            throw "User Already Exists";
        }
        const newpass=await bcrypt.hash(password,10);
        if(!newpass){
            throw 'Error In Signing Up';
        }
        const newuser=new Auth({
            email,
            password:newpass
        })       
        const result=await newuser.save();
        if(!result){
            throw "Error In Signing Up";
        }   

        res.status(200).json({success:"Successfully Signed Up"});
    }
    catch(error){
        res.status(401).json({error:error});
    }
})
router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await Auth.findOne({email});
        if(!user){
            throw "No Such User Exists";
        }
        const matchpass=await bcrypt.compare(password,user.password);
        if(!matchpass){
            throw "Wrong Password";
        }
        const token=jwt.sign({_id:user._id,email:user.email},process.env.SECRET);
        if(!token){
            throw 'Error In Logging In';
        }
        res.status(200).json({success:"Successfully Logged In",token});
    }
    catch(error){
        res.status(401).json({error:error});
    }
})
module.exports=router;