import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import LearningResourceTabs from "./tabs";
import QuickAddPopup from "./import-flashcard";

import { Button } from "@/components/ui/button";
import {
  checkSaveLearningResource,
  saveLearningResource,
  unSaveLearningResource,
} from "@/app/api/learning-resource/learning-resource.api";
import { LessonResource } from "@/types/lesson-resource";

interface DynamicLearningResourceProps {
  lessonResource: LessonResource;
  token: string;
  handleCompleteLessonResource: (
    lessonReourceId: number,
    resourceId: number,
  ) => Promise<void>;
}

const DynamicLearningResource = ({
  lessonResource,
  token,
  handleCompleteLessonResource,
}: DynamicLearningResourceProps) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    const checkSave = async () => {
      const response = await checkSaveLearningResource(
        lessonResource.learningResource?.resourceId as number,
        token,
      );

      setIsSaved(response);
    };

    checkSave();
  }, [lessonResource.learningResource?.resourceId, token]);

  const hanldeSave = async () => {
    startTransition(async () => {
      const response = await saveLearningResource(
        lessonResource.learningResource?.resourceId as number,
        token,
      );

      if (response.success === true) {
        setIsSaved(true);
        toast.success("Đã thích bài học");
      } else {
        toast.error("Thích bài học thất bại");
        console.log(response);
      }
    });
  };

  const hanldeUnSave = async () => {
    startTransition(async () => {
      const response = await unSaveLearningResource(
        lessonResource.learningResource?.resourceId as number,
        token,
      );

      if (response.success === true) {
        setIsSaved(false);
        toast.success("Đã bỏ thích bài học");
      } else {
        toast.error("Bỏ thích bài học thất bại");
        console.log(response);
      }
    });
  };

  const handleVideoTimeUpdate = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const videoElement = e.target as HTMLVideoElement;
    const percentageWatched =
      (videoElement.currentTime / videoElement.duration) * 100;

    if (percentageWatched >= 90 && !isFinish) {
      handleCompleteLessonResource(
        lessonResource.lessonResourceId,
        lessonResource.learningResource?.resourceId as number,
      );
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 bg-white dark:bg-black  p-4">
      {lessonResource.learningResource && (
        <div className="relative w-full h-0 pb-[56.25%] bg-black">
          {/* eslint-disable jsx-a11y/media-has-caption */}
          <video
            controls
            className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
            onTimeUpdate={handleVideoTimeUpdate}
          >
            {/* Cung cấp video MP4 đầu tiên */}
            <source
              src={lessonResource.learningResource.videoUrl}
              type="video/mp4"
            />
            {/* Nếu video không phải MP4, thử WebM */}
            <source
              src={lessonResource.learningResource.videoUrl.replace(
                ".mp4",
                ".webm",
              )}
              type="video/webm"
            />
            {/* Nếu video không phải MP4/WebM, thử OGG */}
            <source
              src={lessonResource.learningResource.videoUrl.replace(
                ".mp4",
                ".ogv",
              )}
              type="video/ogg"
            />
            {/* Thông báo lỗi nếu trình duyệt không hỗ trợ video */}
          </video>
          {/* eslint-disable jsx-a11y/media-has-caption */}
        </div>
      )}
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-lg font-bold text-primary">
          {lessonResource.learningResource?.title}
        </h1>
        <div className="flex flex-row space-x-4">
          {isSaved ? (
            <Button
              className={`rounded-full border-red-400 bg-red-400 text-red-400 bg-opacity-10`}
              disabled={isLoading}
              size={"sm"}
              variant={"outline"}
              onClick={hanldeUnSave}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <span>Đã thích</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              className={`rounded-full`}
              disabled={isLoading}
              size={"sm"}
              variant={"outline"}
              onClick={hanldeSave}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <span>Yêu thích</span>
                </>
              )}
            </Button>
          )}
          <QuickAddPopup
            learningResourceId={
              lessonResource.learningResource?.resourceId as number
            }
            token={token}
          />
        </div>
      </div>
      <LearningResourceTabs
        pdfUrl={lessonResource.learningResource?.pdfUrl as string}
        resourceId={lessonResource.learningResource?.resourceId as number}
        token={token}
      />
    </div>
  );
};

export default DynamicLearningResource;
