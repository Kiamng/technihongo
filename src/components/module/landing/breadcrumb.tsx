"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import LandingHeader from "./header";

import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/effect-coverflow";

// Danh sách ảnh nền
const backgroundImages = [
  "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/490000/490105-kofu.jpg",
  "https://i.imgur.com/ONtiZtK.jpeg", //
  "https://i.imgur.com/UFnfX1s.jpeg",
];

const Breadcrumb = () => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px]">
      {/* Swiper Image Slider */}
      <Swiper
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full h-full"
        coverflowEffect={{
          rotate: 30, // Góc xoay của ảnh khi trượt
          stretch: 0, // Khoảng cách giữa các ảnh
          depth: 100, // Độ sâu của hiệu ứng 3D
          modifier: 1, // Điều chỉnh cường độ hiệu ứng
          slideShadows: false, // Bật/tắt bóng
        }}
        effect="coverflow"
        modules={[Autoplay, EffectCoverflow]}
        speed={2000}
      >
        {backgroundImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Header */}
      <LandingHeader />

      {/* Nội dung tiêu đề trên ảnh */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 space-y-6 text-center z-10">
        <div className="text-3xl md:text-5xl font-bold">
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN TẠI TECHNIHONGO
        </div>
        <div className="text-xl md:text-2xl font-normal max-w-2xl mx-auto">
          Khám phá hàng ngàn khóa học chất lượng cao từ nguồn học uy tín từ FPT.
          Học mọi lúc, mọi nơi.
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Button className="bg-[#56D071] hover:bg-[#48BA63] text-white text-lg px-8 py-6 h-auto">
            Khám phá khóa học
          </Button>
          <Button
            className="border-[#56D071] text-[#56D071] hover:bg-[#56D071] hover:text-white text-lg px-8 py-6 h-auto"
            variant="outline"
          >
            Tìm hiểu thêm
          </Button>
        </div>
      </div>

      {/* Hiệu ứng bo cong phía dưới */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </div>
  );
};

export default Breadcrumb;
