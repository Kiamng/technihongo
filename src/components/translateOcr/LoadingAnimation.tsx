"use client";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex items-center space-x-2 mb-4">
        <div
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        Đang xử lí dữ liệu của bạn ...
      </p>
      <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
        Đang quét và dịch dữ liệu ...
      </p>
    </div>
  );
}
