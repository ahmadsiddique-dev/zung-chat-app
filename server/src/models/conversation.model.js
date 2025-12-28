import { Schema, model } from "mongoose"

const conversationSchema = new Schema({
    members : [{
        type : Schema.Types.ObjectId,
        ref : "Auth"
    }],
    lastMessage : {
        type : Schema.Types.ObjectId,
        ref : "Message"
    }
}, { timestamps: true })

export const conversationModel = model("Conversation", conversationSchema)