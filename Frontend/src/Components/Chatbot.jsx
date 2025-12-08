import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, User, Send, MessageCircle, Mic, Image, Menu, StopCircle, Volume2, VolumeX, Trash2, Clock, X } from "lucide-react";

// ============ API Helper Functions ============
const API_BASE_URL = 'http://localhost:5000';
const NODE_API_URL = 'http://localhost:8080/api';

const getAuthToken = () => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Format date helper
const formatDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return `Today ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
};

// Navbar Component
const ChatbotNavbar = ({ userName }) => (
  <nav className="fixed top-0 left-0 right-0 h-[10vh] bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white flex items-center justify-between px-6 shadow-lg z-30">
    <div className="flex items-center gap-3">
      <MessageCircle size={28} />
      <h1 className="text-2xl font-bold">MedPulse AI</h1>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 hover:bg-white/20 rounded-full transition">
        <Search size={20} />
      </button>
      <div className="flex items-center gap-2">
        <User size={20} />
        <span className="text-sm font-semibold">{userName}</span>
      </div>
    </div>
  </nav>
);

// Sidebar Component
const ChatSidebar = ({ isSidebarOpen, isMobile, sessions, currentSessionId, onSessionSelect, onNewChat, onDeleteSession }) => (
  <div
    className={`${
      isMobile
        ? `fixed top-[10vh] left-0 h-[90vh] w-64 bg-white shadow-2xl transform transition-transform z-30 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`
        : "w-64 bg-white shadow-lg"
    }`}
  >
    <div className="p-4 border-b-2 border-[#00acc1]">
      <button 
        onClick={onNewChat}
        className="w-full bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
      >
        <Plus size={18} /> New Chat
      </button>
    </div>

    <div className="p-4 overflow-y-auto h-[calc(90vh-80px)]">
      <h6 className="text-xs font-bold text-gray-500 mb-2 uppercase">Chat History</h6>
      {sessions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mt-4">No previous chats</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.sessionId}
            onClick={() => onSessionSelect(session.sessionId)}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition text-sm relative group ${
              currentSessionId === session.sessionId
                ? "bg-[#00acc1] text-white"
                : "bg-[#e0f7fa] hover:bg-[#b2ebf2]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{session.preview}</p>
                <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                  <Clock size={12} />
                  <span>{formatDate(session.lastMessage)}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.sessionId);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [userName, setUserName] = useState("User");
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  
  // Image Upload States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load user info
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || "User");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Load all chat sessions on mount
  useEffect(() => {
    loadAllSessions();
  }, []);

  // Load messages when session changes - FIXED
  useEffect(() => {
    if (currentSessionId) {
      // Clear messages first to prevent old messages showing
      setMessages([]);
      
      // Then load new session messages
      loadMessagesForSession(currentSessionId);
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load all chat sessions
  const loadAllSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.log("No userId found");
        setIsLoadingHistory(false);
        return;
      }

      const response = await fetch(`${NODE_API_URL}/chat/chat-history-public?userId=${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success && data.messages) {
        // Group messages by sessionId
        const sessionMap = {};
        
        data.messages.forEach(msg => {
          if (!sessionMap[msg.sessionId]) {
            sessionMap[msg.sessionId] = {
              sessionId: msg.sessionId,
              messages: [],
              lastMessage: msg.createdAt
            };
          }
          sessionMap[msg.sessionId].messages.push(msg);
          
          // Update last message time
          if (new Date(msg.createdAt) > new Date(sessionMap[msg.sessionId].lastMessage)) {
            sessionMap[msg.sessionId].lastMessage = msg.createdAt;
          }
        });

        // Convert to array and create previews
        const sessionsArray = Object.values(sessionMap).map(session => {
          const firstUserMsg = session.messages.find(m => m.sender === 'user');
          return {
            sessionId: session.sessionId,
            preview: firstUserMsg ? firstUserMsg.text.substring(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '') : 'New Chat',
            lastMessage: session.lastMessage,
            messageCount: session.messages.length
          };
        });

        // Sort by last message (newest first)
        sessionsArray.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));

        setSessions(sessionsArray);

        // Load last active session or create new one
        const lastSessionId = localStorage.getItem('currentSessionId');
        if (lastSessionId && sessionsArray.find(s => s.sessionId === lastSessionId)) {
          setCurrentSessionId(lastSessionId);
        } else if (sessionsArray.length > 0) {
          setCurrentSessionId(sessionsArray[0].sessionId);
        } else {
          createNewSession();
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load messages for specific session - FIXED
  const loadMessagesForSession = async (sessionId) => {
    try {
      // Don't load messages for brand new sessions (they won't exist in DB yet)
      if (sessionId.includes(Date.now().toString().slice(0, -3))) {
        setMessages([]);
        return;
      }
      
      const response = await fetch(`${NODE_API_URL}/chat/chat-history-public?sessionId=${sessionId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success && data.messages && data.messages.length > 0) {
        const formattedMessages = data.messages.map(msg => ({
          sender: msg.sender,
          text: msg.text,
          audioData: msg.audioData || null,
          image: msg.image || null,
          isLoadingAudio: false,
          createdAt: msg.createdAt
        }));
        
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  // Create new chat session - FIXED
  const createNewSession = () => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const newSessionId = `session_${userId}_${Date.now()}`;
    
    // IMPORTANT: Clear messages FIRST before changing session
    setMessages([]);
    
    // Then update session ID
    setCurrentSessionId(newSessionId);
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('currentSessionId', newSessionId);
    
    // Clear any selected images
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle session selection
  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId);
    localStorage.setItem('sessionId', sessionId);
    
    // Close sidebar on mobile after selection
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const response = await fetch(`${NODE_API_URL}/chat/clear-history-public`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from sessions list
        setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        
        // If deleted session was active, switch to another or create new
        if (currentSessionId === sessionId) {
          const remainingSessions = sessions.filter(s => s.sessionId !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSessionId(remainingSessions[0].sessionId);
          } else {
            createNewSession();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete chat');
    }
  };

  // Image Handling Functions
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Initialize Audio Recording
  const initAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioToServer(audioBlob);
        audioChunksRef.current = [];
      };
      
      return true;
    } catch (error) {
      alert('Microphone access denied. Please enable microphone permissions.');
      console.error('Microphone error:', error);
      return false;
    }
  };

  const handleVoiceClick = async () => {
    if (!mediaRecorderRef.current) {
      const initialized = await initAudioRecording();
      if (!initialized) return;
    }
    
    if (!isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToServer = (audioBlob) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Audio = e.target.result.split(',')[1];
      
      try {
        const sttResponse = await fetch(`${API_BASE_URL}/speech-to-text`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ audio: base64Audio })
        });
        
        const sttData = await sttResponse.json();
        setIsProcessing(false);
        
        if (sttData.text) {
          setInput(sttData.text);
          inputRef.current?.focus();
        } else {
          alert('❌ Failed to transcribe audio');
        }
      } catch (error) {
        setIsProcessing(false);
        console.error('Error:', error);
        alert('❌ Error processing audio');
      }
    };
    reader.readAsDataURL(audioBlob);
  };

  const sendMessageToChatbot = async (messageText, imageData = null) => {
    if (!messageText.trim() && !imageData) return;

    try {
      let response, data;

      // If image is present, use /image-chat endpoint with FormData
      if (imageData) {
        // Convert base64 to blob
        const base64Response = await fetch(imageData);
        const blob = await base64Response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');
        formData.append('msg', messageText || 'What can you tell me about this image?');
        formData.append('session_id', currentSessionId); // Add session ID
        
        const token = getAuthToken();
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        response = await fetch(`${API_BASE_URL}/image-chat`, {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: formData
        });
        
        data = await response.json();
        
        if (data.answer && data.answer.trim()) {
          const botMessage = {
            sender: "bot", 
            text: data.answer,
            audioData: null,
            image: null,
            isLoadingAudio: false,
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, botMessage]);
          
          // Manually save messages to Node.js for history
          try {
            await fetch(`${NODE_API_URL}/chat/save-message-public`, {
              method: 'POST',
              headers: getAuthHeaders(),
              credentials: 'include',
              body: JSON.stringify({
                sender: 'bot',
                text: data.answer,
                sessionId: currentSessionId
              })
            });
          } catch (err) {
            console.warn('Failed to save bot message to history:', err);
          }
          
          loadAllSessions();
        } else {
          setMessages(prev => [...prev, { sender: "error", text: "❌ No response received from image analysis" }]);
        }
      } else {
        // Regular text message - use /get endpoint
        response = await fetch(`${API_BASE_URL}/get`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ 
            msg: messageText,
            session_id: currentSessionId
          })
        });
        
        data = await response.json();
        
        if (data.answer && data.answer.trim()) {
          const botMessage = {
            sender: "bot", 
            text: data.answer,
            audioData: null,
            image: null,
            isLoadingAudio: false,
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, botMessage]);
          loadAllSessions();
        } else {
          setMessages(prev => [...prev, { sender: "error", text: "❌ No response received" }]);
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        sender: "error", 
        text: `❌ Error: ${error.message || 'Failed to connect to server'}` 
      }]);
    }
  };

  const playAudio = async (messageIndex) => {
    const message = messages[messageIndex];
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setPlayingAudioIndex(null);
    }

    if (playingAudioIndex === messageIndex) {
      return;
    }

    if (message.audioData) {
      const audio = new Audio(`data:audio/wav;base64,${message.audioData}`);
      currentAudioRef.current = audio;
      setPlayingAudioIndex(messageIndex);
      
      audio.onended = () => {
        setPlayingAudioIndex(null);
        currentAudioRef.current = null;
      };
      
      audio.play().catch(err => console.warn('Audio playback failed:', err));
      return;
    }

    try {
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, isLoadingAudio: true } : msg
      ));

      const ttsResponse = await fetch(`${API_BASE_URL}/text-to-speech`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ text: message.text })
      });
      
      const ttsData = await ttsResponse.json();
      
      if (ttsData.audio) {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex ? { ...msg, audioData: ttsData.audio, isLoadingAudio: false } : msg
        ));

        const audio = new Audio(`data:audio/wav;base64,${ttsData.audio}`);
        currentAudioRef.current = audio;
        setPlayingAudioIndex(messageIndex);
        
        audio.onended = () => {
          setPlayingAudioIndex(null);
          currentAudioRef.current = null;
        };
        
        audio.play().catch(err => console.warn('Audio playback failed:', err));
      } else {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex ? { ...msg, isLoadingAudio: false } : msg
        ));
      }
    } catch (ttsError) {
      console.warn('TTS failed:', ttsError);
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, isLoadingAudio: false } : msg
      ));
    }
  };

  const sendMessage = () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = {
      sender: "user",
      text: input || (selectedImage ? "📷 Sent an image" : ""),
      image: imagePreview,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    const imageData = imagePreview;
    
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    sendMessageToChatbot(messageText, imageData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingHistory) {
    return (
      <div className="fixed inset-0 bg-[#e0f7fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00acc1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#00796b] font-semibold">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#e0f7fa] overflow-hidden font-sans">
      <ChatbotNavbar userName={userName} />

      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-[14vh] left-4 z-50 bg-[#00acc1] text-white p-3 rounded-full shadow-lg md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      <div className="flex h-[90vh] mt-[10vh] transition-all bg-[#e0f7fa]">
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={createNewSession}
          onDeleteSession={handleDeleteSession}
        />

        <div style={{ margin: "10px 20px" }} className="flex-1 flex flex-col bg-white rounded-lg shadow-lg">
          <div className="flex-1 p-5 overflow-y-auto flex flex-col">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                <MessageCircle size={48} className="mx-auto mb-4" />
                <h5 className="text-lg font-semibold">Welcome to MedPulse!</h5>
                <p>Start a conversation by typing a message, uploading an image, or using voice...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] p-3 rounded-xl shadow mb-4 text-sm flex items-start gap-2 ${
                    msg.sender === "user"
                      ? "self-end bg-[#00acc1] text-white flex-row-reverse"
                      : msg.sender === "bot"
                      ? "self-start bg-[#e0f7fa] text-[#00796b]"
                      : msg.sender === "system"
                      ? "self-center bg-yellow-100 text-yellow-800"
                      : "self-center bg-red-100 text-red-800"
                  }`}
                >
                  <div className="flex-1">
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Uploaded" 
                        className="max-w-full rounded-lg mb-2 max-h-64 object-contain cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(msg.image, '_blank')}
                      />
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                  
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => playAudio(index)}
                      disabled={msg.isLoadingAudio}
                      className="flex-shrink-0 p-1 hover:bg-[#b2ebf2] rounded-full transition disabled:opacity-50"
                      title={playingAudioIndex === index ? "Stop Audio" : "Play Audio"}
                    >
                      {msg.isLoadingAudio ? (
                        <div className="w-5 h-5 border-2 border-[#00796b] border-t-transparent rounded-full animate-spin"></div>
                      ) : playingAudioIndex === index ? (
                        <VolumeX size={18} className="text-[#00796b]" />
                      ) : (
                        <Volume2 size={18} className="text-[#00796b]" />
                      )}
                    </button>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t-4 border-[#00acc1]">
            {isProcessing && (
              <div className="text-center mb-2 text-sm text-gray-600">
                <span className="inline-block animate-pulse">🎤 Transcribing audio...</span>
              </div>
            )}
            
            {imagePreview && (
              <div className="mb-3 relative inline-block bg-gray-100 rounded-lg p-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-32 rounded-lg border-2 border-[#00acc1]"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  {selectedImage?.name || 'Image selected'}
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleVoiceClick}
                disabled={isProcessing}
                className={`p-2 rounded-full transition-all flex-shrink-0 ${
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "text-[#00acc1] hover:bg-[#e0f7fa]"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#00acc1] hover:bg-[#e0f7fa] rounded-full transition flex-shrink-0"
                title="Upload Image"
              >
                <Image size={20} />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MedPulse anything..."
                className="flex-1 bg-[#e0f7fa] border border-[#00acc1] rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#00acc1]"
                disabled={isProcessing}
              />

              <button
                onClick={sendMessage}
                disabled={isProcessing || (!input.trim() && !selectedImage)}
                className="ml-2 bg-gradient-to-br from-[#00acc1] to-[#00796b] text-white px-4 py-3 rounded-lg font-bold shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Chatbot;