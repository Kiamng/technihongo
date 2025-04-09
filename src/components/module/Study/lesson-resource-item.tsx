import { Youtube, BookOpenCheck, Copy, CircleCheck } from "lucide-react";

import { LessonResource } from "@/types/lesson-resource";

interface LessonResourceListProps {
  lessonResource: LessonResource;
  handleChangeLR: (
    type: string,
    learningResource: LessonResource,
  ) => Promise<void>;
  handleTrackLearningResource: (resourceId: number) => Promise<void>;
}

// Mapping giữa type và thuộc tính tương ứng
const resourceTypeConfig = {
  LearningResource: {
    color: "#FD5673",
    icon: Youtube,
    getTitle: (res: LessonResource) => res.learningResource?.title,
    editLink: (res: LessonResource, studyPlanId: number) =>
      `${studyPlanId}/edit-lesson-resource/learning-resource/${res.learningResource?.resourceId}`,
  },
  Quiz: {
    color: "#FFB600",
    icon: BookOpenCheck,
    getTitle: (res: LessonResource) => res.quiz?.title,
    editLink: (res: LessonResource, studyPlanId: number) =>
      `${studyPlanId}/edit-lesson-resource/quiz/${res.quiz?.quizId}`,
  },

  FlashcardSet: {
    color: "#3AC6C6",
    icon: Copy,
    getTitle: (res: LessonResource) => res.systemFlashCardSet?.title,
    editLink: (res: LessonResource, studyPlanId: number) =>
      `${studyPlanId}/edit-lesson-resource/flashcard-set/${res.systemFlashCardSet?.systemSetId}`,
  },
};

const LessonResourceItem = ({
  lessonResource,
  handleChangeLR,
  handleTrackLearningResource,
}: LessonResourceListProps) => {
  const resource = resourceTypeConfig[lessonResource.type];

  const handleTrack = async () => {
    if (lessonResource.type === "LearningResource") {
      await handleTrackLearningResource(
        lessonResource.learningResource?.resourceId as number,
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
    <>
      <button
        className="p-2 flex justify-between items-center hover:bg-slate-50 rounded-2xl w-full"
        onClick={() => {
          handleChangeLR(lessonResource.type, lessonResource);
          handleTrack();
        }}
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
    </>
  );
};

export default LessonResourceItem;
