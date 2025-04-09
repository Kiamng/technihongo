import { QuizContainer } from "../../quiz/_components/QuizContainer";

import { LessonResource } from "@/types/lesson-resource";
import { QuizData } from "@/types/quiz";

interface DynamicQuizProps {
    lessonResource: LessonResource;
    token: string;
    hanldeUpdateCompletedStatus: (lessonReourceId: number) => void;
}

const DynamicQuiz = ({
    lessonResource,
    token,
    hanldeUpdateCompletedStatus,
}: DynamicQuizProps) => {
    return (
        <QuizContainer
            hanldeUpdateCompletedStatus={hanldeUpdateCompletedStatus}
            lessonResourceId={lessonResource.lessonResourceId}
            quizData={lessonResource.quiz as unknown as QuizData}
        />
    );
};

export default DynamicQuiz;
