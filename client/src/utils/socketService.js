import { io } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }
    
    connect(accessToken) {
        if (this.socket && this.isConnected) {
            console.log("Socket already connected");
            return this.socket;
        }
        
        this.socket = io(import.meta.env.VITE_B_API, {
            auth: {
                token: accessToken
            },
            withCredentials: true
        });
        
        this.socket.on("connect", () => {
            this.isConnected = true;
            console.log("Connected to Socket.IO server");
        });
        
        this.socket.on("disconnect", () => {
            this.isConnected = false;
            console.log("Disconnected from Socket.IO server");
        });
        
        this.socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
        
        this.socket.on("connect_error", (error) => {
            console.error("Socket connection failed:", error.message);
            // Authentication might have failed or server is unreachable
        });
        
        return this.socket;
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    
    // Join a conversation room
    joinConversation(conversationId) {
        if (this.socket) {
            this.socket.emit("join_conversation", conversationId);
        }
    }
    
    // Send a message
    sendMessage(conversationId, content) {
        if (this.socket) {
            this.socket.emit("send_message", { conversationId, content });
        }
    }
    
    // Start typing indicator
    startTyping(conversationId) {
        if (this.socket) {
            this.socket.emit("typing_start", { conversationId });
        }
    }
    
    // Stop typing indicator
    stopTyping(conversationId) {
        if (this.socket) {
            this.socket.emit("typing_stop", { conversationId });
        }
    }
    
    // Listen for incoming messages
    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on("receive_message", callback);
        }
    }
    
    // Listen for typing indicators
    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on("user_typing", callback);
        }
    }
    
    onUserStopTyping(callback) {
        if (this.socket) {
            this.socket.on("user_stop_typing", callback);
        }
    }
    
    // Listen for user online/offline status
    onUserOnline(callback) {
        if (this.socket) {
            this.socket.on("user_online", callback);
        }
    }
    
    onUserOffline(callback) {
        if (this.socket) {
            this.socket.on("user_offline", callback);
        }
    }
    
    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

export default new SocketService();
