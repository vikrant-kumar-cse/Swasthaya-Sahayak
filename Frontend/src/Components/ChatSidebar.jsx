// ChatSidebar.jsx
import React from "react";
import { Search, Plus } from "react-feather";

const ChatSidebar = ({ isSidebarOpen, isMobile, chatHistory }) => {
  return (
    <div
      className={`
        fixed md:static left-0 z-40 h-full w-64 md:w-1/5
        transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isMobile ? "mt-[10vh]" : ""}
      `}
      style={{ background: "linear-gradient(135deg, #00acc1, #00796b)" }}
    >
      <div className="flex flex-col h-full p-4">
        <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg shadow mb-4 flex items-center justify-center">
          <Plus size={16} className="mr-2" /> New Chat
        </button>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input
            type="text"
            placeholder="Search chat..."
            className="w-full bg-white/80 pl-10 py-2 rounded-lg text-sm outline-none"
          />
        </div>

        <h6 className="font-bold mb-2 text-[#e0f7fa]">Chat History</h6>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {chatHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white/20 px-3 py-2 rounded-lg cursor-pointer text-sm hover:bg-white/30"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
