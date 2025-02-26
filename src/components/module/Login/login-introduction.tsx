import React from "react";

const LoginIntroduction = () => {
  return (
    <div
      className="w-[50%] h-screen p-8 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://assets.vogue.in/photos/6687b953289b94502f6c9f15/3:4/w_2560%2Cc_limit/1029818226')`,
        backgroundSize: "cover", // Đảm bảo ảnh phủ toàn bộ màn hình
        backgroundPosition: "center", // Đảm bảo ảnh luôn căn giữa
      }}
    />
  );
};

export default LoginIntroduction;
