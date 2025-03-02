import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoFDb Connected|| DB Host ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("Mongo DB Error",error.message);
        process.exit(1);
    }
}

export default connectDB