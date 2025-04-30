"use client";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white dark:bg-gray-900">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Outer ring with pulse effect */}
        <div className="absolute w-full h-full border-4 border-primary/20 rounded-full animate-ping" />

        {/* Rotating ring */}
        <div className="absolute w-full h-full border-4 border-transparent border-t-primary/40 rounded-full animate-spin" />

        {/* Bouncing dots with fade effect */}
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 bg-primary rounded-full animate-bounce opacity-75"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-4 h-4 bg-primary rounded-full animate-bounce opacity-75"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-4 h-4 bg-primary rounded-full animate-bounce opacity-75"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Glowing effect */}
        <div className="absolute w-full h-full bg-primary/10 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium mb-2 animate-pulse">
          Đang trong quá trình xử lí dữ liệu
        </p>
        <p
          className="text-gray-500 dark:text-gray-500 text-sm animate-pulse"
          style={{ animationDelay: "0.2s" }}
        >
          Vui lòng chờ trong giây lát ...
        </p>
      </div>
    </div>
  );
}
