import React from "react";

import LandingHeader from "./header";

const Breadcrumb = () => {
  return (
    <div
      className="w-full h-[1000px] p-8 flex items-center justify-center mx-auto relative"
      style={{
        backgroundImage: `url('https://a.travel-assets.com/findyours-php/viewfinder/images/res70/490000/490105-kofu.jpg')`,
        backgroundSize: "cover", // Đảm bảo ảnh phủ toàn bộ màn hình
        backgroundPosition: "center", // Đảm bảo ảnh luôn căn giữa
      }}
    >
      <LandingHeader />
      <div className="text-white p-10 rounded-2xl bg-[#000000] bg-opacity-35 space-y-4">
        <div className="text-5xl font-semibold text-center">
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN TẠI
        </div>
        <div className="text-9xl font-semibold text-center">TECHNIHONGO</div>
      </div>
    </div>
  );
};

export default Breadcrumb;
