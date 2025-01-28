import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path : './.env'
})


connectDB().then(()=>{
    app.listen(process.env.PORT|| 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("Mongo db connextion failed",err)
})

















// import express from "express"
// const app = express()


// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(e)=>{
//             console.log("error",error);
//             throw error;
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log(`the app is listening in ${process.env.PORT}`)
//         })
        
//     }catch(e){
//         console.log("Error:",error)
//     }
// })()