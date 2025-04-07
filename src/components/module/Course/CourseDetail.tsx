// src/components/course-detail.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Lock, PlayCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useLessons } from "../lesson";
import { useStudyPlans } from "../StudyPlan/useStudyPlans";

import { enrollCourse, checkEnrollStatus } from "@/app/api/lesson/lesson.api";
import { Button } from "@/components/ui/button";

interface LessonItem {
  title: string;
  duration: string;
  isLocked: boolean;
}

interface Section {
  name: string;
  lessons: LessonItem[];
}

interface Chapter {
  name: string;
  videos: number;
  exercises: number;
  tests: number;
  sections: Section[];
}

interface CourseDetailData {
  courseId: number;
  title: string;
  description: string;
  difficultyTag: string;
  difficultyName: string;
  difficultyDescription: string;
  duration: string;
  goals: string[];
  chapters: Chapter[];
}

interface CourseDetailProps {
  initialCourseDetail?: any;
}

export default function CourseDetail({
  initialCourseDetail,
}: CourseDetailProps) {
  const { data: session } = useSession();
  const params = useParams();
  const courseId = Number(params.courseId);

  const {
    studyPlans,
    isLoading: isLoadingPlans,
    error: errorPlans,
  } = useStudyPlans(courseId, session?.user?.token);

  const selectedStudyPlanId = studyPlans?.[0]?.studyPlanId || 5;

  const [pageNo, setPageNo] = useState(0);
  const pageSize = 3;
  const [allLessons, setAllLessons] = useState<LessonItem[]>([]);
  const [displayedLessons, setDisplayedLessons] = useState<LessonItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const {
    lessons,
    isLoading: isLoadingLessons,
    error: errorLessons,
  } = useLessons(selectedStudyPlanId, session?.user?.token, {
    pageNo,
    pageSize,
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<number>(0);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (session?.user?.token) {
        try {
          const result = await checkEnrollStatus(courseId, session.user.token);

          setIsEnrolled(result.data);
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái đăng ký:", error);
        }
      }
    };

    checkEnrollment();
  }, [courseId, session?.user?.token]);

  useEffect(() => {
    if (lessons?.content) {
      const newLessons = lessons.content.map((lesson) => ({
        title: lesson.title,
        duration: `${studyPlans?.[0]?.hoursPerDay || 0} giờ/ngày`,
        isLocked: !studyPlans?.[0]?.active,
      }));

      if (pageNo === 0) {
        setAllLessons(newLessons);
        setDisplayedLessons(newLessons);
      } else {
        setAllLessons((prev) => {
          const updatedLessons = [...prev, ...newLessons];

          setDisplayedLessons(updatedLessons);

          return updatedLessons;
        });
      }

      const totalPages =
        lessons.totalPages || Math.ceil(lessons.totalElements / pageSize) || 1;

      setHasMore(pageNo < totalPages - 1);
    }
  }, [lessons, pageNo, studyPlans]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleCollapse = () => {
    setDisplayedLessons(allLessons.slice(0, pageSize));
    setPageNo(0);
    setHasMore(true);
  };

  const handleEnroll = async () => {
    if (!session?.user?.token) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học!");

      return;
    }

    setIsEnrolling(true);

    try {
      const result = await enrollCourse(courseId, session.user.token);

      if (result.success) {
        toast.success("Đăng ký khóa học thành công!");
        setIsEnrolled(true);
      } else {
        toast.error(
          result.message.includes("Student must have an active subscription")
            ? "Bạn cần có gói đăng ký hoạt động để tham gia khóa học cao cấp!"
            : result.message || "Đăng ký khóa học thất bại!",
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.status === 400
          ? "Bạn cần có gói đăng ký hoạt động để tham gia khóa học cao cấp!"
          : "Đã có lỗi xảy ra khi đăng ký khóa học!";

      toast.error(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoadingPlans || (isLoadingLessons && pageNo === 0)) {
    return <div className="container mx-auto p-6">Đang tải...</div>;
  }

  if (errorPlans || errorLessons) {
    return (
      <div className="container mx-auto p-6">
        Lỗi: {errorPlans || errorLessons}
      </div>
    );
  }

  if (!studyPlans || studyPlans.length === 0 || !lessons) {
    return <div className="container mx-auto p-6">Không tìm thấy dữ liệu</div>;
  }

  const courseDetail: CourseDetailData = {
    courseId,
    title: studyPlans[0].course.title,
    description: studyPlans[0].course.description,
    difficultyTag: studyPlans[0].course.difficultyLevel.tag,
    difficultyName: studyPlans[0].course.difficultyLevel.name,
    difficultyDescription: studyPlans[0].course.difficultyLevel.description,
    duration: studyPlans[0].course.estimatedDuration,
    goals: ["Nắm chắc kiến thức", "Phát âm chuẩn", "Chuẩn bị thi"],
    chapters: [
      {
        name: studyPlans[0].title,
        videos: lessons.totalElements || lessons.content.length,
        exercises: 0,
        tests: 0,
        sections: [
          {
            name: studyPlans[0].description,
            lessons: displayedLessons,
          },
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{courseDetail.title}</h1>

            <div className="mb-6">
              {courseDetail.chapters.map(
                (chapter: Chapter, chapterIndex: number) => (
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
                        {chapter.videos} bài học
                      </div>
                    </div>

                    {selectedChapter === chapterIndex && chapter.sections && (
                      <div className="mt-4">
                        {chapter.sections.map(
                          (section: Section, sectionIndex: number) => (
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
                                <div className="mt-3 space-y-3">
                                  {section.lessons.map(
                                    (
                                      lesson: LessonItem,
                                      lessonIndex: number,
                                    ) => (
                                      <div
                                        key={`${chapterIndex}-${sectionIndex}-${lessonIndex}`}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-center justify-between">
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
                                            <span className="font-medium">
                                              {lesson.title}
                                            </span>
                                          </div>
                                          <span className="text-sm text-gray-500">
                                            {lesson.duration}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              {hasMore && (
                <Button
                  className="hover:scale-105 duration-100"
                  disabled={isLoadingLessons}
                  onClick={handleLoadMore}
                >
                  {isLoadingLessons ? "Đang tải..." : "Tải thêm"}
                </Button>
              )}
              {displayedLessons.length > pageSize && (
                <Button
                  className="hover:scale-105 duration-100"
                  onClick={handleCollapse}
                >
                  Thu gọn
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-[#2B5F54] mb-2">
                {courseDetail.title}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                {courseDetail.description}
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

              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-1">Độ khó</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {courseDetail.difficultyTag} - {courseDetail.difficultyName}
                  </span>
                  <p>{courseDetail.difficultyDescription}</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-sm text-gray-600">
                Thời gian học: {courseDetail.duration}
              </div>
            </div>

            {isEnrolled ? (
              <button
                disabled
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Đã Đăng Ký
              </button>
            ) : (
              <Button
                className="w-full hover:scale-105 duration-100"
                disabled={isEnrolling}
                onClick={handleEnroll}
              >
                {isEnrolling ? "Đang đăng ký..." : "Đăng Ký Khóa Học"}
              </Button>
            )}

            <div className="mt-4">
              <h3 className="font-bold mb-3">Mục tiêu khóa học</h3>
              <div className="space-y-2">
                {courseDetail.goals.map((goal: string, index: number) => (
                  <div key={index} className="flex items-center">
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
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        position="top-right"
      />
    </div>
  );
}
