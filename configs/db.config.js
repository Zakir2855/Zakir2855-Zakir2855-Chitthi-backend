const mongoose=require("mongoose");
function DBconnect(){
    mongoose.connect(`${process.env.MONGO_DB_URI}+${process.env.DB_NAME}`).then((res)=>{
        console.log("database is conneted");
        
    }).catch((err)=>console.log(err,"in connect database")
    )
}
 module.exports={DBconnect};