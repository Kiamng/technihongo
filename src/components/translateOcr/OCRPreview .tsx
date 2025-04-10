"use client";

interface OCRPreviewProps {
  file: File;
  previewUrl: string | null;
}

export default function OCRPreview({ file, previewUrl }: OCRPreviewProps) {
  const isPDF = file.type === "application/pdf";

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg w-full max-w-2xl">
        {isPDF ? (
          <div className="flex items-center justify-center bg-red-100 dark:bg-red-900/30 p-6 rounded-lg">
            <svg
              className="w-16 h-16 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        ) : previewUrl ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            <img
              alt="Preview"
              className="w-full h-full object-contain"
              src={previewUrl}
            />
          </div>
        ) : null}

        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {file.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(file.size / 1024).toFixed(1)} KB · {file.type}
          </p>
        </div>
      </div>
    </div>
  );
}
