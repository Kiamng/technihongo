"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

import LessonResourceItem from "./lesson-resource-item";
import DynamicLearningResource from "./LearningResource/dynamic-learning-resource";
import DynamicQuiz from "./Quiz/dynamic-quiz";
import DynamicFlashcardSet from "./Flashcard/dynamic-flashcard-set";

import { CourseProgress } from "@/types/course";
import { StudyPlan } from "@/types/study-plan";
import { getAStudentCourseProgress } from "@/app/api/course/course.api";
import {
  getCourseAvailableStudyPlan,
  getStudentActiveStudyPlan,
} from "@/app/api/StudyPlan/study-plan.api";
import { Lesson } from "@/types/lesson";
import { getLessonsByStudyPlan } from "@/app/api/lesson/lesson.api";
import {
  completeLessonResource,
  getLessonResourceByLessonId,
  trackLearningResource,
} from "@/app/api/lesson-resource/lesson-resource.api";
import { LessonResource } from "@/types/lesson-resource";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function StudyModule() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isLoadingLR, setIsLoadingLR] = useState<boolean>(false);
  const { data: session } = useSession();
  const [courseProgress, setCourseProgress] = useState<CourseProgress>();
  const [activeStudyPlan, setActiveStudyPlan] = useState<StudyPlan>();
  const [availableStudyPlans, setAvailablesStudyPlans] = useState<StudyPlan[]>(
    [],
  );
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>([]);

  const [currentContentType, setCurrentContentType] = useState<string>("");
  const [currentLessonResource, setCurrentLessonResource] =
    useState<LessonResource>();

  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const [lessonResources, setLessonResources] = useState<
    Record<number, LessonResource[]>
  >({});

  const fetchLessons = async (studyPlanId: number) => {
    try {
      const lessonResponse = await getLessonsByStudyPlan({
        token: session?.user.token as string,
        studyPlanId: studyPlanId,
        pageNo: 0,
        pageSize: 20,
        sortBy: "lessonOrder",
        sortDir: "asc",
      });

      setCurrentLessons(lessonResponse.content);
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải bài học", error);
    }
  };

  const handleChangeLR = async (
    type: string,
    learningResource: LessonResource,
  ) => {
    setCurrentContentType(type);
    setCurrentLessonResource(learningResource);
  };

  const fetchProgress = async () => {
    try {
      const response = await getAStudentCourseProgress(
        Number(session?.user.studentId),
        session?.user.token as string,
        courseId,
      );

      console.log("lessonId : ", response.currentLesson.lessonId);
      setCourseProgress(response);
      if (response.currentLesson) {
        await toggleLessonResource(response.currentLesson.lessonId);

        const lessonId = response.currentLesson.lessonId;
        let lessonResourceList = lessonResources[lessonId];

        console.log("lessonResourceList : ", lessonResourceList);
        let selectedLessonResource = lessonResourceList
          ?.filter((resource) => resource.progressCompleted)
          .sort((a, b) => b.typeOrder - a.typeOrder)[0];

        if (!selectedLessonResource) {
          const resourceWithTypeOrder1 = lessonResourceList?.find(
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
      console.log("Có lỗi xảy ra trong quá trình tải khóa học", error);
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
        setActiveStudyPlan(activePlan); // Lưu active plan vào state
      }

      setAvailablesStudyPlans(response); // Cập nhật availableStudyPlans sau khi đã tìm được activePlan
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

      console.log("resources : ", resources);
      setLessonResources((prev) => ({
        ...prev,
        [lessonId]: Array.isArray(resources) ? resources : [],
      }));
      if (resources === null) {
        console.warn(`Lesson ${lessonId} has no resources.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lesson resource.");
      setLessonResources((prev) => ({
        ...prev,
        [lessonId]: [],
      }));
    } finally {
      setIsLoadingLR(false);
    }
  };

  const handleTrackLearningResource = async (resourceId: number) => {
    const response = await trackLearningResource(
      resourceId,
      session?.user.token as string,
    );
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

  const hanldeCompleteLessonResource = async (
    lessonReourceId: number,
    resourceId: number,
  ) => {
    try {
      hanldeUpdateCompletedStatus(lessonReourceId);

      await completeLessonResource(resourceId, session?.user.token as string);
    } catch (error) {
      console.error(
        "Có lỗi xảy ra trong quá trình hoàn thành tài nguyên học",
        error,
      );
    }
  };

  useEffect(() => {
    if (!session?.user.studentId || !session?.user.token) {
      return;
    }
    setIsloading(true);
    const fetchData = async () => {
      try {
        await Promise.all([fetchProgress(), fetchAllAvailableStudyPlan()]);
      } catch (error) {
        console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [session?.user.token, session?.user.studentId, courseId]);

  useEffect(() => {
    if (activeStudyPlan?.studyPlanId) {
      fetchLessons(activeStudyPlan.studyPlanId);
    }
  }, [activeStudyPlan]);

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
        {currentContentType === "LearningResource" && (
          <DynamicLearningResource
            handleCompleteLessonResource={hanldeCompleteLessonResource}
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
        {currentContentType === "Quiz" && (
          <DynamicQuiz
            hanldeUpdateCompletedStatus={hanldeUpdateCompletedStatus}
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
        {currentContentType === "FlashcardSet" && (
          <DynamicFlashcardSet
            lessonResource={currentLessonResource!}
            token={session?.user.token as string}
          />
        )}
      </div>
      <div className="lesson-list w-[450px] flex flex-col bg-white dark:bg-black p-4 space-y-6 sticky top-0 h-[calc(100vh-73px)]">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="font-bold text-lg text-primary">
            {activeStudyPlan?.title}
          </div>
          <Button size={"sm"} variant={"outline"}>
            Thay đổi
          </Button>
        </div>
        <div className="w-full flex flex-col space-y-1 overflow-y-auto">
          {currentLessons.map((lesson) => (
            <div key={lesson.lessonId} className="border-[1px] rounded-lg">
              <button
                className={`w-full p-[10px] flex flex-row justify-between`}
                onClick={() => toggleLessonResource(lesson.lessonId)}
              >
                <span
                  className={`text-xs font-bold ${expandedLessonId === lesson.lessonId ? "text-primary" : ""}`}
                >
                  {lesson.title}
                </span>
                {expandedLessonId === lesson.lessonId ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              {expandedLessonId === lesson.lessonId && (
                <>
                  <Separator />
                  <div className="w-full">
                    {isLoadingLR ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      lessonResources[lesson.lessonId]?.map(
                        (lessonResource) => (
                          <LessonResourceItem
                            key={lessonResource.lessonResourceId}
                            handleChangeLR={handleChangeLR}
                            handleTrackLearningResource={
                              handleTrackLearningResource
                            }
                            lessonResource={lessonResource}
                          />
                        ),
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
