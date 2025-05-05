interface Word {
    text: string;
    confidence: number;
    error_type: "perfect" | "good" | "poor" | "missing";
}

interface AnswerDisplayProps {
    words: Word[];
}

const getColorClass = (errorType: string) => {
    switch (errorType) {
        case "perfect":
            return " text-green-900"; // Chính xác
        case "good":
            return "text-green-700"; // Tốt
        case "poor":
            return " text-yellow-800"; // Tạm ổn
        case "missing":
            return "text-red-800"; // Sai
        default:
            return "text-gray-800"; // Mặc định
    }
};

const getTooltip = (errorType: string, confidence: number) => {
    switch (errorType) {
        case "perfect":
            return "Phát âm chính xác";
        case "good":
            return confidence >= 0.75 ? "Phát âm tốt" : "Phát âm tạm ổn";
        case "poor":
            return "Phát âm tạm ổn";
        case "missing":
            return "Phát âm sai hoặc thiếu";
        default:
            return "Không có thông tin";
    }
};

const AnswerDisplay = ({ words }: AnswerDisplayProps) => {
    return (
        <div className="flex flex-wrap gap-1 justify-center">
            {words.map((word, idx) => (
                <div
                    key={idx}
                    className={`relative group p-2 rounded-2xl font-semibold ${getColorClass(word.error_type)}`}
                >
                    {word.text}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {getTooltip(word.error_type, word.confidence)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnswerDisplay;
