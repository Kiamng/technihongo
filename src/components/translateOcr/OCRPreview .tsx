"use client";

interface OCRPreviewProps {
  file: File;
  previewUrl: string | null;
}

export default function OCRPreview({ file, previewUrl }: OCRPreviewProps) {
  const isPDF = file.type === "application/pdf";

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-sm">
        <div className="flex items-center space-x-4">
          {isPDF ? (
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
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
            <div className="h-20 w-20 rounded-lg overflow-hidden">
              <img
                alt="Preview"
                className="h-full w-full object-cover"
                src={previewUrl}
              />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(file.size / 1024).toFixed(1)} KB · {file.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
