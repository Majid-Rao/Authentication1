import mongoose from "mongoose";
import {User} from "../models/userModel.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { validateTokens } from "../middlewares/authMiddleware.js";

const userData = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(!user) throw new ApiError(400,"user not found!");
    return res.status(200).json(
        new ApiResponse(201,{
            fullName : user.fullName,
            email : user.email,
            isAccountVerified : user.isAccountVerified,
            coveImage : user.coverImage.url
        },
    "Data Fetched!"
    )
    )
})
export {userData};