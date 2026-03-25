import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import 'dotenv/config.js'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const UploadCloudinary = async(localFilePath)=>{
 try {
       if(!localFilePath) return null;
   
      const result = await cloudinary.uploader.upload(localFilePath,{
       folder : "auth",
      });
      fs.unlinkSync(localFilePath);
      return result;
   }
 catch (err) {
    console.error("Cloudinary Error :" , err.message );
    return null;
 }
 };
 export default UploadCloudinary;
