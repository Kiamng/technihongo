"use client";

import { useState } from "react";

import ThemeToggler from "./darkMode";
import UploadZone from "./UploadZone";
import OCRPreview from "./OCRPreview ";
import LoadingAnimation from "./LoadingAnimation";
import TranslationDisplay from "./TranslationDisplay";

export default function OCRTranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Example mocked data
  const mockJapaneseText =
    "プログラミングを学ぶことは、新しい言語を学ぶことと似ています。基本的な文法、構文、そして論理的な思考方法を理解する必要があります。始めるのに最適な言語は、あなたの目標によって異なります。ウェブ開発に興味があるなら、JavaScriptが良いでしょう。";
  const mockVietnameseText =
    "Học lập trình giống như học một ngôn ngữ mới. Bạn cần hiểu ngữ pháp cơ bản, cú pháp và cách tư duy logic. Ngôn ngữ tốt nhất để bắt đầu phụ thuộc vào mục tiêu của bạn. Nếu bạn quan tâm đến phát triển web, JavaScript là một lựa chọn tốt.";

  const handleFileChange = (uploadedFile: File | null) => {
    setFile(uploadedFile);

    if (uploadedFile) {
      // Create preview URL for images
      if (uploadedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(uploadedFile);

        setPreviewUrl(url);
      } else {
        // For PDFs, we don't create previews, just show the icon
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleScanTranslate = () => {
    if (!file) return;

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 2500);
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <ThemeToggler />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Japanese OCR Translation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload an image or PDF with Japanese text to translate to Vietnamese
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 transition-colors duration-200">
          <UploadZone onFileChange={handleFileChange} />

          {file && (
            <div className="mt-6">
              <OCRPreview file={file} previewUrl={previewUrl} />

              <div className="mt-6 flex justify-center">
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isProcessing}
                  onClick={handleScanTranslate}
                >
                  {isProcessing ? "Processing..." : "Scan & Translate"}
                </button>
              </div>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-200">
            <LoadingAnimation />
          </div>
        )}

        {showResults && !isProcessing && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-200">
            <TranslationDisplay
              japaneseText={mockJapaneseText}
              vietnameseText={mockVietnameseText}
              onClear={handleClear}
            />
          </div>
        )}
      </div>
    </div>
  );
}
