// models/ChatMessage.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,  // ✅ Accepts BOTH ObjectId AND String
      required: true,
      default: "anonymous"
    },
    sender: {
      type: String,
      required: true,
      enum: ["user", "bot"],
    },
    text: {
      type: String,
      required: true,
    },
    audioData: {
      type: String,  // Base64 encoded audio
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;