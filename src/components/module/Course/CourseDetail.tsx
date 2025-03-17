"use client";

import React, { useState } from "react";
import { Lock, PlayCircle } from "lucide-react";

interface CourseDetail {
  courseId: number;
  title: string;
  description: string;
  instructors: string[];
  price: number;
  duration: string;
  goals: string[];
  chapters: {
    name: string;
    videos: number;
    exercises: number;
    tests: number;
    sections?: {
      name: string;
      lessons: {
        title: string;
        duration: string;
        isLocked: boolean;
      }[];
    }[];
  }[];
}

interface CourseDetailProps {
  initialCourseDetail: CourseDetail;
}

export default function CourseDetail({
  initialCourseDetail,
}: CourseDetailProps) {
  const [courseDetail] = useState(initialCourseDetail);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);
  const [visibleChapters, setVisibleChapters] = useState(5);

  const handleViewMore = () => {
    setVisibleChapters((prev) =>
      prev + 5 > courseDetail.chapters.length
        ? courseDetail.chapters.length
        : prev + 5,
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{courseDetail.title}</h1>

            <div className="mb-6">
              {courseDetail.chapters.map((chapter, chapterIndex) => (
                <div
                  key={chapterIndex}
                  className={`w-full text-left p-4 mb-2 rounded-lg cursor-pointer ${
                    selectedChapter === chapterIndex
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedChapter(chapterIndex)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedChapter(chapterIndex);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>{chapter.name}</span>
                    <div className="text-sm text-gray-600">
                      {chapter.videos} videos • {chapter.exercises} bài tập
                    </div>
                  </div>

                  {selectedChapter === chapterIndex && chapter.sections && (
                    <div className="mt-4">
                      {chapter.sections.map((section, sectionIndex) => (
                        <div
                          key={`${chapterIndex}-${sectionIndex}`}
                          className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer ${
                            selectedSection === sectionIndex
                              ? "bg-green-200"
                              : "bg-gray-50"
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSection(sectionIndex);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setSelectedSection(sectionIndex);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span>{section.name}</span>
                          </div>

                          {selectedSection === sectionIndex && (
                            <div className="mt-3">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={`${chapterIndex}-${sectionIndex}-${lessonIndex}`}
                                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                                >
                                  <div className="flex items-center">
                                    {lesson.isLocked ? (
                                      <Lock
                                        className="mr-2 text-gray-400"
                                        size={16}
                                      />
                                    ) : (
                                      <PlayCircle
                                        className="mr-2 text-green-500"
                                        size={16}
                                      />
                                    )}
                                    <span>{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {lesson.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-[#2B5F54] mb-2">
                Tiếng Nhật toàn diện
              </h2>
              <h1 className="text-3xl font-bold text-[#2B5F54] mb-2">
                SƠ CẤP N5
              </h1>
              <p className="text-sm text-gray-600 mb-3">
                Xây nền tảng tiếng Nhật vững chắc cùng DUNGMORI
              </p>

              <div className="flex items-center justify-center mb-3">
                <div className="flex text-orange-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  5/5 (5999 đánh giá)
                </span>
              </div>

              <div className="flex justify-center space-x-2 mb-4">
                <div className="text-sm text-gray-700">
                  Giảng viên phụ trách
                </div>
                <div className="flex">
                  <img
                    alt="Thầy Dũng Mori"
                    className="w-6 h-6 rounded-full mr-1"
                    src="/path-to-instructor-1.jpg"
                  />
                  <img
                    alt="Cô Phương Thanh"
                    className="w-6 h-6 rounded-full mr-1"
                    src="/path-to-instructor-2.jpg"
                  />
                  <img
                    alt="Cô Phan Hà"
                    className="w-6 h-6 rounded-full"
                    src="/path-to-instructor-3.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                1,290,000 VNĐ
              </div>
              <div className="text-sm text-gray-600">Thời gian học 8 tháng</div>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
              MUA NGAY
            </button>

            <div className="mt-4">
              <h3 className="font-bold mb-3">Mục tiêu khóa học</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg
                    className="text-green-500 mr-2"
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    Nắm chắc và vận dụng tốt các kiến thức được học vào thực tế.
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="text-green-500 mr-2"
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    Có thể phát âm tiếng Nhật một cách tự nhiên như dân địa
                    phương.
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="text-green-500 mr-2"
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    Được trang bị đầy đủ kiến thức để thi đỗ kì thi N5.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chương trình học */}
        <div className="md:col-span-2 mt-3 space-y-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Chương trình học</h2>
              <p className="text-sm text-gray-600">
                16 Chương • 350 videos bài giảng • 102 giờ 49 phút
              </p>
            </div>

            <div className="space-y-2">
              {/* Nhập môn sơ cấp */}
              <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <img
                      alt="Nhập môn sơ cấp"
                      className="w-10 h-10"
                      src="/path-to-icon.png"
                    />
                    <div>
                      <h3 className="font-semibold">NHẬP MÔN SƠ CẤP</h3>
                      <p className="text-sm text-gray-600">
                        42 videos • 35 bài tập • 0 bài Test
                      </p>
                    </div>
                  </div>
                </div>
                <svg
                  className="text-gray-400"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>

              {/* Chương 1 - Active State */}

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <img
                      alt="Chương 1"
                      className="w-10 h-10"
                      src="/path-to-icon.png"
                    />
                    <div>
                      <h3 className="font-semibold">Chương 1</h3>
                      <p className="text-sm text-gray-600">
                        29 videos • 16 bài tập • 1 bài Test
                      </p>
                    </div>
                  </div>
                  <svg
                    className="text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>

                {/* Các phần trong Chương 1 */}
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span>Phần A: Xin chào, tôi là Mai.</span>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span>Phần B: Tôi không phải người Nhật.</span>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>

                  {/* Các bài học con */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 text-green-500"
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                        <div>
                          <span>Từ vựng 1B</span>
                          <p className="text-xs text-gray-500">
                            2 bài giảng • 24 phút
                          </p>
                        </div>
                      </div>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 text-gray-400"
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            height="18"
                            rx="2"
                            ry="2"
                            width="18"
                            x="3"
                            y="3"
                          />
                          <line x1="9" x2="9" y1="3" y2="21" />
                        </svg>
                        <div>
                          <span>Ngữ pháp 1B</span>
                          <p className="text-xs text-gray-500">
                            3 bài giảng • 48 phút
                          </p>
                        </div>
                      </div>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 text-gray-400"
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            height="18"
                            rx="2"
                            ry="2"
                            width="18"
                            x="3"
                            y="3"
                          />
                          <line x1="9" x2="9" y1="3" y2="21" />
                        </svg>
                        <div>
                          <span>Chữ Hán 1B</span>
                          <p className="text-xs text-gray-500">
                            1 bài giảng • 17 phút
                          </p>
                        </div>
                      </div>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>

                  {/* Các phần cuối */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span>Phần C: Đây là cái gì?</span>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span>Luyện tập Đọc - Nghe chương 1</span>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span>Test tổng hợp chương 1</span>
                      <svg
                        className="text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chương 2-10 */}
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((chapter) => (
                <div
                  key={chapter}
                  className="bg-gray-100 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <img
                        alt={`Chương ${chapter}`}
                        className="w-10 h-10"
                        src="/path-to-icon.png"
                      />
                      <div>
                        <h3 className="font-semibold">Chương {chapter}</h3>
                        <p className="text-sm text-gray-600">
                          21 videos • 15 bài tập • 1 bài Test
                        </p>
                      </div>
                    </div>
                  </div>
                  <svg
                    className="text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
