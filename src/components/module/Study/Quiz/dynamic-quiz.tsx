import { QuizContainer } from "../../quiz/_components/QuizContainer";

import { LessonResource } from "@/types/lesson-resource";
import { QuizData } from "@/types/quiz";

interface DynamicQuizProps {
  lessonResource: LessonResource;
  token: string;
  hanldeCompleteLessonResource: (
    type: string,
    lessonReourceId: number,
    entityId: number,
  ) => Promise<void>;
}

const DynamicQuiz = ({
  lessonResource,
  token,
  hanldeCompleteLessonResource,
}: DynamicQuizProps) => {
  return (
    <QuizContainer
      hanldeCompleteLessonResource={hanldeCompleteLessonResource}
      lessonResourceId={lessonResource.lessonResourceId}
      quizData={lessonResource.quiz as unknown as QuizData}
    />
  );
};

export default DynamicQuiz;
