"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Script = {
    order: number;
    question: string;
    answer: string;
};

const dialogue: Script[] = [
    {
        order: 1,
        question: "おはようございます。今日の進捗はどうですか？",
        answer:
            "おはようございます。現在の進捗は、タスクAが完了し、タスクBはまだ進行中です。",
    },
    {
        order: 2,
        question: "タスクBの進捗に何か問題はありますか？",
        answer: "はい、タスクBに関して、サーバーの接続に問題があり、遅れています。",
    },
    {
        order: 3,
        question: "その問題を解決するために何かできますか？",
        answer:
            "現在、チームメンバーがサーバー側の問題を調査しています。おそらく、明日には解決できると思います。",
    },
    {
        order: 4,
        question: "今週の目標は何ですか？",
        answer: "今週の目標は、タスクBを完了し、タスクCの開始です。",
    },
    {
        order: 5,
        question: "タスクCについて何か準備が必要ですか？",
        answer:
            "タスクCは、新しいフレームワークを使用するので、ドキュメントの確認とチームメンバーへの簡単なトレーニングが必要です。",
    },
    {
        order: 6,
        question: "そのトレーニングはいつ行う予定ですか？",
        answer:
            "トレーニングは金曜日の午後に予定しています。全員が参加できるように調整しています。",
    },
    {
        order: 7,
        question: "何か他に報告することはありますか？",
        answer:
            "特にありませんが、もし何か問題が発生した場合は、すぐに報告します。",
    },
];
const SpeechSynthesis = window.speechSynthesis;

export default function MeetingModule() {
    const [currentOrder, setCurrentOrder] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<string>(
        dialogue[currentOrder].question,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] =
        useState<SpeechSynthesisVoice | null>(null);

    // Lấy danh sách giọng nói khi nó đã được tải đầy đủ
    useEffect(() => {
        const getVoices = () => {
            const availableVoices = speechSynthesis.getVoices();

            setVoices(availableVoices);
            setIsLoading(false);
        };

        getVoices(); // Lấy giọng nói ngay khi bắt đầu

        // Lắng nghe sự kiện khi giọng nói được tải hoàn tất
        speechSynthesis.onvoiceschanged = () => {
            getVoices(); // Cập nhật giọng nói khi có sự thay đổi
        };
    }, []);

    const selectRandomVoice = () => {
        // Chọn ngẫu nhiên 1 giọng từ danh sách
        const randomIndex = Math.floor(Math.random() * voices.length);
        const voice = voices[randomIndex];

        setSelectedVoice(voice);
    };

    const handleSpeakQuestion = () => {
        if (selectedVoice) {
            speechSynthesis.cancel();
            speakQuestion(currentQuestion, selectedVoice);
        }
    };

    // Phát âm câu hỏi (Text to Speech)
    const speakQuestion = (
        question: string,
        voice: SpeechSynthesisVoice | null,
    ) => {
        const utterance = new SpeechSynthesisUtterance(question);

        if (voice) {
            utterance.voice = voice; // Thiết lập giọng nói cho câu hỏi
        }
        utterance.lang = "ja-JP"; // Đặt ngôn ngữ là tiếng Nhật
        SpeechSynthesis.speak(utterance); // Phát âm câu hỏi
    };

    useEffect(() => {
        if (voices.length > 0) {
            selectRandomVoice(); // Chọn giọng ngẫu nhiên mỗi khi câu hỏi thay đổi
        }
    }, [currentQuestion, voices]);

    const handleReset = () => {
        setCurrentOrder(0); // Quay lại câu đầu tiên
        setSelectedAnswer(null); // Reset câu trả lời
        setIsCorrect(false); // Reset trạng thái đúng/sai
        setIsRecording(false); // Reset trạng thái ghi âm
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        if (answer === dialogue[currentOrder].answer) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNextQuestion = () => {
        if (isCorrect) {
            setCurrentOrder(currentOrder + 1); // Chuyển sang câu tiếp theo
            setCurrentQuestion(dialogue[currentOrder + 1].question);
            setSelectedAnswer(null); // Reset lại lựa chọn
            setIsCorrect(false); // Reset lại trạng thái đúng/sai
        } else {
            alert("Hãy chọn đáp án đúng!");
        }
    };

    const handleRecordPronunciation = () => {
        setIsRecording(true);
        // Sử dụng Web Speech API để ghi âm và chấm điểm phát âm ở đây
        // Sau khi ghi âm xong, nếu phát âm đúng 70% thì cho phép chuyển tiếp
        setTimeout(() => {
            setIsRecording(false);
            alert("Phát âm đúng, chuyển sang câu tiếp theo!");
            handleNextQuestion();
        }, 3000); // Giả sử ghi âm mất 3 giây
    };

    const currentScript = dialogue[currentOrder];
    // Lấy 3 đáp án ngẫu nhiên từ các câu còn lại
    const otherAnswers = dialogue
        .filter((item) => item.order !== currentScript.order) // Lọc bỏ câu hiện tại
        .map((item) => item.answer);

    // Lấy 3 đáp án ngẫu nhiên từ các đáp án còn lại
    const randomAnswers = otherAnswers
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    // Tạo options bao gồm đáp án đúng và 3 đáp án ngẫu nhiên
    const options = [currentScript.answer, ...randomAnswers];

    // Xáo trộn các đáp án ngẫu nhiên
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return (
        <div className="w-full flex flex-col space-y-4">
            {isLoading ? (
                <div>Đang tải giọng nói...</div> // Hiển thị màn hình loading khi voices chưa tải
            ) : (
                <>
                    <h1>Câu hỏi: </h1>
                    <h2>{currentScript.question}</h2>
                    <Button onClick={handleSpeakQuestion}>Đọc câu hỏi</Button>
                    <div>
                        <Label>Chọn giọng nói: </Label>
                        <select
                            onChange={(e) => {
                                const selectedVoice = voices.find(
                                    (voice) => voice.name === e.target.value,
                                );

                                setSelectedVoice(selectedVoice || null);
                            }}
                        >
                            {voices.map((voice, index) => (
                                <option key={index} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                    <h1>Các đáp án: </h1>
                    {shuffledOptions.map((answer, index) => (
                        <button key={index} onClick={() => handleAnswerSelect(answer)}>
                            {index + 1}-{answer}
                        </button>
                    ))}
                    <div>
                        {isCorrect && !isRecording && (
                            <>
                                <p>Đúng rồi!</p>
                                <Button onClick={handleRecordPronunciation}>
                                    Ghi âm phát âm của bạn
                                </Button>
                            </>
                        )}
                    </div>
                    <Button
                        disabled={!isCorrect || isRecording}
                        onClick={handleNextQuestion}
                    >
                        Tiếp theo
                    </Button>
                    <Button onClick={handleReset}>Reset lại</Button>
                </>
            )}
        </div>
    );
}
