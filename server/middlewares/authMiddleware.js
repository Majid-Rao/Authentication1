 import { ApiError } from "../utility/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utility/asyncHandler.js";
import "dotenv/config.js"
import cookieParser from 'cookie-parser';
import { User } from "../models/userModel.js";
const validateTokens = asyncHandler(async(req,res,next)=>{
  const token =
    req.cookies?.AccessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

     if(!token) throw new ApiError(400,"tokens not found!");

     const decode = jwt.verify(token,process.env.ACCESS_TOKENS)
     
     const user = await User.findById(decode._id);
     if(!user) throw new ApiError(401,"User not found!");
     req.user = user;
     next();
     
})
export {validateTokens}