"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";

import Breadcrumb from "./breadcrumb";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LandingPageProps = {};

// Custom component for animated feature card
const AnimatedFeatureCard = ({
  imageFirst = true,
  imageSrc,
  imageAlt,
  title,
  description,
}: {
  imageFirst?: boolean;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const imageVariants = {
    hidden: { opacity: 0, x: imageFirst ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const contentVariants = {
    hidden: { opacity: 0, x: imageFirst ? 100 : -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent
          className={`p-6 flex items-center ${
            imageFirst ? "md:flex-row" : "md:flex-row-reverse"
          } flex-col md:justify-between`}
        >
          <motion.div
            animate={isInView ? "visible" : "hidden"}
            className="relative w-[300px] h-[200px] md:w-[400px] md:h-[300px] mb-4 md:mb-0 flex-shrink-0"
            initial="hidden"
            variants={imageVariants}
          >
            <Image
              fill
              alt={imageAlt}
              className="rounded-lg object-cover"
              src={imageSrc || "/placeholder.svg"}
            />
          </motion.div>
          <motion.div
            animate={isInView ? "visible" : "hidden"}
            className="w-full md:w-auto md:max-w-[50%]"
            initial="hidden"
            variants={contentVariants}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-[#56D071] hover:bg-[#56D071]/90 relative overflow-hidden group">
                <motion.span
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ x: "100%" }}
                />
                Tìm hiểu thêm
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Custom animated button component with shake effect
const AnimatedButton = ({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: {
          duration: 0.2,
          yoyo: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        className={className}
        variant={variant === "outline" ? "outline" : "default"}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default function LandingPage({}: LandingPageProps) {
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      id: 1,
      content:
        'Không chỉ dừng lại tại khóa học Tiếng Nhật đơn thuần, TechNihongo luôn cập nhật, đổi mới khóa học đáp ứng đa dạng đối tượng người dùng. Trong năm 2025, Technihongo đã cho ra mắt khóa học "IT Tech - Tiếng Nhật cho người đi làm".',
    },
    {
      id: 2,
      content:
        'Đội ngũ giáo viên đều đạt trình độ N2-N1, dày dặn kinh nghiệm từ giảng dạy cho đến "thực chiến" tại công ty Nhật trở lên là một nhân tố quan trọng trong việc tạo nên sự thành công trong chất lượng đào tạo tại TechNihongo.',
    },
    {
      id: 3,
      content:
        "Qua vài tháng đầu tiếp hành trình cùng nghìn sĩ tử JLPT, TechNihongo đều cập nhật mới nhất từ xu hướng ra đề thi cho đến phương pháp giáo trình học... Chính vì vậy, TechNihongo tự tin là website Nhật Ngữ số 1 tại đại học FPT.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <div className="min-h-screen w-full">
      <Breadcrumb />

      {/* Main Content */}
      <main className="w-full">
        {/* Features Section */}
        <section className="py-16 bg-[#E6F5EA]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tại sao chọn TECHNIHONGO?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cung cấp nền tảng học tập toàn diện với nhiều tính
                năng vượt trội
              </p>
            </div>

            <AnimatedFeatureCard
              description="Nắm vững quy trình phát triển dự án phần mềm qua các khóa học bài bản, từ Agile, Scrum đến DevOps, kèm theo thuật ngữ tiếng Nhật IT."
              imageAlt="TechNihongo Features"
              imageFirst={true}
              imageSrc="/assets/images/course.jpg"
              title="Các Khóa Học Chuyên Sâu"
            />

            <AnimatedFeatureCard
              description="Tài liệu, video, bài tập thực hành phong phú được thiết kế khoa học và cập nhật liên tục. Nội dung học tập được biên soạn kỹ lưỡng, dễ hiểu và phù hợp với mọi trình độ."
              imageAlt="Learning Methods"
              imageFirst={false}
              imageSrc="/assets/images/course.jpg"
              title="Học liệu đa dạng"
            />

            <AnimatedFeatureCard
              description="Kiểm tra và củng cố kiến thức thông qua các bài quiz thú vị theo từng chủ đề chuyên ngành."
              imageAlt="Support"
              imageFirst={true}
              imageSrc="/assets/images/quiz.jpg"
              title="Luyện Tập Với Quiz"
            />

            <AnimatedFeatureCard
              description="Chụp ảnh tài liệu tiếng Nhật và nhận bản dịch tiếng Việt - tiếng Anh theo đúng ngữ cảnh ngành CNTT."
              imageAlt="Learning Methods"
              imageFirst={false}
              imageSrc="/assets/images/scan.jpg"
              title="Scan & Dịch Tài Liệu"
            />
          </div>
        </section>

        {/* Popular Courses */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <p className="text-[#56D071] text-2xl md:text-3xl font-semibold mb-2">
                知識への投資は最高の利益をもたらす
              </p>
              <p className="text-3xl md:text-4xl font-bold mb-4">
                Tiếng Nhật không khó khi có TechNihongo!
              </p>
            </div>

            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Khóa học nổi bật</h2>
              <Link
                className="text-[#56D071] hover:text-[#56D071]/80 flex items-center"
                href="#"
              >
                Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {},
              }}
              viewport={{ once: true, amount: 0.2 }}
              whileInView="visible"
            >
              {[1, 2, 3].map((course) => (
                <motion.div
                  key={course}
                  variants={{
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                    hidden: { opacity: 0, y: 50 },
                  }}
                  whileHover={{
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <Image
                        fill
                        alt={`Course ${course}`}
                        className="object-cover"
                        src="/assets/images/maincourse.png"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#56D071] font-medium">
                          Phổ biến
                        </span>
                        <span className="text-sm text-gray-500">
                          4.8 ⭐ (120)
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Khóa học {course}: Tiếng Nhật IT
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        Nâng cao kỹ năng tiếng Nhật với phương pháp học hiệu
                        quả.
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#56D071] font-bold">
                          1.200.000₫
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button className="bg-[#56D071] hover:bg-[#56D071]/90">
                            Đăng ký
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Quotes Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className="text-center text-4xl font-bold mb-16">
              <span className="text-[#56D071]">TECHNIHONGO LÀ</span>{" "}
              <span className="text-black">SỰ KHÁC BIỆT</span>
            </h1>

            <div className="relative flex justify-center items-center">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[120px] leading-none text-[#56D071] font-serif">
                “
              </div>
              <div className="max-w-3xl mx-auto px-16 min-h-[200px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                    exit={{ opacity: 0, x: 50 }}
                    initial={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    {quotes[currentQuote].content}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] leading-none text-[#56D071] font-serif">
                ”
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-[#FFF5E1]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-4">
              <p className="text-[#56D071] text-2xl md:text-3xl font-semibold">
                “昨日より良くなる”
              </p>
            </div>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Người dùng nói gì về chúng tôi
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hàng ngàn học viên đã thành công với các khóa học của
                TECHNIHONGO
              </p>
            </div>

            <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex md:flex-row flex-col items-center">
                <motion.div
                  className="relative w-[300px] h-[200px] md:w-[400px] md:h-[300px] mb-4 md:mb-0 md:mr-6 flex-shrink-0"
                  initial={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <Image
                    fill
                    alt="Happy Students"
                    className="rounded-lg object-cover"
                    src="/assets/images/happystudent.jpg"
                  />
                </motion.div>
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.3 } },
                    hidden: {},
                  }}
                  viewport={{ once: true }}
                  whileInView="visible"
                >
                  {[
                    {
                      name: "Nguyễn Tuấn Kiệt",
                      role: "Sinh viên",
                      content:
                        "Khóa học rất hay và bổ ích, tài liệu phong phú. Tôi đã cải thiện được nhiều kỹ năng sau khi hoàn thành khóa học.",
                    },
                    {
                      name: "Đào Hải Nam",
                      role: "Sinh viên",
                      content:
                        "Tôi có thể học nhiều kiến thức với TechNihongo. Nội dung khóa học được thiết kế rất khoa học và dễ hiểu.",
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg relative"
                      variants={{
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.5, ease: "easeOut" },
                        },
                        hidden: { opacity: 0, x: index % 2 === 0 ? 100 : -100 },
                      }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow:
                          "0 10px 15Unnamed File-3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <p className="text-gray-600 mb-4 pl-6">
                        {testimonial.content}
                      </p>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-300 mr-4" />
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#56D071] text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt và bắt đầu khám phá
                hàng ngàn khóa học chất lượng
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <AnimatedButton className="bg-white text-[#56D071] hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                  Đăng ký ngay
                </AnimatedButton>
                <AnimatedButton
                  className="text-[#56D071] hover:bg-white text-lg px-8 py-6 h-auto"
                  variant="outline"
                >
                  Tìm hiểu thêm
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Image
                alt="Logo"
                className="mb-4"
                height={60}
                src="/assets/images/logo.png"
                width={120}
              />
              <p className="text-black mb-4">
                Nền tảng học tập hàng đầu FPT với sứ mệnh mang đến kiến thức
                chất lượng cho mọi người.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-black">Khóa học</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Ngoại ngữ
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Kỹ năng mềm
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Marketing
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Công nghệ thông tin
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Thiết kế
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-black">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Trung tâm hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link className="text-black hover:text-[#56D071]" href="#">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-black">Liên hệ</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-black" />
                  <span className="text-black">0123 456 789</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-black" />
                  <span className="text-black">info@technihongo.edu.vn</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-black" />
                  <span className="text-black">
                    123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-black">
              © 2025 TechNihongo. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
