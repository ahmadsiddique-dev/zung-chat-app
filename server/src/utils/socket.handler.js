import { messageModel } from "../models/message.model.js";
import { conversationModel } from "../models/conversation.model.js";
import { socketAuth } from "../middlewares/socketAuth.js";

// Store active users
const activeUsers = new Map(); // userId -> socketId

export const initializeSocket = (io) => {
    // Apply authentication middleware
    io.use(socketAuth);
    
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.userName} (${socket.userId})`);
        
        // Store active user
        activeUsers.set(socket.userId, socket.id);
        
        // Emit user online status to all clients
        io.emit("user_online", { userId: socket.userId, userName: socket.userName });
        
        // Join conversation room
        socket.on("join_conversation", async (conversationId) => {
            try {
                socket.join(conversationId);
                console.log(`User ${socket.userName} joined conversation ${conversationId}`);
            } catch (error) {
                socket.emit("error", { message: "Failed to join conversation" });
            }
        });
        
        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, content } = data;
                
                // Save message to database
                const message = await messageModel.create({
                    chatRoomId: conversationId,
                    senderId: socket.userId,
                    content: content
                });
                
                console.log('✅ Message saved to DB:', message._id);
                
                // Update conversation's last message
                await conversationModel.findByIdAndUpdate(conversationId, {
                    lastMessage: message._id,
                    updatedAt: Date.now()
                });
                
                // Populate sender info
                await message.populate('senderId', 'userName email');
                
                console.log('📤 Broadcasting message to others in room:', conversationId);
                
                // Emit message to OTHER users in the conversation room (not the sender)
                socket.to(conversationId).emit("receive_message", {
                    _id: message._id,
                    conversationId: conversationId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: message.createdAt
                });
                
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });
        
        // Typing indicator start
        socket.on("typing_start", (data) => {
            const { conversationId } = data;
            socket.to(conversationId).emit("user_typing", {
                userId: socket.userId,
                userName: socket.userName,
                conversationId: conversationId
            });
        });
        
        // Typing indicator stop
        socket.on("typing_stop", (data) => {
            const { conversationId } = data;
            socket.to(conversationId).emit("user_stop_typing", {
                userId: socket.userId,
                conversationId: conversationId
            });
        });
        
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userName}`);
            activeUsers.delete(socket.userId);
            
            // Emit user offline status
            io.emit("user_offline", { userId: socket.userId });
        });
    });
};

export { activeUsers };
