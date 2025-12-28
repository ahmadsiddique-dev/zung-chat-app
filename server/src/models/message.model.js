import { Schema, model } from "mongoose"

const messageSchema = new Schema({
    chatRoomId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

export const messageModel = model("Message", messageSchema)