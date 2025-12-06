import jwt from "jsonwebtoken"
import { authModel } from "../models/user.model.js";
import customError from "../utils/customError.js";


export const verifyToken = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        req.user = decoded._id;

        return next();
    } catch (error) {
        const { refreshToken } = req.cookies;

        if (!refreshToken) return res.status(401).json({ success: "fail", message: "Unauthorized user" });

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            const _id = decoded._id;

            const user = await authModel.findOne({ _id }).select("-password")

            if (!user) throw new customError("User doesn't exists", 401)
                
            if (user.refreshToken !== refreshToken) throw new customError("Invalid refresh token", 403);

            const newToken = user.generateRefreshToken();
            const accessToken = user.generateAccessToken();

            res.cookie("refreshToken", newToken, {
                httpOnly : true,
                sameSite : "lax",
                // secure : true,
                maxAge : 60 * 60 * 1000
            })
            
            
            await user.updateOne({ refreshToken : newToken})
            
            req.data = {
                _id : user._id,
                userName : user.userName,
                email : user.email,
                accessToken : accessToken
            }
            next();
        } catch (error) {
            res.status(error.statusCode || 201).json({success : "fail", message : error.message || "Unauthorized user"})
        } 
    }
}