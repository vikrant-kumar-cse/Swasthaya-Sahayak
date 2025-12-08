import React from "react";
import { Routes, Route } from "react-router-dom";

const AIChatbot = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chatbot</h2>
      {/* Your AI Chatbot UI goes here */}
    </div>
  );
};

const WhatsAppChatbot = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>WhatsApp Chatbot</h2>
      {/* Your WhatsApp Chatbot UI goes here */}
    </div>
  );
};

const ChatbotUI = () => {
  return (
    <Routes>
      {/* Default → AI Chatbot */}
      <Route index element={<AIChatbot />} />
      <Route path="whatsapp" element={<WhatsAppChatbot />} />
    </Routes>
  );
};

export default ChatbotUI;
