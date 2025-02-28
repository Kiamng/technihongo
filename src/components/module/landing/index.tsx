import Image from "next/image";

import Breadcrumb from "./breadcrumb";

export default function LandingPage() {
  return (
    <div className=" min-h-screen w-full">
      <Breadcrumb />

      {/* Main Content */}
      <main className="container mx-auto py-10 px-6">
        <section className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <Image
            alt="Courses"
            className="rounded-lg mr-6"
            height={200}
            src="/images/course.jpg"
            width={300}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Các Khóa Học Chuyên Sâu
            </h2>
            <p className="text-gray-600">
              Nắm vững quy trình phát triển dự án phần mềm qua các khóa học bài
              bản, từ Agile, Scrum đến DevOps, kèm theo thuật ngữ tiếng Nhật IT.
            </p>
          </div>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <Image
            alt="Quiz"
            className="rounded-lg mr-6"
            height={200}
            src="/images/quiz.jpg"
            width={300}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Luyện Tập Với Quiz
            </h2>
            <p className="text-gray-600">
              Kiểm tra và củng cố kiến thức thông qua các bài quiz thú vị theo
              từng chủ đề chuyên ngành.
            </p>
          </div>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <Image
            alt="Flashcard"
            className="rounded-lg mr-6"
            height={200}
            src="/images/flashcard.jpg"
            width={300}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Flashcard Thông Minh
            </h2>
            <p className="text-gray-600">
              Tạo và sử dụng flashcard để ghi nhớ thuật ngữ tiếng Nhật IT nhanh
              chóng và hiệu quả.
            </p>
          </div>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <Image
            alt="Scan Documents"
            className="rounded-lg mr-6"
            height={200}
            src="/images/scan.jpg"
            width={300}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Scan & Dịch Tài Liệu
            </h2>
            <p className="text-gray-600">
              Chụp ảnh tài liệu tiếng Nhật và nhận bản dịch tiếng Việt - tiếng
              Anh theo đúng ngữ cảnh ngành CNTT.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center p-4">
        <p>&copy; 2025 - TechNihongo. Tất cả các quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
