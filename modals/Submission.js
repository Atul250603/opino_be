const mongoose=require('mongoose');
const submissionSchema=new mongoose.Schema({
    quizId:{
        type:mongoose.Types.ObjectId,
        ref:'quiz'
    },
    submissions:Array
})

module.exports=mongoose.model('submission',submissionSchema);