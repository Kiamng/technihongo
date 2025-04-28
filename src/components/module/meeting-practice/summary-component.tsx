import AnswerDisplay from "./answer-display";

import { Script } from "@/types/meeting";

interface SummaryComponentProps {
    scripts: Script[];
    scores: { [key: string]: number };
    wordResults: { [key: string]: { text: string; confidence: number }[] };
}

export default function SummaryComponent({
    scripts,
    scores,
    wordResults,
}: SummaryComponentProps) {
    const averageScore =
        Object.values(scores).reduce((a, b) => a + b, 0) /
        Object.keys(scores).length;

    return (
        <div className="w-full flex flex-col space-y-8 p-4 bg-white dark:bg-black rounded-2xl">
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold">Tổng kết buổi luyện tập</h2>
                <div className="text-4xl font-bold text-primary">
                    {averageScore.toFixed(1)}%
                </div>
            </div>

            <div className="flex flex-col space-y-6">
                {scripts.map((script, index) => (
                    <div key={index} className="flex flex-col space-y-4">
                        {/* Question bubble */}
                        <div className="flex items-start space-x-2">
                            <div className="relative bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded-2xl text-lg max-w-[80%] shadow-sm">
                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-100 dark:bg-gray-800 transform rotate-45" />
                                {script.question}
                            </div>
                        </div>

                        {/* Answer bubble */}
                        <div className="flex justify-end">
                            <div className="flex flex-col items-end space-y-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Độ chính xác: {scores[script.scriptId]?.toFixed(1) || 0}%
                                </div>
                                <div className="relative bg-green-50 dark:bg-secondary text-black dark:text-white p-4 rounded-2xl text-md font-medium max-w-[80%] shadow-sm">
                                    <div className="absolute -right-2 top-4 w-4 h-4 bg-green-50 dark:bg-secondary transform rotate-45" />
                                    <AnswerDisplay words={wordResults[script.scriptId] || []} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
