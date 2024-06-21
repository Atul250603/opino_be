const mongoose=require('mongoose');
const quizSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'auth'
    },
    quizname:String,
    quizdesc:String,
    points:Number,
    time:Number,
    questions:Array
})
module.exports=mongoose.model('quiz',quizSchema);