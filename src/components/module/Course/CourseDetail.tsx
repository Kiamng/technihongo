"use client";

import React, { useState, useEffect } from "react";
import { Flag, Lock, PlayCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useLessons } from "../lesson";
import { useStudyPlans } from "../StudyPlan/useStudyPlans";

import RatingModal from "./RatingModal";

import { enrollCourse, checkEnrollStatus } from "@/app/api/lesson/lesson.api";
import { Button } from "@/components/ui/button";
import {
  getAverageCourseRating,
  getCourseRatings,
  createCourseRating,
  getStudentCourseRating,
  updateCourseRating,
  deleteCourseRating,
} from "@/app/api/course/course.api";
import { CourseRating, CourseRatingResponse } from "@/types/course";
import ReportPopup from "@/components/core/common/report-popup";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";

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
  const router = useRouter();

  const {
    studyPlans,
    isLoading: isLoadingPlans,
    error: errorPlans,
  } = useStudyPlans(courseId, session?.user?.token);

  // Chỉ chọn selectedStudyPlanId khi studyPlans đã được tải
  const selectedStudyPlanId = studyPlans?.[0]?.studyPlanId;

  console.log("courseId:", courseId);
  console.log("studyPlans:", studyPlans);
  console.log("selectedStudyPlanId:", selectedStudyPlanId);

  const [pageNo, setPageNo] = useState(0);
  const pageSize = 3;
  const [allLessons, setAllLessons] = useState<LessonItem[]>([]);
  const [displayedLessons, setDisplayedLessons] = useState<LessonItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [allRatings, setAllRatings] = useState<CourseRating[]>([]);
  const [displayedRatings, setDisplayedRatings] = useState<CourseRating[]>([]);
  const [ratingsPageSize] = useState(3);
  const [ratingsCount, setRatingsCount] = useState(ratingsPageSize);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newReview, setNewReview] = useState<string>("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [existingRating, setExistingRating] = useState<CourseRating | null>(
    null,
  );

  // Gọi useLessons vô điều kiện
  const {
    lessons,
    isLoading: isLoadingLessons,
    error: errorLessons,
  } = useLessons(selectedStudyPlanId, session?.user?.token, {
    pageNo,
    pageSize,
  });

  console.log("lessons:", lessons);

  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<number>(0);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<CourseRating | null>(
    null,
  );

  const handleReportRating = (rating: CourseRating) => {
    setSelectedRating(rating);
    setIsFlagModalOpen(true);
  };

  // Hàm lấy đánh giá của người dùng
  const fetchStudentRating = async () => {
    if (session?.user?.token) {
      try {
        const studentRating = await getStudentCourseRating({
          courseId,
          token: session.user.token,
        });

        setHasRated(!!studentRating);
        setExistingRating(studentRating);
      } catch (error) {
        console.error("Lỗi khi kiểm tra đánh giá của người dùng:", error);
        setHasRated(false);
        setExistingRating(null);
      }
    }
  };

  // Reset allLessons khi selectedStudyPlanId thay đổi
  useEffect(() => {
    setAllLessons([]); // Làm mới danh sách bài học
    setDisplayedLessons([]); // Làm mới danh sách hiển thị
    setPageNo(0); // Reset pageNo để bắt đầu lại từ trang đầu
    setHasMore(true); // Đặt lại hasMore để cho phép tải thêm
  }, [selectedStudyPlanId]);

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

    const fetchAverageRating = async () => {
      if (session?.user?.token) {
        try {
          const rating = await getAverageCourseRating(
            courseId,
            session.user.token,
          );

          setAverageRating(rating);
        } catch (error) {
          console.error("Lỗi khi lấy đánh giá trung bình:", error);
          setAverageRating(0);
        }
      }
    };

    const fetchCourseRatings = async () => {
      if (session?.user?.token) {
        setIsLoadingRatings(true);
        try {
          const ratings = await getCourseRatings({
            courseId,
            token: session.user.token,
          });

          setAllRatings(ratings);
          setDisplayedRatings(ratings.slice(0, ratingsPageSize));
        } catch (error) {
          console.error("Lỗi khi lấy danh sách đánh giá:", error);
          setAllRatings([]);
          setDisplayedRatings([]);
        } finally {
          setIsLoadingRatings(false);
        }
      }
    };

    checkEnrollment();
    fetchAverageRating();
    fetchCourseRatings();
    fetchStudentRating();
  }, [courseId, session?.user?.token, ratingsPageSize]);

  useEffect(() => {
    if (lessons?.content) {
      const newLessons = lessons.content.map((lesson) => ({
        title: lesson.title,
        duration: `${studyPlans?.[0]?.hoursPerDay || 0} giờ/ngày`,
        isLocked: !studyPlans?.[0]?.active,
      }));

      console.log("newLessons:", newLessons);

      setAllLessons((prev) => {
        const existingTitles = new Set(prev.map((lesson) => lesson.title));
        const uniqueNewLessons = newLessons.filter(
          (lesson) => !existingTitles.has(lesson.title),
        );
        const updatedLessons = [...prev, ...uniqueNewLessons];

        console.log("updatedLessons:", updatedLessons);

        const totalDisplay = (pageNo + 1) * pageSize;

        setDisplayedLessons(updatedLessons.slice(0, totalDisplay));

        return updatedLessons;
      });

      const totalPages =
        lessons.totalPages || Math.ceil(lessons.totalElements / pageSize) || 1;

      setHasMore(pageNo < totalPages - 1 && newLessons.length > 0);
    } else {
      setHasMore(false);
    }
  }, [lessons, pageNo, studyPlans, pageSize]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingLessons) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleCollapse = () => {
    setDisplayedLessons(allLessons.slice(0, pageSize));
    setPageNo(0);
    setHasMore(allLessons.length > pageSize);
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
        router.push(`/course/study/${courseId}`);
        setIsEnrolled(true);
      } else {
        toast.error(
          result.message.includes("Student must have an active subscription")
            ? "Bạn cần có gói đăng ký hoạt động để tham gia khóa học cao cấp!"
            : result.message || "Đăng ký khóa học thất bại!",
        );
        if (
          result.message.includes("Student must have an active subscription")
        ) {
          router.push("/subscription-plan");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.status === 400
          ? "Bạn cần có gói đăng ký hoạt động để tham gia khóa học cao cấp!"
          : "Đã có lỗi xảy ra khi đăng ký khóa học!";

      if (error.response?.status === 400) {
        router.push("/subscription-plan");
      }
      toast.error(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleLoadMoreRatings = () => {
    const newCount = ratingsCount + ratingsPageSize;

    setRatingsCount(newCount);
    setDisplayedRatings(allRatings.slice(0, newCount));
  };

  const openRatingModal = () => {
    if (!session?.user?.token) {
      toast.error("Vui lòng đăng nhập để đánh giá khóa học!");

      return;
    }
    if (!isEnrolled) {
      toast.error("Bạn cần đăng ký khóa học trước khi đánh giá!");

      return;
    }

    if (hasRated && existingRating) {
      setNewRating(existingRating.rating);
      setNewReview(existingRating.review || "");
    } else {
      setNewRating(0);
      setNewReview("");
    }
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setNewRating(0);
    setNewReview("");
  };

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
  };

  const submitRating = async () => {
    if (!session?.user?.token) return;
    if (newRating < 1 || newRating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5!");

      return;
    }
    if (!newReview.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá!");

      return;
    }

    setIsSubmittingRating(true);
    try {
      let updatedRatingData: CourseRatingResponse;

      if (hasRated && existingRating) {
        updatedRatingData = await updateCourseRating({
          ratingId: existingRating.ratingId,
          courseId,
          rating: newRating,
          review: newReview,
          token: session.user.token,
        });
        if (updatedRatingData.success) {
          setAllRatings((prev) =>
            prev.map((rating) =>
              rating.ratingId === existingRating.ratingId
                ? updatedRatingData.data
                : rating,
            ),
          );
          setDisplayedRatings((prev) =>
            prev
              .map((rating) =>
                rating.ratingId === existingRating.ratingId
                  ? updatedRatingData.data
                  : rating,
              )
              .slice(0, ratingsCount),
          );
          toast.success("Đánh giá của bạn đã được cập nhật!");
        }
      } else {
        updatedRatingData = await createCourseRating({
          courseId,
          rating: newRating,
          review: newReview,
          token: session.user.token,
        });
        if (updatedRatingData.success) {
          setAllRatings((prev) => [updatedRatingData.data, ...prev]);
          setDisplayedRatings((prev) =>
            [updatedRatingData.data, ...prev].slice(0, ratingsCount),
          );
          setHasRated(true);
          toast.success("Đánh giá của bạn đã được gửi!");
        }
      }
      await fetchStudentRating();
      const newAverage = await getAverageCourseRating(
        courseId,
        session.user.token,
      );

      setAverageRating(newAverage);
      closeRatingModal();
    } catch (error) {
      console.error("Lỗi khi xử lý đánh giá:", error);
      toast.error("Không thể xử lý đánh giá. Vui lòng thử lại!");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!session?.user?.token || !existingRating) return;

    try {
      await deleteCourseRating({
        ratingId: existingRating.ratingId,
        token: session.user.token,
      });
      setAllRatings((prev) =>
        prev.filter((rating) => rating.ratingId !== existingRating.ratingId),
      );
      setDisplayedRatings((prev) =>
        prev.filter((rating) => rating.ratingId !== existingRating.ratingId),
      );
      setHasRated(false);
      setExistingRating(null);
      setNewRating(0);
      setNewReview("");
      await fetchStudentRating();
      const newAverage = await getAverageCourseRating(
        courseId,
        session.user.token,
      );

      setAverageRating(newAverage);
      toast.success("Đánh giá đã được xóa thành công!");
      closeRatingModal();
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast.error("Không thể xóa đánh giá. Vui lòng thử lại!");
    }
  };

  if (isLoadingPlans || (isLoadingLessons && pageNo === 0)) {
    return <LoadingAnimation />;
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
                    className={`w-full text-left p-4 mb-2 rounded-lg cursor-pointer ${selectedChapter === chapterIndex
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
                              className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer ${selectedSection === sectionIndex
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
                <div className="flex text-orange-400 mr-2 relative">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;

                    return (
                      <span key={i} className="relative inline-block">
                        <span className="text-gray-300">★</span>
                        {averageRating >= ratingValue ? (
                          <span className="absolute top-0 left-0 text-orange-400">
                            ★
                          </span>
                        ) : averageRating > i && averageRating < ratingValue ? (
                          <span
                            className="absolute top-0 left-0 text-orange-400 overflow-hidden"
                            style={{ width: `${(averageRating - i) * 100}%` }}
                          >
                            ★
                          </span>
                        ) : null}
                      </span>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)}/5
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

            {/* Ratings Section */}
            <div className="mt-6">
              <h3 className="font-bold mb-3">Đánh giá từ học viên</h3>
              {isLoadingRatings ? (
                <div className="text-center text-gray-600">
                  Đang tải đánh giá...
                </div>
              ) : displayedRatings.length === 0 ? (
                <div className="text-center text-gray-600">
                  Chưa có đánh giá nào
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedRatings.map((rating) => (
                    <div
                      key={rating.ratingId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="w-full flex justify-between">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold mr-2">
                            {rating.userName}
                          </span>
                          <div className="flex text-orange-500">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < rating.rating
                                    ? "text-orange-500"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {rating.studentId !==
                          Number(session?.user.studentId) && (
                            <button
                              className="text-gray-600 hover:-translate-y-1 transition-all duration-300 hover:text-yellow-500"
                              onClick={() => handleReportRating(rating)}
                            >
                              <Flag size={20} strokeWidth={1} />
                            </button>
                          )}
                      </div>
                      <p className="text-gray-600">{rating.review}</p>
                    </div>
                  ))}
                </div>
              )}
              {allRatings.length > displayedRatings.length && (
                <div className="mt-4 flex justify-center">
                  <Button
                    className="hover:scale-105 duration-100"
                    onClick={handleLoadMoreRatings}
                  >
                    Xem thêm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFlagModalOpen && selectedRating && (
        <ReportPopup
          contentId={selectedRating.ratingId}
          rating={selectedRating}
          token={session?.user?.token || ""}
          type="Rating"
          onClose={setIsFlagModalOpen}
          onOpen={isFlagModalOpen}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        hasRated={hasRated}
        isOpen={showRatingModal}
        isSubmitting={isSubmittingRating}
        rating={newRating}
        review={newReview}
        onClose={closeRatingModal}
        onDelete={handleDeleteRating}
        onRatingChange={handleRatingChange}
        onReviewChange={setNewReview}
        onSubmit={submitRating}
      />

      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        position="top-right"
      />
    </div>
  );
}
