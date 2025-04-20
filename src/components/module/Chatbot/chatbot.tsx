"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface ChatbotWidgetProps {
  userId: string;
}

export default function ChatbotWidget({ userId }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState("");

  useEffect(() => {
    if (userId) {
      // Xóa dữ liệu liên quan đến Chatbase
      const chatbaseKey = `chatbase_3AAFkiPZaC0pteozoRTkd_conversation`;

      localStorage.removeItem(chatbaseKey);
      sessionStorage.clear(); // Xóa sessionStorage

      // Tạo userId mới
      const uniqueUserId = `${userId}-${Date.now()}`;

      setChatUserId(uniqueUserId);
      console.log("🔁 Reset chat for:", uniqueUserId);
    } else {
      // Ẩn chatbot nếu không có userId
      setIsOpen(false);
      setChatUserId("");
    }
  }, [userId]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  if (!userId) {
    return null; // Không hiển thị nếu không có userId
  }

  const baseUrl = `https://www.chatbase.co/chatbot-iframe/3AAFkiPZaC0pteozoRTkd?userId=${encodeURIComponent(
    chatUserId,
  )}&t=${Date.now()}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {isOpen && chatUserId && (
        <div className="w-[360px] h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-300">
          <iframe
            key={chatUserId}
            allow="clipboard-write"
            height="100%"
            src={baseUrl}
            style={{ border: "none" }}
            title="Chat hỗ trợ khách hàng"
            width="100%"
          />
        </div>
      )}
      <button
        aria-label="Mở chatbot"
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg"
        onClick={toggleChat}
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
