import { Button } from "@/components/ui/button";
import { QuizAttemptStatusResponse, QuizData } from "@/types/quiz";

interface QuizInformationProps {
    quizData: QuizData;
    handleStartQuiz: () => void;
    quizAttemptStatus: QuizAttemptStatusResponse;
}

const QuizInformation = ({
    quizData,
    handleStartQuiz,
    quizAttemptStatus,
}: QuizInformationProps) => {
    return (
        <div className="max-w-3xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-[#57D061] p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">{quizData.title}</h1>
                    <p className="text-green-50 opacity-90">
                        Chuẩn bị sẵn sàng cho bài kiểm tra
                    </p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <h3 className="font-semibold text-gray-800">Số câu hỏi</h3>
                            </div>
                            <p className="text-2xl font-bold text-[#57D061]">
                                {quizData.totalQuestions}
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <h3 className="font-semibold text-gray-800">Điểm cần đạt</h3>
                            </div>
                            <p className="text-2xl font-bold text-[#57D061]">
                                {quizData.passingScore * 10}
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <h3 className="font-semibold text-gray-800">Thời gian</h3>
                            </div>
                            <p className="text-2xl font-bold text-[#57D061]">
                                {quizData.timeLimit} phút
                            </p>
                        </div>
                        {quizAttemptStatus && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="flex items-center mb-2">
                                    <svg
                                        className="h-5 w-5 text-[#57D061] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                    <h3 className="font-semibold text-gray-800">
                                        Số lần làm bài còn lại
                                    </h3>
                                </div>
                                <p className="text-2xl font-bold text-[#57D061]">
                                    {quizAttemptStatus.remainingAttempts}/3 lần
                                </p>
                                {quizAttemptStatus.remainingWaitTime !== 0 && (
                                    <p className="text-2xl font-bold text-[#57D061]">
                                        {quizAttemptStatus.remainingWaitTime} phút
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                        <ul className="text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 13l4 4L19 7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Đọc kỹ câu hỏi trước khi trả lời</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 13l4 4L19 7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Kiểm tra lại tất cả câu trả lời trước khi nộp bài</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-5 w-5 text-[#57D061] mr-2 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 13l4 4L19 7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Bạn có thể quay lại các câu hỏi trước đó để sửa đổi</span>
                            </li>
                        </ul>
                    </div>
                    {quizAttemptStatus && (
                        <div className="flex justify-center">
                            <Button
                                className="bg-[#57D061] hover:bg-[#4AB950] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                                disabled={quizAttemptStatus.remainingAttempts === 0}
                                onClick={handleStartQuiz}
                            >
                                <svg
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                    <path
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                Bắt đầu làm quiz
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizInformation;
