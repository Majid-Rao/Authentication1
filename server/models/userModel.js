import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import 'dotenv/config.js'
import { type } from "os";
const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : [true,"Password is required"]
    },
    verifyOtp : {
        type : String,
        default : ''
    },
    verifyOtpExpire : {
        type : Number,
        default : 0
    },
    isAccountVerified : {
        type : Boolean,
        default : false
    },
    resetOtp : {
        type : String,
        default : ''
    },
    resetOtpExpire : {
        type : Number,
        default : 0
    },
    coverImage : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
    }
},
{timestamps:true});

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password,10);
    next;
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
        },
        process.env.ACCESS_TOKENS,
        {
            expiresIn : process.env.EXPIRE_ACCESS_TOKENS,
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKENS,
        {
            expiresIn:process.env.EXPIRE_REFRESH_TOKENS,
        }
    )
}

export const User = mongoose.model("User",userSchema)