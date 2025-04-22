import { Youtube, BookOpenCheck, Copy, CircleCheck } from "lucide-react";

import { LessonResource } from "@/types/lesson-resource";
import { useQuiz } from "@/components/core/common/providers/quiz-provider";

interface LessonResourceListProps {
  lessonResource: LessonResource;
  handleChangeLR: (
    type: string,
    learningResource: LessonResource,
  ) => Promise<void>;
  handleTrackLearningResource: (resourceId: number) => Promise<void>;
  handleTrackFlashcardSet: (setId: number) => Promise<void>;
}

// Mapping giữa type và thuộc tính tương ứng
const resourceTypeConfig = {
  LearningResource: {
    color: "#FD5673",
    icon: Youtube,
    getTitle: (res: LessonResource) => res.learningResource?.title,
  },
  Quiz: {
    color: "#FFB600",
    icon: BookOpenCheck,
    getTitle: (res: LessonResource) => res.quiz?.title,
  },

  FlashcardSet: {
    color: "#3AC6C6",
    icon: Copy,
    getTitle: (res: LessonResource) => res.systemFlashCardSet?.title,
  },
};

const LessonResourceItem = ({
  lessonResource,
  handleChangeLR,
  handleTrackLearningResource,
  handleTrackFlashcardSet,
}: LessonResourceListProps) => {
  const resource = resourceTypeConfig[lessonResource.type];
  const { isQuizStarted, isSubmitted } = useQuiz();

  const handleLinkClick = () => {
    if (isQuizStarted && !isSubmitted) {
      alert("Hãy hoàn thành bài kiểm tra của mình !");
    } else {
      handleChangeLR(lessonResource.type, lessonResource);
      handleTrack();
    }
  };

  const handleTrack = async () => {
    if (lessonResource.type === "LearningResource") {
      await handleTrackLearningResource(
        lessonResource.learningResource?.resourceId as number,
      );
    }

    if (lessonResource.type === "FlashcardSet") {
      await handleTrackFlashcardSet(
        lessonResource.systemFlashCardSet?.systemSetId as number,
      );
    }
  };

  if (!resource) {
    console.error(`Unsupported lesson resource type: ${lessonResource.type}`);

    return null;
  }

  const { color, icon: Icon, getTitle } = resource;
  const title = getTitle(lessonResource) || "Untitled";

  return (
    <button
      className="p-2 flex justify-between items-center hover:bg-green-50 rounded-2xl w-full dark:hover:bg-secondary duration-300 hover:transform hover:translate-y-[-2px]"
      onClick={handleLinkClick}
    >
      <div className="flex items-center space-x-3 text-sm font-bold">
        <div
          className="p-[4px] rounded-full"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon size={16} />
        </div>
        <span>{title}</span>
      </div>

      {lessonResource.progressCompleted ? (
        <CircleCheck className="text-green-500" />
      ) : (
        <CircleCheck className="text-slate-500" />
      )}
    </button>
  );
};

export default LessonResourceItem;
