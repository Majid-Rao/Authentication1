import mongoose from "mongoose";
import 'dotenv/config.js'
const ConnectDB = async ()=>{
    try {
        const connectionIns = await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`Database Connected! Host : ${connectionIns.connection.host}`);
        
    } catch (error) {
        console.log("DB Connection failed",error);   
    }
}
export default ConnectDB;