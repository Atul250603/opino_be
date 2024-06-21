const jwt=require('jsonwebtoken');
const fetchuser=(req,res,next)=>{
    try{
        const token=req.header('authToken');
        if(!token){
            throw "Authentication Failed";
        }
        const data=jwt.verify(token,process.env.SECRET);
        req.user=data;
        next();
    }
    catch(error){
        res.status(401).json({error:"Some Error In Authenticating You"});
    }
}
module.exports=fetchuser;