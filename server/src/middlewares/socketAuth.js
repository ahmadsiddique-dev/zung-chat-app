import jwt from "jsonwebtoken";
import customError from "../utils/customError.js";

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            throw new customError("Authentication token missing", 401);
        }
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.userId = decoded._id;
        socket.userName = decoded.userName;
        
        next();
    } catch (error) {
        next(new Error("Unauthorized"));
    }
};
