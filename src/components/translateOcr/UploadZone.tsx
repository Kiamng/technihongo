"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileChange: (file: File | null) => void;
}

export default function UploadZone({ onFileChange }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        onFileChange(file);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"} 
        ${isDragReject ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-3">
        <svg
          className="w-12 h-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <div className="text-gray-700 dark:text-gray-300 font-medium">
          {isDragActive ? (
            <p>Đặt file vào đây...</p>
          ) : (
            <>
              <p>Kéo thả file vào đây, hoặc click để chọn</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hỗ trợ: JPG, JPEG, PNG
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
