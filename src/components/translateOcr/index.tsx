"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { toast } from "sonner";
import { ImageUp, ScanText } from "lucide-react";

import { Button } from "../ui/button";

import UploadZone from "./UploadZone";
import OCRPreview from "./OCRPreview ";
import LoadingAnimation from "./LoadingAnimation";
import TranslationDisplay from "./TranslationDisplay";

import { isMostlyJapaneseParagraph } from "@/lib/validation/japanese";

// Fix import paths (removed extra spaces and corrected components)

export default function OCRTranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [translateText, setTranslateText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [scanMessage, setScanMessage] = useState<string>("");

  const handleFileChange = (uploadedFile: File | null) => {
    if (uploadedFile) {
      if (uploadedFile.type.startsWith("image/")) {
        setFile(uploadedFile);

        const url = URL.createObjectURL(uploadedFile);

        setPreviewUrl(url);
      } else {
        toast.error("Hãy tải lên 1 file ảnh!");
        setFile(null);
        setPreviewUrl(null);
      }
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleOCR = async () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const imageUrl = reader.result as string;

      const {
        data: { text },
      } = await Tesseract.recognize(imageUrl, "jpn");

      // Validate nếu hầu hết là tiếng Nhật (>80%)
      const isValid = isMostlyJapaneseParagraph(text, 0.8);

      if (!isValid) {
        setScanMessage(
          "Nội dung của ảnh hầu như không phải là tiếng Nhật, vui lòng chọn ảnh khác và thử lại",
        );
        setOcrText("");
        setShowResults(false);

        return;
      }

      setOcrText(text);
      setShowResults(true);
    };

    reader.readAsDataURL(file);
  };

  const handleTranslate = async () => {
    if (!ocrText) return;
    setIsTranslating(true);
    // console.log("ocrText to translate:", ocrText);

    try {
      const response = await fetch("/api/ai-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseText = await response.text();

      // console.log("Translation Response:", responseText);

      if (!responseText) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(responseText);

      setTranslateText(data.translation);
      setIsTranslating(false);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslateText("Lỗi khi dịch văn bản. Vui lòng thử lại.");
      setIsTranslating(false);
    }
  };

  const handleScanTranslate = async () => {
    setIsProcessing(true);

    await handleOCR();

    setIsProcessing(false);
  };

  const handleClear = () => {
    setFile(null);
    setScanMessage("");
    setPreviewUrl(null);
    setOcrText("");
    setTranslateText("");
    setShowResults(false);
  };

  useEffect(() => {
    if (ocrText) {
      handleTranslate();
    }
  }, [ocrText]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dịch tài liệu IT tiếng nhật
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tải lên ảnh tài liệu IT tiếng nhật để dịch sang tiếng việt
          </p>
        </div>

        <div className="bg-white dark:bg-black shadow-md rounded-lg p-6 mb-8">
          {file ? (
            <div className="mt-6">
              <OCRPreview
                file={file}
                handleClear={handleClear}
                previewUrl={previewUrl}
                scanMessage={scanMessage}
              />

              {!showResults && !scanMessage && (
                <div className="mt-6 flex justify-center flex-row space-x-4">
                  <Button
                    className="hover:scale-105 transition-all duration-300 flex space-x-1"
                    disabled={isProcessing}
                    onClick={handleScanTranslate}
                  >
                    {isProcessing ? (
                      "Đang xử lí..."
                    ) : (
                      <>
                        <span>OCR và dịch</span> <ScanText />
                      </>
                    )}
                  </Button>
                  <Button
                    className="hover:scale-105 transition-all duration-300 flex space-x-1"
                    disabled={isProcessing}
                    variant={"outline"}
                    onClick={handleClear}
                  >
                    <span>Thử ảnh khác</span> <ImageUp />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <UploadZone onFileChange={handleFileChange} />
          )}
        </div>

        {isProcessing && (
          <div className="bg-white dark:bg-black shadow-md rounded-lg p-6">
            <LoadingAnimation />
          </div>
        )}

        {showResults && !isProcessing && (
          <div className="bg-white dark:bg-black shadow-md rounded-lg p-6">
            <TranslationDisplay
              isTranslating={isTranslating}
              japaneseText={ocrText}
              vietnameseText={translateText}
              onClear={handleClear}
            />
          </div>
        )}
      </div>
    </div>
  );
}
