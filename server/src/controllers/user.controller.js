import { authModel } from "../models/user.model.js";
import customError from "../utils/customError.js";

// Get all users except current user
export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user;
        
        const users = await authModel
            .find({ _id: { $ne: currentUserId } })
            .select('userName email createdAt')
            .sort({ userName: 1 });
        
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Search users by username or email
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const currentUserId = req.user;
        
        if (!q) {
            throw new customError("Search query is required", 400);
        }
        
        const users = await authModel
            .find({
                _id: { $ne: currentUserId },
                $or: [
                    { userName: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } }
                ]
            })
            .select('userName email')
            .limit(20);
        
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await authModel
            .findById(id)
            .select('userName email createdAt');
        
        if (!user) {
            throw new customError("User not found", 404);
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
