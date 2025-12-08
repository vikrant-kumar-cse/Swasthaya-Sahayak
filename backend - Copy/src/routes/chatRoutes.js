import express from "express";
import jwt from "jsonwebtoken";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// ✅ NEW: Middleware to extract userId from token
const extractUserIdFromToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.userId = decoded.id;  // ✅ Extract user ID from token
      console.log('🔐 Authenticated User ID:', req.userId);
    } catch (error) {
      console.log('⚠️ Invalid token, using anonymous');
      req.userId = "anonymous";
    }
  } else {
    console.log('⚠️ No token provided, using anonymous');
    req.userId = "anonymous";
  }
  
  next();
};

// ✅ UPDATED: Added middleware
router.post("/save-message-public", extractUserIdFromToken, async (req, res) => {
  console.log("\n========== SAVE MESSAGE (PUBLIC) REQUEST ==========");
  console.log("📍 Endpoint Hit: POST /api/chat/save-message-public");
  console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { sender, text, audioData, sessionId } = req.body;
    const userId = req.userId;  // ✅ Get from middleware (token or "anonymous")

    // Validation
    if (!sender || !text) {
      console.log("❌ Validation Failed: Missing sender or text");
      return res.status(400).json({ 
        success: false, 
        error: "Sender and text are required" 
      });
    }

    console.log("✅ Validation Passed");
    console.log("📝 Creating message object...");

    const message = new ChatMessage({
      userId,  // ✅ From token or "anonymous"
      sender,
      text,
      audioData: audioData || null,
      sessionId: sessionId || Date.now().toString(),
    });

    console.log("💾 Attempting to save to database...");
    console.log("Message data:", {
      userId: message.userId,
      sender: message.sender,
      textLength: message.text.length,
      hasAudio: !!message.audioData,
      sessionId: message.sessionId
    });
    
    const savedMessage = await message.save();
    
    console.log("✅ Message saved successfully!");
    console.log("🆔 Saved Message ID:", savedMessage._id);
    console.log("========================================\n");
    
    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("❌ SAVE MESSAGE ERROR:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) console.error("Stack:", error.stack);
    console.log("========================================\n");
    
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ UPDATED: Added middleware
router.get("/chat-history-public", extractUserIdFromToken, async (req, res) => {
  console.log("\n========== GET CHAT HISTORY (PUBLIC) REQUEST ==========");
  console.log("📍 Endpoint Hit: GET /api/chat/chat-history-public");
  console.log("🔍 Query Params:", req.query);
  
  try {
    const { limit = 100, sessionId } = req.query;
    const userId = req.userId;  // ✅ From token or "anonymous"

    // Build query
    let query = {};
    
    if (sessionId) {
      query.sessionId = sessionId;
    } else {
      query.userId = userId;  // ✅ Get all messages for this user
    }

    console.log("🔎 Database Query:", query);
    console.log("📊 Limit:", limit);
    console.log("👤 User ID:", userId);
    
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));

    console.log("✅ Messages Retrieved:", messages.length);
    
    if (messages.length > 0) {
      console.log("📝 First message:", {
        id: messages[0]._id,
        sender: messages[0].sender,
        text: messages[0].text.substring(0, 50) + "...",
        createdAt: messages[0].createdAt
      });
      console.log("📝 Last message:", {
        id: messages[messages.length - 1]._id,
        sender: messages[messages.length - 1].sender,
        text: messages[messages.length - 1].text.substring(0, 50) + "...",
        createdAt: messages[messages.length - 1].createdAt
      });
    }
    
    console.log("========================================\n");
    
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ GET HISTORY ERROR:", error.message);
    console.log("========================================\n");
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ UPDATED: Added middleware
router.delete("/clear-history-public", extractUserIdFromToken, async (req, res) => {
  console.log("\n========== CLEAR HISTORY (PUBLIC) REQUEST ==========");
  console.log("📍 Endpoint Hit: DELETE /api/chat/clear-history-public");
  console.log("📦 Request Body:", req.body);
  
  try {
    const { sessionId } = req.body;
    const userId = req.userId;  // ✅ From token

    let query = {};
    
    if (sessionId) {
      query = { sessionId, userId };  // ✅ Verify ownership
      console.log("🗑️ Deleting messages for specific session:", sessionId);
    } else {
      query.userId = userId;
      console.log("🗑️ Deleting ALL messages for user:", userId);
    }

    console.log("🔎 Delete Query:", query);
    
    const result = await ChatMessage.deleteMany(query);
    
    console.log("✅ Deleted Count:", result.deletedCount);
    console.log("========================================\n");
    
    res.status(200).json({ 
      success: true, 
      message: "History cleared",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("❌ CLEAR HISTORY ERROR:", error.message);
    console.log("========================================\n");
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ UPDATED: Added middleware
router.get("/stats-public", extractUserIdFromToken, async (req, res) => {
  console.log("\n========== GET STATS (PUBLIC) REQUEST ==========");
  console.log("🔍 Query Params:", req.query);
  
  try {
    const { sessionId } = req.query;
    const userId = req.userId;  // ✅ From token
    
    let query = {};
    if (sessionId) {
      query = { sessionId, userId };
    } else {
      query.userId = userId;
    }
    
    // Get all stats in parallel
    const [totalMessages, userMessages, botMessages, sessionsCount, recentMessages] = await Promise.all([
      ChatMessage.countDocuments(query),
      ChatMessage.countDocuments({ ...query, sender: "user" }),
      ChatMessage.countDocuments({ ...query, sender: "bot" }),
      ChatMessage.distinct("sessionId", query),
      ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .select('text sender createdAt')
    ]);
    
    const avgMessagesPerSession = sessionsCount.length > 0 
      ? (totalMessages / sessionsCount.length).toFixed(2) 
      : 0;
    
    const stats = {
      totalMessages,
      userMessages,
      botMessages,
      totalSessions: sessionsCount.length,
      avgMessagesPerSession: parseFloat(avgMessagesPerSession),
      recentActivity: recentMessages.map(m => ({
        text: m.text.substring(0, 50) + (m.text.length > 50 ? "..." : ""),
        sender: m.sender,
        createdAt: m.createdAt
      }))
    };
    
    console.log("✅ Stats Retrieved:");
    console.log(`   Total Messages: ${stats.totalMessages}`);
    console.log(`   User Messages: ${stats.userMessages}`);
    console.log(`   Bot Messages: ${stats.botMessages}`);
    console.log(`   Total Sessions: ${stats.totalSessions}`);
    console.log("========================================\n");
    
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("❌ GET STATS ERROR:", error.message);
    console.log("========================================\n");
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;