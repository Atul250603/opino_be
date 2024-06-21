const mongoose=require('mongoose');
const connectToDb=async()=>{
    try{
        if(await mongoose.connect(process.env.MONGOURI)){
            console.log("Connected To DB");
        }
        else{
            throw "Failed To Connect To DB"
        }
        
    }
    catch(error){
        console.log(error);
    }
}
module.exports=connectToDb;