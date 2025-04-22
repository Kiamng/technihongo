"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, CircleCheck, Loader2 } from "lucide-react";
import Confetti from "react-confetti";

import RatingModal from "../Course/RatingModal";

import CongratulationDialog from "./CongratulationDialog";
import LessonResourceItem from "./lesson-resource-item";
import DynamicLearningResource from "./LearningResource/dynamic-learning-resource";
import DynamicQuiz from "./Quiz/dynamic-quiz";
import DynamicFlashcardSet from "./Flashcard/dynamic-flashcard-set";
import ChangeStudyPlanPopUp from "./change-study-plan-pop-up";

import {
  CourseProgress,
  CourseRating,
  CourseRatingResponse,
} from "@/types/course";
import { StudyPlan } from "@/types/study-plan";
import { Lesson, LessonList } from "@/types/lesson";
import { LessonResource } from "@/types/lesson-resource";
import {
  createCourseRating,
  deleteCourseRating,
  getAStudentCourseProgress,
  getStudentCourseRating,
  updateCourseRating,
} from "@/app/api/course/course.api";
import {
  getCourseAvailableStudyPlan,
  getStudentActiveStudyPlan,
} from "@/app/api/StudyPlan/study-plan.api";
import {
  getLessonResourceById,
  getLessonsByStudyPlan,
} from "@/app/api/lesson/lesson.api";
import {
  completeLearningResource,
  completeSystemSet,
  getLessonResourceByLessonId,
  trackLearningResource,
  trackSystemSet,
} from "@/app/api/lesson-resource/lesson-resource.api";
import { getCurrentSubscription } from "@/app/api/subscription/subscription.api";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function StudyModule() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const lessonOrderParam = searchParams.get("lessonOrder");
  const lessonOrder = lessonOrderParam ? parseInt(lessonOrderParam, 10) : 1;
  const lessonId = searchParams.get("lessonId");
  const lessonResourceId = searchParams.get("lessonResourceId");
  const initialPage = lessonResourceId ? 0 : Math.floor((lessonOrder - 1) / 10);
  //Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingLR, setIsLoadingLR] = useState<boolean>(false);
  const [isLoadingLessonList, setIsLoadingLessonList] =
    useState<boolean>(false);

  //Session
  const { data: session } = useSession();

  //Course State
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongratulationDialog, setShowCongratulationDialog] =
    useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>();
  const [activeStudyPlan, setActiveStudyPlan] = useState<StudyPlan>();
  const [availablesStudyPlans, setAvailablesStudyPlans] = useState<StudyPlan[]>(
    [],
  );
  const [lessonList, setLessonList] = useState<LessonList>();
  const [loadedLessons, setLoadedLessons] = useState<Record<number, Lesson[]>>(
    [],
  );
  const [previousPageToLoad, setPreviousPageToLoad] = useState<number>(
    initialPage - 1,
  );
  const [nextPageToLoad, setNextPageToLoad] = useState<number>(initialPage + 1);

  const [currentContentType, setCurrentContentType] = useState<string>("");
  const [currentLessonResource, setCurrentLessonResource] =
    useState<LessonResource>();

  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const [lessonResources, setLessonResources] = useState<
    Record<number, LessonResource[]>
  >({});

  //Rating State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newReview, setNewReview] = useState<string>("");
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [existingRating, setExistingRating] = useState<CourseRating | null>(
    null,
  );

  //Handle rating
  const handleDeleteRating = async () => {
    if (!session?.user?.token || !existingRating) return;

    try {
      await deleteCourseRating({
        ratingId: existingRating.ratingId,
        token: session.user.token,
      });
      setHasRated(false);
      setExistingRating(null);
      setNewRating(0);
      setNewReview("");
      await fetchStudentRating();
      toast.success("Đánh giá đã được xóa thành công!");
      closeRatingModal();
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast.error("Không thể xóa đánh giá. Vui lòng thử lại!");
    }
  };

  const openRatingModal = () => {
    if (!session?.user?.token) {
      toast.error("Vui lòng đăng nhập để đánh giá khóa học!");

      return;
    }
    if (!courseProgress) {
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
          setHasRated(true);
          toast.success("Đánh giá của bạn đã được gửi!");
        }
      }
      await fetchStudentRating();
      closeRatingModal();
    } catch (error) {
      console.error("Lỗi khi xử lý đánh giá:", error);
      toast.error("Không thể xử lý đánh giá. Vui lòng thử lại!");
    } finally {
      setIsSubmittingRating(false);
    }
  };

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
        console.error("Không tìm thấy đánh giá:", error);
        setHasRated(false);
        setExistingRating(null);
      }
    }
  };

  //Handle resource
  const fetchLessons = async (
    studyPlanId: number,
    pageNo: number,
    direction: "prev" | "next" | "init" = "init",
  ) => {
    setIsLoadingLessonList(true);
    if (loadedLessons[pageNo]) {
      return;
    }

    try {
      const lessonResponse = await getLessonsByStudyPlan({
        token: session?.user.token as string,
        studyPlanId: studyPlanId,
        pageNo: pageNo,
        pageSize: 10,
        sortBy: "lessonOrder",
        sortDir: "asc",
      });

      setLoadedLessons((prevPages) => ({
        ...prevPages,
        [pageNo]: lessonResponse.content,
      }));

      if (direction === "init") {
        setLessonList(lessonResponse);
      } else {
        setLessonList((prev) => {
          const newContent =
            direction === "next"
              ? [...prev!.content, ...lessonResponse.content]
              : [...lessonResponse.content, ...prev!.content];

          return { ...lessonResponse, content: newContent };
        });
      }

      if (direction === "next") {
        setNextPageToLoad(pageNo + 1);
      } else {
        setPreviousPageToLoad(pageNo - 1);
      }
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải bài học", error);
    } finally {
      setIsLoadingLessonList(false);
    }
  };

  const handleChangeLR = async (
    type: string,
    learningResource: LessonResource,
  ) => {
    setCurrentContentType(type);
    setCurrentLessonResource(learningResource);
  };

  const fetchCurrentLesson = async () => {
    try {
      const resources = await getLessonResourceByLessonId(
        session?.user.token as string,
        Number(lessonId),
      );

      console.log("current lesson:", resources);

      setExpandedLessonId(Number(lessonId));
      setLessonResources((prev) => ({
        ...prev,
        [Number(lessonId)]: resources,
      }));

      if (resources && resources.length > 0) {
        let selectedLessonResource = resources
          .filter((resource) => resource.progressCompleted)
          .sort((a, b) => b.typeOrder - a.typeOrder)[0];

        if (!selectedLessonResource) {
          const resourceWithTypeOrder1 = resources.find(
            (resource) => resource.typeOrder === 1,
          );

          if (resourceWithTypeOrder1) {
            selectedLessonResource = resourceWithTypeOrder1;
          }
        }
        if (selectedLessonResource) {
          setCurrentLessonResource(selectedLessonResource);
          setCurrentContentType(selectedLessonResource.type);
        }
      }
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  };

  const fetchAllAvailableStudyPlan = async () => {
    try {
      const response = await getCourseAvailableStudyPlan(
        session?.user.token as string,
        courseId,
      );

      const activeStudyPlan = await getStudentActiveStudyPlan(
        session?.user.token as string,
        courseId,
      );

      const activePlan = response.find(
        (plan) => plan.studyPlanId === activeStudyPlan?.studyPlanId,
      );

      if (activePlan) {
        setActiveStudyPlan(activePlan);
        fetchLessons(activePlan.studyPlanId, initialPage, "init");
        console.log("activePlan", activePlan);
      }
      setAvailablesStudyPlans(response);
      console.log("Available Study Plans", response);
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải kế hoạch học", error);
    }
  };

  const toggleLessonResource = async (lessonId: number) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);

      return;
    }

    setExpandedLessonId(lessonId);

    if (lessonResources[lessonId]) return;

    setIsLoadingLR(true);

    try {
      const resources = await getLessonResourceByLessonId(
        session?.user.token as string,
        lessonId,
      );

      setLessonResources((prev) => ({
        ...prev,
        [lessonId]: Array.isArray(resources) ? resources : [],
      }));
      if (resources === null) {
        console.warn(`${lessonId} không có nội dung nào.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Tải dự liệu thất bại");
      setLessonResources((prev) => ({
        ...prev,
        [lessonId]: [],
      }));
    } finally {
      setIsLoadingLR(false);
    }
  };

  //Handle progress
  const handleTrackLearningResource = async (resourceId: number) => {
    const response = await trackLearningResource(
      resourceId,
      session?.user.token as string,
    );
  };

  const handleTrackFlashcardSet = async (setId: number) => {
    const response = await trackSystemSet(setId, session?.user.token as string);
  };

  const hanldeUpdateCompletedStatus = async (lessonReourceId: number) => {
    setLessonResources((prevResources) => {
      const updatedResources = { ...prevResources };

      for (const lessonId in updatedResources) {
        const resources = updatedResources[lessonId];
        const resourceIndex = resources.findIndex(
          (resource) => resource.lessonResourceId === lessonReourceId,
        );

        if (resourceIndex !== -1) {
          updatedResources[lessonId][resourceIndex].progressCompleted = true;
        }
      }

      return updatedResources;
    });
  };

  const updateLessonProgressIfCompleted = (lessonId: number) => {
    const resourcesOfCurrentLesson = lessonResources[lessonId];

    if (
      resourcesOfCurrentLesson &&
      resourcesOfCurrentLesson.length > 0 &&
      resourcesOfCurrentLesson.every((res) => res.progressCompleted)
    ) {
      setLessonList((prevList) => {
        if (!prevList) return prevList;

        const updatedContent = prevList.content.map((lesson) =>
          lesson.lessonId === lessonId
            ? { ...lesson, studentProgress: 100 }
            : lesson,
        );

        return {
          ...prevList,
          content: updatedContent,
        };
      });
    }
  };

  const hanldeCompleteLessonResource = async (
    type: string,
    lessonReourceId: number,
    entityId: number,
  ) => {
    try {
      hanldeUpdateCompletedStatus(lessonReourceId);
      updateLessonProgressIfCompleted(expandedLessonId!);
      if (type === "LearningResource") {
        await completeLearningResource(entityId, session?.user.token as string);
      }

      if (type === "FlashcardSet") {
        await completeSystemSet(entityId, session?.user.token as string);
      }

      const resources = await getLessonResourceByLessonId(
        session?.user.token as string,
        expandedLessonId!,
      );

      fetchProgress();
    } catch (error) {
      console.error(
        "Có lỗi xảy ra trong quá trình hoàn thành tài nguyên học",
        error,
      );
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchProgress(), fetchWithSubscriptionCheck()]);
      await Promise.all([fetchCurrentLesson(), fetchAllAvailableStudyPlan()]);
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const progress = await getAStudentCourseProgress(
        Number(session?.user.studentId),
        session?.user.token as string,
        courseId,
      );

      setCourseProgress(progress);
      if (progress.completionPercentage === 100) {
        setShowConfetti(true);
        setShowCongratulationDialog(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tiến trình", error);
      toast.error(
        "Có lỗi xảy ra trong quá trình tải khóa học hoặc bạn chưa đăng ký khóa học này",
      );
      router.push("/course");
    }
  };

  const fetchWithSubscriptionCheck = async () => {
    try {
      const hasSubscription = await getCurrentSubscription(
        session?.user.token as string,
      );

      if (!hasSubscription) {
        toast.error("Bạn cần đăng ký gói để tiếp tục.");
        router.push("/course");
      }
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình kiểm tra gói học", error);
      toast.error("Bạn cần đăng ký gói để tiếp tục.");
      router.push("/course");
    }
  };

  useEffect(() => {
    if (!session?.user.studentId || !session?.user.token) {
      return;
    }
    setIsLoading(true);
    const fetchByLessonId = async () => {
      await fetchData();
      await fetchStudentRating();
    };
    const fetchByLessonResourceId = async () => {
      try {
        await Promise.all([fetchProgress(), fetchWithSubscriptionCheck()]);
        await fetchAllAvailableStudyPlan();

        const resource = await getLessonResourceById(
          Number(lessonResourceId),
          session.user.token,
        );

        if (resource) {
          setCurrentLessonResource(resource);
          setCurrentContentType(resource.type);
        } else {
          toast.error("Không tìm thấy tài nguyên học.");
        }

        await fetchStudentRating();
      } catch (error) {
        console.error("Lỗi khi xử lý lessonResourceId", error);
        toast.error("Đã xảy ra lỗi khi tải tài nguyên học.");
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonResourceId) {
      fetchByLessonResourceId();
    } else {
      fetchByLessonId();
    }
  }, [
    session?.user.token,
    session?.user.studentId,
    courseId,
    lessonId,
    lessonResourceId,
  ]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row space-x-6 min-full">
      <div className="resource flex-1 h-min-screen overflow-y-auto">
        {showConfetti && (
          <Confetti
            colors={["#10B981", "#3B82F6", "#F59E0B", "#EF4444"]}
            gravity={0.2}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            width={window.innerWidth}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        <CongratulationDialog
          isOpen={showCongratulationDialog}
          onClose={() => setShowCongratulationDialog(false)}
          onOpenRating={() => {
            setShowCongratulationDialog(false);
            openRatingModal();
          }}
        />
        {currentContentType === "LearningResource" && (
          <DynamicLearningResource
            handleTrackLearningResource={handleTrackLearningResource}
            hanldeCompleteLessonResource={hanldeCompleteLessonResource}
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
        {currentContentType === "Quiz" && (
          <DynamicQuiz
            hanldeCompleteLessonResource={hanldeCompleteLessonResource}
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
        {currentContentType === "FlashcardSet" && (
          <DynamicFlashcardSet
            hanldeCompleteLessonResource={hanldeCompleteLessonResource}
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
      </div>
      <div className="lesson-list w-[450px] flex flex-col bg-white dark:bg-black py-4 px-6 space-y-6 sticky top-0 h-[calc(100vh-73px)]">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="font-bold text-lg text-primary">
            {activeStudyPlan?.title}
          </div>
          {availablesStudyPlans.length > 1 && activeStudyPlan && (
            <ChangeStudyPlanPopUp
              currentStudyPlanId={activeStudyPlan?.studyPlanId as number}
              fetchData={fetchData}
              studentId={Number(session?.user.studentId)}
              studyPlans={availablesStudyPlans}
              token={session?.user.token as string}
            />
          )}
        </div>
        <div className="w-full flex flex-row justify-between items-center space-x-2">
          <Progress value={courseProgress?.completionPercentage} />
          <span className="text-xs text-primary">
            {courseProgress?.completionPercentage}%
          </span>
        </div>
        {courseProgress?.completionPercentage === 100 && (
          <>
            <button
              className="w-full hover:scale-105 duration-300 text-orange-500 border-[1px] border-orange-500 rounded-lg p-2 hover:border-orange-400 hover:text-orange-400"
              onClick={openRatingModal}
            >
              {hasRated ? "Chỉnh sửa đánh giá" : "Đánh giá khóa học"} ★
            </button>
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
          </>
        )}
        <div className="w-full flex flex-col space-y-1 overflow-y-auto">
          {previousPageToLoad > 0 && (
            <div className="border-[1px] rounded-lg border-primary text-primary">
              <button
                className="w-full p-[10px]"
                disabled={isLoadingLessonList}
                onClick={() =>
                  fetchLessons(
                    activeStudyPlan?.studyPlanId as number,
                    previousPageToLoad,
                    "prev",
                  )
                }
              >
                {isLoadingLessonList ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Tải các bài học trước"
                )}
              </button>
            </div>
          )}
          {lessonList?.content.map((lesson) => (
            <div key={lesson.lessonId} className={`border-[1px] rounded-lg `}>
              <button
                className={`w-full p-[10px] flex flex-row justify-between`}
                onClick={() => toggleLessonResource(lesson.lessonId)}
              >
                <div className="flex flex-row space-x-2">
                  {lesson.studentProgress === 100 ? (
                    <CircleCheck className="text-green-500" />
                  ) : (
                    <CircleCheck className="text-slate-500" />
                  )}
                  <span
                    className={`text-xs font-bold ${lesson.lessonId === expandedLessonId ? "text-primary" : ""
                      }`}
                  >
                    {lesson.title}
                  </span>
                </div>
                {expandedLessonId === lesson.lessonId ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              {expandedLessonId === lesson.lessonId && (
                <>
                  <Separator />

                  {isLoadingLR ? (
                    <div className="w-full flex py-1 justify-center items-center">
                      <Loader2 className="animate-spin mx-auto" />
                    </div>
                  ) : (
                    lessonResources[lesson.lessonId]?.map((lessonResource) => (
                      <div
                        key={lessonResource.lessonResourceId}
                        className="w-full p-1"
                      >
                        <LessonResourceItem
                          currentLessonResource={currentLessonResource}
                          handleChangeLR={handleChangeLR}
                          handleTrackFlashcardSet={handleTrackFlashcardSet}
                          handleTrackLearningResource={
                            handleTrackLearningResource
                          }
                          lessonResource={lessonResource}
                        />
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          ))}
          {!lessonList?.last && (
            <div className="border-[1px] rounded-lg border-primary text-primary">
              <button
                className="w-full p-[10px]"
                disabled={isLoadingLessonList}
                onClick={() =>
                  fetchLessons(
                    activeStudyPlan?.studyPlanId as number,
                    nextPageToLoad,
                    "next",
                  )
                }
              >
                {isLoadingLessonList ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Tải các bài học tiếp theo"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
