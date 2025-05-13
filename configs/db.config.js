const mongoose=require("mongoose");
function DBconnect(){
  return  mongoose.connect(`${process.env.MONGO_DB_URI}+${process.env.DB_NAME}`)
}
 module.exports={DBconnect};