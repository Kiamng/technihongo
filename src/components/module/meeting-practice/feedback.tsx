"use client";

interface WordResult {
    text: string;
    confidence: number;
    error_type: "perfect" | "good" | "poor" | "missing";
}

interface PronunciationWordListProps {
    words: WordResult[];
}

const FeedbackDisplay = ({ words }: PronunciationWordListProps) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center text-lg">
            {words.map((word, idx) => {
                let bgClass = "";
                let textClass = "";
                let tooltip = "";

                switch (word.error_type) {
                    case "perfect":
                        bgClass = "bg-green-300";
                        textClass = "text-green-900";
                        tooltip = "Phát âm chính xác";
                        break;
                    case "good":
                        bgClass = "bg-green-100";
                        textClass = "text-green-700";
                        tooltip = "Phát âm tốt";
                        break;
                    case "poor":
                        bgClass = "bg-yellow-100";
                        textClass = "text-yellow-800";
                        tooltip = "Phát âm tạm ổn";
                        break;
                    case "missing":
                    default:
                        bgClass = "bg-red-200";
                        textClass = "text-red-800";
                        tooltip = "Thiếu hoặc phát âm sai";
                        break;
                }

                return (
                    <div
                        key={idx}
                        className={`relative group px-4 py-2 rounded-2xl font-semibold ${bgClass} ${textClass}`}
                    >
                        {word.text}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {tooltip}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FeedbackDisplay;
