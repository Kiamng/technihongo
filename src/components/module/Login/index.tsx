"use client";
import { useState } from "react";

import LoginForm from "./login-form";
import LoginIntroduction from "./login-introduction";

import LoadingPage from "@/app/(auth)/loadingpage";

export default function LoginModule() {
  const [isLoading, setIsLoading] = useState(false);

  // Khi bắt đầu đăng nhập
  const handleLoginStart = () => {
    setIsLoading(true);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full h-screen flex items-center">
      <LoginIntroduction />
      <LoginForm onLoginStart={handleLoginStart} />
    </div>
  );
}
