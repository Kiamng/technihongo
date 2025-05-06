import AnswerDisplay from "./answer-display";

import { Separator } from "@/components/ui/separator";
import { Script } from "@/types/meeting";

interface SummaryComponentProps {
    scripts: Script[];
    scores: { [key: string]: number };
    wordResults: {
        [key: string]: {
            text: string;
            confidence: number;
            error_type: "perfect" | "good" | "poor" | "missing";
        }[];
    };
}

export default function SummaryComponent({
    scripts,
    scores,
    wordResults,
}: SummaryComponentProps) {
    const averageScore =
        Object.values(scores).reduce((a, b) => a + b, 0) /
        Object.keys(scores).length;

    // Calculate progress circle dimensions
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (averageScore / 100) * circumference;

    // Find the best score
    const bestScore = Math.max(...Object.values(scores));

    return (
        <div className="w-full flex flex-col space-y-8 p-4 bg-white dark:bg-black rounded-2xl">
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold">Tổng kết buổi luyện tập</h2>
                <div className="flex flex-col items-center space-y-2">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                fill="none"
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth="10"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                fill="none"
                                r={radius}
                                stroke={averageScore >= 80 ? "#10B981" : "#EF4444"}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                strokeWidth="10"
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                                {averageScore.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        Đánh giá trung bình
                    </p>
                </div>
            </div>
            <Separator />

            <div className="flex flex-col space-y-6">
                {scripts.map((script, index) => (
                    <div key={index} className="flex flex-col space-y-4">
                        {/* Question bubble */}
                        <div className="flex items-start space-x-2">
                            <div className="relative bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded-2xl text-xl max-w-[80%] shadow-sm">
                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-100 dark:bg-gray-800 transform rotate-45" />
                                {script.question}
                                {script.questionExplain && (
                                    <div className="text-base text-gray-500 dark:text-gray-400 mt-2">
                                        {script.questionExplain}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Answer bubble */}
                        <div className="flex justify-end">
                            <div className="flex flex-col items-end space-y-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Độ chính xác: {scores[script.scriptId]?.toFixed(1) || 0}%
                                    {scores[script.scriptId] === bestScore && (
                                        <span className="ml-2 text-green-600 dark:text-green-400">
                                            (Câu phát âm tốt nhất)
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`${scores[script.scriptId] === bestScore ? "border-green-500 border-[2px]" : "border-[1px]"} relative  bg-white shadow-lg dark:bg-secondary text-black dark:text-white p-4 rounded-2xl text-xl font-medium max-w-[80%]`}
                                >
                                    <div className="absolute -right-2 top-4 w-4 h-4 transform rotate-45" />
                                    <AnswerDisplay
                                        answerExplain={script.answerExplain}
                                        words={wordResults[script.scriptId] || []}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
