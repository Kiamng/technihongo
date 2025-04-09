"use client";

import { useEffect, useState, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

export default function TextHighlighterWithTranslate() {
  const [selectedText, setSelectedText] = useState("");
  const [translation, setTranslation] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    if (text.length > 0) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      setSelectedText(text);
      setPosition({
        x: rect?.right || window.innerWidth / 2,
        y: (rect?.bottom || 0) + window.scrollY,
      });
      setShowPopup(true);
      setTranslation("");
    }
  };

  const handleTranslate = async () => {
    if (!selectedText) return;

    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi dịch văn bản");
      }

      setTranslation(data.translation);
    } catch (error) {
      console.error("Lỗi:", error);
      setTranslation(
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Đã xảy ra lỗi khi dịch",
      );
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!showPopup) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: `${position.y + 10}px`,
        left: `${Math.max(10, position.x - 100)}px`,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <button
        disabled={isTranslating}
        style={{
          padding: "8px 16px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          opacity: isTranslating ? 0.7 : 1,
        }}
        onClick={handleTranslate}
      >
        {isTranslating ? "Đang dịch..." : "Translate"}
      </button>

      {translation && (
        <div
          style={{
            padding: "12px",
            background: "#fff",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
            maxWidth: "300px",
            wordBreak: "break-word",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Kết quả:</p>
          <p style={{ margin: 0 }}>{translation}</p>
        </div>
      )}
    </div>
  );
}
