import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Heart, HeartOff, LoaderCircle } from "lucide-react";

import LearningResourceTabs from "./tabs";
import QuickAddPopup from "./import-flashcard";

import { Button } from "@/components/ui/button";
import {
  checkSaveLearningResource,
  saveLearningResource,
  unSaveLearningResource,
} from "@/app/api/learning-resource/learning-resource.api";
import { LessonResource } from "@/types/lesson-resource";
import { trackStudentStudyTime } from "@/app/api/lesson/lesson.api";
import { extractCloudinaryPublicId } from "@/app/api/video/video.api";

interface DynamicLearningResourceProps {
  handleTrackLearningResource: (resourceId: number) => Promise<void>;
  lessonResource: LessonResource;
  token: string;
  hanldeCompleteLessonResource: (
    type: string,
    lessonReourceId: number,
    resourceId: number,
  ) => Promise<void>;
}

const DynamicLearningResource = ({
  lessonResource,
  token,
  hanldeCompleteLessonResource,
  handleTrackLearningResource,
}: DynamicLearningResourceProps) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const totalWatchedTime = useRef<number>(0);
  const lastUpdateTime = useRef<number>(0);
  const videoPublicId = extractCloudinaryPublicId(
    lessonResource.learningResource?.videoUrl as string,
  );
  const pdfPublicId = extractCloudinaryPublicId(
    lessonResource.learningResource?.pdfUrl as string,
  );

  useEffect(() => {
    const checkSave = async () => {
      const response = await checkSaveLearningResource(
        lessonResource.lessonResourceId as number,
        token,
      );

      setIsSaved(response);
    };

    checkSave();
  }, [lessonResource.learningResource?.resourceId, token]);

  const hanldeSave = async () => {
    startTransition(async () => {
      const response = await saveLearningResource(
        lessonResource.lessonResourceId as number,
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
        lessonResource.lessonResourceId as number,
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

  const handleVideoEnded = () => {
    const duration = videoRef.current?.duration ?? 0;
    const watched = totalWatchedTime.current;

    if (watched >= duration) {
      const roundedMinutes =
        duration % 60 >= 50
          ? Math.floor(duration / 60) + 1
          : Math.floor(duration / 60);

      trackStudentStudyTime(roundedMinutes, token);

      if (!lessonResource.progressCompleted) {
        hanldeCompleteLessonResource(
          "LearningResource",
          lessonResource.lessonResourceId,
          lessonResource.learningResource?.resourceId as number,
        );
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    const now = videoElement.currentTime;

    if (Math.abs(now - lastUpdateTime.current) < 1.5) {
      totalWatchedTime.current += now - lastUpdateTime.current;
    }

    lastUpdateTime.current = now;

    const duration = videoElement.duration;
    const percentageWatched = (now / duration) * 100;

    if (percentageWatched >= 10 && lessonResource.progressCompleted === false) {
      handleTrackLearningResource(
        lessonResource.learningResource?.resourceId as number,
      );
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 bg-white dark:bg-black  p-4">
      {lessonResource.learningResource && token && (
        <div className="relative w-full h-0 pb-[56.25%] bg-black">
          {/* eslint-disable jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            controls
            disablePictureInPicture
            className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
            controlsList="nodownload"
            preload="auto"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleVideoTimeUpdate}
          >
            <source
              src={`/api/video?publicId=${encodeURIComponent(videoPublicId as string)}`}
              type="video/mp4"
            />
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
                  <span>Bỏ thích </span>
                  <HeartOff />
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
                  <span>Yêu thích </span> <Heart />
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
        pdfPublicId={pdfPublicId as string}
        resourceId={lessonResource.learningResource?.resourceId as number}
        token={token}
      />
    </div>
  );
};

export default DynamicLearningResource;
