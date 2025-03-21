"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { Progress } from "@/components/ui/progress";

export default function LoadingPage() {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);

          return 100;
        }

        return Math.min(oldProgress + 10, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white overflow-hidden">
      {/* Hiệu ứng nền sáng tạo: sóng xanh lá */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 animate-wave" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-200 to-transparent animate-pulse-slow" />

      {/* Tiêu đề */}
      <h1 className="relative z-10 mb-8 animate-bounce text-3xl font-bold text-green-600 drop-shadow-md">
        こんにちは
      </h1>

      {/* Container ảnh */}
      <div className="relative z-10">
        <Image
          alt="Loading Image"
          className={`transition-all duration-500 ${
            isLoading ? "animate-spin-slow" : "animate-pulse opacity-70"
          }`}
          height={250}
          src="/assets/loading-image.png"
          width={250}
        />
        <div className="absolute inset-0 -m-4 animate-spin rounded-full border-4 border-dashed border-green-300" />
        {/* Hiệu ứng ánh sáng xung quanh ảnh */}
        <div className="absolute inset-0 -m-6 rounded-full bg-green-200 opacity-20 animate-glow" />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-12 w-80">
        <Progress
          className="h-6 rounded-full bg-green-50/50 backdrop-blur-sm"
          value={progress}
        />
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-green-100 to-transparent" />
      </div>
      <span className="relative z-10 mt-2 text-lg font-semibold text-green-600 drop-shadow">
        {progress}%
      </span>

      {/* Hạt ánh sáng sáng tạo thay confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              backgroundColor: `rgba(34, 197, 94, ${Math.random() * 0.5 + 0.2})`, // Xanh lá nhạt
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
