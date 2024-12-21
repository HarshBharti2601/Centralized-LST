import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to mongodb');
    }catch(error){
        console.log('Error connecting to mongodb');
        process.exit(1);
    }
}