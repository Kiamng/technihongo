// src/app/(platform)/quiz/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error | undefined;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="error-container">
      <h1>Đã có lỗi xảy ra</h1>
      <p>{error?.message || "Không thể tải dữ liệu quiz."}</p>
      <button onClick={reset}>Thử lại</button>
    </div>
  );
}
