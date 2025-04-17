let jwt = require("jsonwebtoken");

async function IsLoggedIn(req,resp,next){
try{
let {lgntkncof}=req.cookies;
if(!lgntkncof){
  return  resp.status(400).json({"message":"Please login"})
}
let decoded_info= await jwt.verify(lgntkncof,process.env.JWT_SECRET_KEY);
if(!decoded_info){
    return  resp.status(400).json({"message":"unauthorised user"})

}
req.userInfo=decoded_info;//user._id & email
next();
}
catch(err){
    console.log(err,"in login middleware");
    return resp.status(500).json({"message":"internal server error"});
}
}
module.exports={IsLoggedIn};