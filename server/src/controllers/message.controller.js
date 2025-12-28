import { messageModel } from "../models/message.model.js";
import { conversationModel } from "../models/conversation.model.js";
import customError from "../utils/customError.js";

// Get all messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        const messages = await messageModel
            .find({ chatRoomId: conversationId })
            .populate('senderId', 'userName email')
            .sort({ createdAt: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await messageModel.countDocuments({ chatRoomId: conversationId });
        
        res.status(200).json({
            success: true,
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all conversations for the authenticated user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user;
        
        const conversations = await conversationModel
            .find({ members: userId })
            .populate('members', 'userName email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
        
        res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Create or get existing conversation
export const createConversation = async (req, res) => {
    try {
        const { memberId } = req.body;
        const userId = req.user;
        
        // Check if conversation already exists between these two users
        let conversation = await conversationModel.findOne({
            members: { $all: [userId, memberId] }
        }).populate('members', 'userName email');
        
        // If conversation exists, return it
        if (conversation) {
            return res.status(200).json({
                success: true,
                conversation
            });
        }
        
        // Create new conversation if it doesn't exist
        conversation = await conversationModel.create({
            members: [userId, memberId]
        });
        await conversation.populate('members', 'userName email');
        
        res.status(201).json({
            success: true,
            conversation
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
