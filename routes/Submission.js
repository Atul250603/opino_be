const jwt=require('jsonwebtoken');
const Submission=require('../modals/Submission');
const express=require('express');
const fetchuser=require('../middleware');
const router=express.Router();
router.post('/submit/:quizid',fetchuser,async(req,res)=>{
    try{
        const user=req.user;
        const uid=user._id;
        const quiz=await Submission.findOne({quizId:req.params.quizid});
        const data={...req.body,userId:uid};
        if(!quiz){
            const newquiz=new Submission({
                quizId:req.params.quizid,
                submissions:[data]
            })
            const savedquiz=await newquiz.save();
            if(!savedquiz){
                throw "Error In Submitting The Quiz";
            }
        }
        else{
            const submission=[...quiz.submissions,data];
            const updatequiz=await Submission.updateOne({quizId:req.params.quizid},{$set:{submissions:submission}});
            if(!updatequiz || !updatequiz.modifiedCount){
                throw "Error In Submitting The Quiz";
            }
        }
        res.status(200).json({success:"Successfully Submitted The Quiz"});
    }
    catch(error){
        res.status(401).json({error});
    }
})
module.exports=router;