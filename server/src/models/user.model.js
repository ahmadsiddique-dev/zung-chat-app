import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const authSchema = new Schema({
    userName : {
        type : String,
        required : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String
    }
}, { timestamps : true })

authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



authSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id : this._id,
        userName : this.userName, 
        email : this.email
    },
    process.env.ACCESS_TOKEN_SECRET
    , {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}


authSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET
    , {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}

authSchema.methods.verifyPassword = async function(password) {
   return await bcrypt.compare(password, this.password);
}

export const authModel = model("Auth", authSchema);