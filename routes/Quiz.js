const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Quiz=require('../modals/Quiz');
const Submission=require('../modals/Submission');
const express=require('express');
const fetchuser=require('../middleware');
const router=express.Router();
router.post('/newquiz',fetchuser,async(req,res)=>{
    try{
        const user=req.user;
        const {quizname,quizdesc,points,time,questions}=req.body;
        const newquiz=new Quiz({
            userId:user._id,
            quizname,quizdesc,points,time,questions
        })
        const quizresp=await newquiz.save();
        if(!quizresp){
            throw "Error In Creating The Quiz";
        }
        res.status(200).json({success:"Successfully Created The Quiz",quiz:quizresp});
    }
    catch(error){
        res.status(401).json({error});
    }
})
router.post('/myquizzes',fetchuser,async(req,res)=>{
    try{
        const user=req.user;
        const quizzes=await Quiz.find({userId:user._id});
        if(!quizzes){
            throw "Error In Listing The Quizzes"
        }
        res.status(200).json({success:"Successfully Listed the Quizzes",quizzes});
    }
    catch(error){
        res.status(401).json({error});
    }
})
router.post('/updatequiz/:id',fetchuser,async(req,res)=>{
    try{
        const user=req.user;
        const quiz=await Quiz.replaceOne({_id:req.params.id},req.body);
        if(!quiz || quiz.modifiedCount<=0){
            throw "Error In Updating The Quiz";
        }
        res.status(200).json({success:"Successfully Updated The Quiz"});
    }
    catch(error){
        res.status(401).json({error});
    }
})
router.post('/livequiz',fetchuser,async(req,res)=>{
    try{
    const user=req.user;
    const uid=user._id;
    const livequizzes=await Quiz.find({userId: {$ne:uid}});
    if(!livequizzes){
        throw "Error In Finding Live Quizzes";
    }
    let quizzes=[];
    for(element of livequizzes){
        const submission=await Submission.findOne({quizId:element._id})
        if(submission){
            const hasSubmitted= submission.submissions.findIndex((ele)=>ele.userId===uid);
            if(hasSubmitted===-1){
                quizzes=[...quizzes,element];
            }
        }
        else{
            quizzes=[...quizzes,element];
        }
    }
    res.status(200).json({success:"Successfully Listed The Live Quizzes",quizzes});
}
catch(error){
    res.status(401).json({error});
}
})

router.post('/attempted',fetchuser, async(req,res)=>{
    try{
        const user=req.user;
        const uid=user._id;
        const quizzes=await Submission.find({submissions:{$elemMatch:{userId:uid}}}).populate('quizId');
        if(!quizzes){
            throw "Error In Listing The Attempted Quizzes";
        }
        const result=[];
        for(const quiz of quizzes){
            for(const submission of quiz.submissions){
                if(submission.userId===uid){
                    result.push({...quiz._doc,submissions:submission});
                    break;
                }
            }
        }
        res.status(200).json({success:"Successfully Listed All The Attempted Quizzes",quizzes:result});
    }
    catch(error){
        res.status(401).json({error});
    }
})
module.exports=router;