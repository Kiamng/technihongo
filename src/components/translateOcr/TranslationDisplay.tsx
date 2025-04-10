"use client";

import { useState, useEffect } from "react";

import { Button } from "../ui/button";

interface TranslationDisplayProps {
  japaneseText: string;
  vietnameseText: string;
  onClear: () => void;
  isTranslating: boolean;
}

export default function TranslationDisplay({
  japaneseText,
  vietnameseText,
  onClear,
  isTranslating,
}: TranslationDisplayProps) {
  const [displayedVietText, setDisplayedVietText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Simulate typing effect
  useEffect(() => {
    if (!vietnameseText) return;

    let index = 0;

    setIsTyping(true);

    const typingInterval = setInterval(() => {
      setDisplayedVietText(vietnameseText.substring(0, index));
      index++;

      if (index > vietnameseText.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30); // Speed of typing

    return () => clearInterval(typingInterval);
  }, [vietnameseText]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could show a toast notification here
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary text-center">
        Kết quả dịch
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Text Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">Nội dung từ ảnh</h3>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(japaneseText)}
            >
              Copy
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-inner min-h-40">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {japaneseText}
            </p>
          </div>
        </div>

        {/* Translation Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">Nội dung dịch</h3>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(vietnameseText)}
            >
              Copy
            </Button>
          </div>

          <div className="bg-green-500 bg-opacity-50 dark:bg-secondary rounded-lg p-4 shadow-inner min-h-40">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {displayedVietText}
              {isTranslating && (
                <span className="text-gray-500 dark:text-gray-400">
                  Đang dịch...
                </span>
              )}
              {isTyping && !isTranslating && (
                <span className="inline-block w-2 h-4 bg-primary bg-opacity-50 dark:bg-primary dark:bg-opacity-50 ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button variant={"secondary"} onClick={onClear}>
          Xóa và tải lên mới
        </Button>
      </div>
    </div>
  );
}
