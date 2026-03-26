import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken"
import {User} from "../models/userModel.js"
import {asyncHandler} from "../utility/asyncHandler.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import UploadCloudinary from "../utility/FileUpload.js"
import "dotenv/config.js"
import transporter from "../utility/nodeMailer.js";
const generateAccessandRefreshToken = async(userId)=>{
    const user = await User.findById(userId);
    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();
    user.refreshToken = RefreshToken;
    user.save({validateBeforeSave : false});
    return {AccessToken,RefreshToken};
}
const registerUser = asyncHandler(async(req,res)=>{
    /*
    req.body
    validate 
    existed user 
    file upload
    database entry
    -pass and reftoken
    */
    const {fullName,email,password} = req.body;
    if([fullName,email,password].some((field)=>field?.trim() === ""))
    {
        throw new ApiError(400,"fields are empty!")
    }
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(401,"User already exist");
    }

    const imgPath = req.files?.coverImage?.[0]?.path;
    if(!imgPath) throw new ApiError(401,"image path not found");
    
    const coverImage = await UploadCloudinary(imgPath);

    const user = await User.create({
        fullName,
        email,
        password,
        coverImage:coverImage.url,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    const mailOption = {
        from : process.env.SENDER_EMAIL,
        to : email,
        subject : "Welcome to working",
        text : `hello ${email}`
    }
    await transporter.sendMail(mailOption);
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully!")
    )
})
const loginUser = asyncHandler(async(req,res)=>{
    /*
    req.body
    validate
    existeduser
    validatepass
    generateTokens
    cookie
    */
   const {email,password} = req.body;
   if(!email) throw new ApiError(400,"please enter your email!");

   const user = await User.findOne({email})
   if(!user) throw new ApiError(401,"user not exist");
   
   const ValidatePassword = await user.isPasswordCorrect(password);
   if(!ValidatePassword) throw new ApiError(401,"password is incorrect");
   const {AccessToken,RefreshToken} = await generateAccessandRefreshToken(user._id);
   const LoggedInUser = await User.findById(user._id).select("-password -refreshToken");
   const options = {
    httpOnly : true,
    secure : false,
   }
   return res.status(200)
   .cookie("AccessToken",AccessToken,options)
   .cookie("RefreshToken",RefreshToken,options)
   .json(
    new ApiResponse(
        201,
        { 
            user : LoggedInUser,AccessToken,RefreshToken
        },
        "User LoggedIn SuccessFully"
    )
   )
})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : false
    }
    return res.status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(
        new ApiResponse(
            201,
            "User Logged Out!"
        )
    )
})
const refreshAccessToken = asyncHandler(async(req,res)=>{
      const IncommingTokens = req.cookies?.RefreshToken || req.body.RefreshToken;
      if(!IncommingTokens) throw new ApiError(400,"Incomming Tokens not found!");
      const decode = jwt.verify(IncommingTokens,process.env.REFRESH_TOKENS);
      const user = await User.findById(decode._id);
      if(!user) throw new ApiError(401,"user not found!");
      if(IncommingTokens !== user?.refreshToken){
        throw new ApiError(401,"Tokens not matched!");
      }

      const {AccessToken,RefreshToken} = await generateAccessandRefreshToken(user._id);
      const options = {
        httpOnly : true,
        secure : false,
      }
      return res.status(200)
      .cookie("AccessToken",AccessToken,options)
      .cookie("RefreshToken",RefreshToken,options)
      .json(
        new ApiResponse(200,{AccessToken,RefreshToken},"Tokens Refreshed")
      )
})
const currentUser = asyncHandler(async(req,res)=>{
      return res.status(200).json(
        new ApiResponse(201,req.user,"current user")
      )
})
const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user._id);
    const validatePassword = user.isPasswordCorrect(oldPassword);
    if(!validatePassword) {
        throw new ApiError(401,"password is wrong");
    } 
    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(201,{},"Password Changed!")
    )
})
const sendVerifyOtp = asyncHandler(async(req,res)=>{
     const {userId} = req.body;
     const user = await User.findById(userId);
     if(user.isAccountVerified){
        throw new ApiError(401,"Account already verified!");
     }

     const otp = String(Math.floor(100000 + Math.random() * 900000));
     user.verifyOtp = otp;
     user.verifyOtpExpire = Date.now() + 24 * 60 * 60 * 1000;
     await user.save({validateBeforeSave : false});

     const mailerOption = {
        from : process.env.SENDER_EMAIL,
        to : user.email,
        subject : "Your otp",
        text : `Your Otp is ${otp}` 
     }
     await transporter.sendMail(mailerOption);
})
export {registerUser,loginUser,logoutUser,refreshAccessToken,currentUser,changePassword,sendVerifyOtp}