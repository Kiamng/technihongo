interface Word {
    text: string;
    confidence: number;
}

interface AnswerDisplayProps {
    words: Word[];
}

const getColorClass = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-500";
    if (confidence >= 0.6) return "text-yellow-500";

    return "text-red-500";
};

export default function AnswerDisplay({ words }: AnswerDisplayProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {words.map((word, idx) => (
                <div
                    key={idx}
                    className={`relative group ${getColorClass(word.confidence)}`}
                >
                    {word.text}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {Math.round(word.confidence * 100)}% chính xác
                    </div>
                </div>
            ))}
        </div>
    );
}
