import { Schema, model } from "mongoose"

const messageSchema = new Schema({
    chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

export const messageModel = model("Message", messageSchema)