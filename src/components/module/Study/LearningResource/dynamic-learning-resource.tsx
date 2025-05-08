import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Heart,
  HeartOff,
  LoaderCircle,
  Play,
  Pause,
  Volume2,
  Maximize,
  Minimize,
} from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const totalWatchedTime = useRef<number>(0);
  const lastUpdateTime = useRef<number>(0);

  const videoPublicId = extractCloudinaryPublicId(
    lessonResource.learningResource?.videoUrl as string,
  );
  const pdfPublicId = extractCloudinaryPublicId(
    lessonResource.learningResource?.pdfUrl as string,
  );

  // Kiểm tra trạng thái lưu tài nguyên
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

  // Tạo và quản lý video element động
  useEffect(() => {
    const video = document.createElement("video");

    video.src = `/api/video?publicId=${encodeURIComponent(videoPublicId as string)}`;
    video.preload = "auto";
    video.style.display = "none";
    video.hidden = true;
    video.disablePictureInPicture = true;
    (video as any).controlsList = "nodownload";

    document.body.appendChild(video);
    videoRef.current = video;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const renderFrame = () => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended
      ) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(renderFrame);
      }
    };

    video.addEventListener("loadedmetadata", () => {
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
      }
    });

    video.addEventListener("play", () => {
      setIsPlaying(true);
      renderFrame();
    });

    video.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    video.addEventListener("timeupdate", () => {
      if (videoRef.current) {
        setProgress(
          (videoRef.current.currentTime / videoRef.current.duration) * 100,
        );
      }
    });

    video.addEventListener("ended", handleVideoEnded);
    video.addEventListener("timeupdate", handleVideoTimeUpdate);

    return () => {
      video.remove();
      video.removeEventListener("play", renderFrame);
      video.removeEventListener("pause", () => { });
      video.removeEventListener("timeupdate", () => { });
      video.removeEventListener("ended", handleVideoEnded);
      video.removeEventListener("timeupdate", handleVideoTimeUpdate);
    };
  }, [videoPublicId]);

  // Xử lý play/pause khi click vào canvas
  const handleCanvasClick = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      video.play().catch((e) => console.error("Play failed:", e));
    } else {
      video.pause();
    }
  };

  // Xử lý full-screen
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Xử lý tốc độ phát
  const handlePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Xử lý âm lượng
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Xử lý tiến trình video
  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime =
      (parseFloat(e.target.value) / 100) * videoRef.current.duration;

    videoRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  // Xử lý lưu tài nguyên
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

  // Xử lý bỏ lưu tài nguyên
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

  // Xử lý khi video kết thúc
  const handleVideoEnded = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
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

  // Theo dõi tiến trình xem video
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
    <div className="w-full flex flex-col space-y-6 bg-white dark:bg-black p-4">
      {lessonResource.learningResource && token && (
        <div
          ref={containerRef}
          className="relative w-full h-0 pb-[56.25%] bg-black"
        >
          {/* Canvas hiển thị video */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-contain rounded-xl cursor-pointer"
            style={{ pointerEvents: "auto" }}
            onClick={handleCanvasClick}
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Thanh điều khiển tùy chỉnh - Một hàng ngang */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 flex flex-row items-center justify-between space-x-2">
            <Button
              className="text-white hover:bg-gray-700"
              size="sm"
              variant="ghost"
              onClick={handleCanvasClick}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <input
              className="flex-1 h-1 bg-gray-500 rounded-full cursor-pointer"
              max="100"
              min="0"
              type="range"
              value={progress}
              onChange={handleProgress}
            />
            <div className="flex flex-row items-center space-x-2">
              <Volume2 className="text-white" size={20} />
              <input
                className="w-16 h-1 bg-gray-500 rounded-full cursor-pointer"
                max="1"
                min="0"
                step="0.1"
                type="range"
                value={volume}
                onChange={handleVolume}
              />
            </div>
            <select
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 focus:outline-none"
              value={playbackRate}
              onChange={(e) => handlePlaybackRate(parseFloat(e.target.value))}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            <Button
              className="text-white hover:bg-gray-700"
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
          </div>
        </div>
      )}
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="text-lg font-bold text-primary">
          {lessonResource.learningResource?.title}
        </h1>
        <div className="flex flex-row space-x-4">
          {isSaved ? (
            <Button
              className="rounded-full border-red-400 bg-red-400 text-red-400 bg-opacity-10"
              disabled={isLoading}
              size="sm"
              variant="outline"
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
              className="rounded-full"
              disabled={isLoading}
              size="sm"
              variant="outline"
              onClick={hanldeSave}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <span>Yêu thích </span>
                  <Heart />
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
