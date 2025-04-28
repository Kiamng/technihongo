/*
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Thêm import Link

import LandingHeader from "./header";

import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/effect-coverflow";

// Danh sách ảnh nền
const backgroundImages = [
  "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/490000/490105-kofu.jpg",
  "https://i.imgur.com/ONtiZtK.jpeg",
  "https://i.imgur.com/UFnfX1s.jpeg",
];

const Breadcrumb = () => {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="relative w-full">
      
      <Swiper
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full h-[600px] md:h-[700px]"
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
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

      
      <LandingHeader />

      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 space-y-6 text-center z-10">
        <div className="text-3xl md:text-5xl font-bold">
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN TẠI TECHNIHONGO
        </div>
        <div className="text-xl md:text-2xl font-normal max-w-2xl mx-auto">
          Khám phá hàng ngàn khóa học chất lượng cao từ nguồn học uy tín từ FPT.
          Học mọi lúc, mọi nơi.
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link href="/login">
            <Button className="bg-[#56D071] hover:bg-[#48BA63] text-white text-lg px-8 py-6 h-auto">
              Khám phá khóa học
            </Button>
          </Link>
          <Link href="/login">
            <Button
              className="border-[#56D071] text-[#56D071] hover:bg-[#56D071] hover:text-white text-lg px-8 py-6 h-auto"
              variant="outline"
            >
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </div>

      
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </div>
  );
};

export default Breadcrumb;

*/
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import LandingHeader from "./header";

import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/effect-coverflow";

// Danh sách ảnh nền
const backgroundImages = [
  "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/490000/490105-kofu.jpg",
  "https://i.imgur.com/ONtiZtK.jpeg",
  "https://i.imgur.com/UFnfX1s.jpeg",
];

const Breadcrumb = () => {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <section className="relative w-full">
      {/* Swiper Image Slider */}
      <Swiper
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full h-[600px] md:h-[700px]"
        coverflowEffect={{
          rotate: 15, // Giảm góc xoay để nhẹ nhàng hơn
          stretch: 0,
          depth: 80, // Giảm độ sâu cho hiệu ứng tinh tế
          modifier: 1,
          slideShadows: false,
        }}
        effect="coverflow"
        modules={[Autoplay, EffectCoverflow]}
        speed={2000}
      >
        {backgroundImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center rounded-lg relative"
              style={{
                backgroundImage: `url('${image}')`,
              }}
            >
              <div className="absolute inset-0 bg-black/40" />{" "}
              {/* Đúng cú pháp */}
              {/* Overlay tối */}
              <span className="sr-only">
                Hình ảnh quảng bá TechNihongo {index + 1}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Header */}
      <LandingHeader />

      {/* Nội dung tiêu đề trên ảnh */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 space-y-6 text-center z-10">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          KHÁM PHÁ TIẾNG NHẬT IT CÙNG TECHNIHONGO
        </motion.h1>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-normal max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Học tiếng Nhật IT chuyên sâu, sẵn sàng làm việc tại công ty Nhật Bản.
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl font-normal text-[#56D071]"
          initial={{ opacity: 0, y: 20 }}
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          テック日本語でITの未来を切り開く
        </motion.div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link href="/course">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                aria-label="Khám phá các khóa học tiếng Nhật IT"
                className="bg-[#56D071] hover:bg-[#48BA63] text-white text-lg px-8 py-6 h-auto"
              >
                Khám phá khóa học
              </Button>
            </motion.div>
          </Link>
          <Link href="/course">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                aria-label="Tìm hiểu thêm về TechNihongo"
                className="border-[#56D071] text-[#56D071] hover:bg-[#56D071] hover:text-white text-lg px-8 py-6 h-auto"
                variant="outline"
              >
                Tìm hiểu thêm
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Hiệu ứng bo cong phía dưới */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </section>
  );
};

export default Breadcrumb;
