"use client";

import { useState, useEffect } from "react";

interface TranslationDisplayProps {
  japaneseText: string;
  vietnameseText: string;
  onClear: () => void;
}

export default function TranslationDisplay({
  japaneseText,
  vietnameseText,
  onClear,
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
      <h2 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-4">
        Translation Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Text Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Original Japanese
            </h3>
            <button
              className="text-blue-600 dark:text-blue-400 text-xs hover:text-blue-800 dark:hover:text-blue-300"
              onClick={() => copyToClipboard(japaneseText)}
            >
              Copy
            </button>
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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vietnamese Translation
            </h3>
            <button
              className="text-blue-600 dark:text-blue-400 text-xs hover:text-blue-800 dark:hover:text-blue-300"
              disabled={isTyping}
              onClick={() => copyToClipboard(vietnameseText)}
            >
              Copy
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-inner min-h-40">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {displayedVietText}
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-blue-600 dark:bg-blue-400 ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={onClear}
        >
          Clear & Upload New
        </button>
      </div>
    </div>
  );
}
