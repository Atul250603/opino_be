require('dotenv').config()
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const cors=require('cors');
app.use(bodyparser.json());
app.use(cors());
const port=5000||process.env.PORT;
const connectToDb=require('./db');
connectToDb();
app.use('/auth',require('./routes/Auth.js'));
app.use('/quiz',require('./routes/Quiz.js'));
app.use('/submissions',require('./routes/Submission.js'));
app.listen(port,()=>{
    console.log(`Server Started At Port ${port}`)
})
