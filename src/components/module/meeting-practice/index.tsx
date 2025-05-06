"use client";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
    AudioLines,
    ChevronRight,
    Mic,
    RotateCcw,
    Volume2,
} from "lucide-react";
import Link from "next/link";

import PronunciationPractice from "./recording-component";
import SummaryComponent from "./summary-component";

import { Meeting, Script, ScriptList } from "@/types/meeting";
import {
    getMeetingById,
    getScriptsByMeetingId,
} from "@/app/api/meeting/meeting.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";
import { Button } from "@/components/ui/button";

export default function MeetingPracticeModule() {
    const { meetingId } = useParams();
    const { data: session } = useSession();

    const [showConfetti, setShowConfetti] = useState(false);

    const [meeting, setMeeting] = useState<Meeting>();
    const [scripts, setScripts] = useState<ScriptList>();
    const [currentScript, setCurrentScript] = useState<Script>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [correctPercent, setCorrectPercent] = useState<number>(0);
    const [result, setResult] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] =
        useState<SpeechSynthesisVoice | null>(null);

    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [wordResults, setWordResults] = useState<{
        [key: string]: {
            text: string;
            confidence: number;
            error_type: "perfect" | "good" | "poor" | "missing";
        }[];
    }>({});

    const [isCompleted, setIsCompleted] = useState(false);

    const resetPractice = () => {
        setCurrentIndex(0);
        setScores({});
        setWordResults({});
        setResult(null);
        setIsCompleted(false);
        setShowConfetti(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsRecordingDone(false);
        setCorrectPercent(0);
    };

    const speak = (text: string) => {
        if (!text || typeof window === "undefined" || !window.speechSynthesis)
            return;
        if (!selectedVoice) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || "ja-JP";
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const prepareQuestion = () => {
        if (!scripts?.content || scripts.content.length === 0) return;

        const scriptList = [...scripts.content].sort(
            (a, b) => a.scriptOrder - b.scriptOrder,
        );
        const currentScript = scriptList[currentIndex];

        if (!currentScript) return;

        const wrongAnswers = scriptList
            .filter((s) => s.scriptId !== currentScript.scriptId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((s) => s.answer);

        const allOptions = [...wrongAnswers, currentScript.answer].sort(
            () => 0.5 - Math.random(),
        );

        setCurrentScript(currentScript);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setIsCorrect(null);

        setTimeout(() => {
            if (currentScript?.question) speak(currentScript.question);
        }, 300);
    };

    const handleAnswerSelect = (answer: string) => {
        if (!currentScript) return;

        setSelectedAnswer(answer);
        setIsCorrect(answer === currentScript.answer);
        setIsRecordingDone(false);
    };

    const handleNextQuestion = () => {
        if (currentScript) {
            setScores((prev) => ({
                ...prev,
                [currentScript.scriptId]: correctPercent,
            }));
            // Store word results
            setWordResults((prev) => ({
                ...prev,
                [currentScript.scriptId]: result?.words || [],
            }));
        }

        if (currentIndex + 1 >= (scripts?.content.length || 0)) {
            setIsCompleted(true);
            setShowConfetti(true);
        } else {
            setCurrentIndex((prev) => prev + 1);
            setResult(null);
            setIsRecordingDone(false);
        }
    };

    const findAndSetVoice = (
        voiceList: SpeechSynthesisVoice[],
        voiceName?: string,
    ) => {
        if (!voiceList.length) return;

        if (voiceName) {
            const matched = voiceList.find((v) => v.name === voiceName);

            if (matched) {
                setSelectedVoice(matched);

                return;
            }
        }
        setSelectedVoice(voiceList[0]);
    };

    const fetchMeeting = async () => {
        if (!session) {
            toast.error("Đăng nhập để tiếp tục");

            return;
        }

        try {
            const meeting = await getMeetingById(
                session?.user.token,
                Number(meetingId),
            );

            setMeeting(meeting);

            const scripts = await getScriptsByMeetingId({
                token: session?.user.token,
                meetingId: meetingId as string,
                sortBy: "scriptOrder",
                sortDir: "asc",
            });

            setScripts(scripts);
        } catch (error) {
            console.error("Lỗi tải hội thoại: ", error);
            toast.error("Tải hội thoại thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchMeeting();
    }, [meetingId, session?.user.token]);

    useEffect(() => {
        if (scripts?.content) prepareQuestion();
    }, [scripts?.content, currentIndex]);

    useEffect(() => {
        const loadVoices = () => {
            const synth = window.speechSynthesis;
            const allVoices = synth.getVoices();
            const jaVoices = allVoices.filter(
                (v) =>
                    v.lang.startsWith("ja") && !v.name.toLowerCase().includes("google"),
            );

            setVoices(jaVoices);
            findAndSetVoice(jaVoices, meeting?.voiceName);
        };

        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }
    }, [meeting?.voiceName]);

    if (isLoading) return <LoadingAnimation />;

    if (isCompleted) {
        return (
            <div className="w-full min-h-screen flex flex-col space-y-6 p-10">
                <div className="w-full p-10 rounded-2xl bg-primary">
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-3xl font-bold text-white">{meeting?.title}</h1>
                        <p className="text-gray-200">{meeting?.description}</p>
                    </div>
                </div>
                {showConfetti && (
                    <Confetti
                        colors={["#10B981", "#3B82F6", "#F59E0B", "#EF4444"]}
                        gravity={0.2}
                        height={window.innerHeight}
                        numberOfPieces={200}
                        recycle={false}
                        width={window.innerWidth}
                        onConfettiComplete={() => setShowConfetti(false)}
                    />
                )}
                <SummaryComponent
                    scores={scores}
                    scripts={scripts?.content || []}
                    wordResults={wordResults}
                />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col space-y-6 p-10">
            <div className="flex flex-row space-x-1 items-center p-4 bg-white rounded-2xl dark:bg-black">
                <Link href={"/meeting"}>
                    <button className="text-gray-400 hover:text-primary  flex space-x-1">
                        <Mic />
                        <span className="text-xl font-bold">Luyện tập hội thoại</span>
                    </button>
                </Link>
                <ChevronRight strokeWidth={1.5} />
                <button className="underline text-xl text-gray-700 font-bold">
                    {meeting?.title}
                </button>
            </div>
            <div className="w-full p-10 rounded-2xl bg-primary flex justify-between">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-3xl font-bold text-white">{meeting?.title}</h1>
                    <p className="text-gray-600">{meeting?.description}</p>
                </div>
                <div className="mt-4">
                    {currentIndex !== 0 && (
                        <Button
                            className="rounded-full hover:scale-105 duration-300 transition-all text-lg font-bold"
                            variant="ghost"
                            onClick={resetPractice}
                        >
                            Thử lại từ đầu <RotateCcw />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-8 p-4 bg-white dark:bg-black rounded-2xl">
                {/* Question bubble */}
                <div className="flex items-center space-x-2">
                    <div className="relative bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded-2xl text-lg max-w-[80%] shadow-sm">
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-100 dark:bg-gray-800 transform rotate-45" />
                        <div className="font-bold text-xl">{currentScript?.question}</div>
                        {currentScript?.questionExplain && (
                            <div className="text-base text-gray-500 dark:text-gray-400 mt-2">
                                {currentScript.questionExplain}
                            </div>
                        )}
                    </div>
                    {isSpeaking ? (
                        <button
                            className="hover:scale-105 transition-all duration-300 hover:text-primary"
                            onClick={stopSpeaking}
                        >
                            <AudioLines
                                className="animate-pulse-strong text-primary"
                                size={24}
                            />
                        </button>
                    ) : (
                        <button
                            className="hover:scale-105 transition-all duration-300 hover:text-primary"
                            onClick={() =>
                                currentScript?.question && speak(currentScript.question)
                            }
                        >
                            <Volume2 size={24} />
                        </button>
                    )}
                </div>

                {/* Answer options */}
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-6 w-full">
                        {options.map((option, idx) => (
                            <div key={idx} className="flex justify-end">
                                <Button
                                    className={`rounded-2xl text-left max-w-[80%] text-xl font-bold transition-all duration-200 transform hover:scale-[1.02] ${selectedAnswer === option
                                            ? isCorrect
                                                ? "bg-green-100 dark:bg-green-900 border-green-500 text-green-600 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900 border-red-500 text-red-600 dark:text-red-400"
                                            : "bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800"
                                        }`}
                                    disabled={!!isCorrect || isSpeaking}
                                    variant="outline"
                                    onClick={() => handleAnswerSelect(option)}
                                >
                                    {option}
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Reaction image */}
                    <div className="flex justify-end">
                        <div className="w-32 h-32">
                            {isCorrect ? (
                                <img
                                    alt="Correct answer"
                                    className="w-full h-full object-contain"
                                    src="https://media-public.canva.com/LZYY8/MAF-OfLZYY8/1/tl.png"
                                />
                            ) : isCorrect === false ? (
                                <img
                                    alt="Wrong answer"
                                    className="w-full h-full object-contain"
                                    src="https://media-public.canva.com/BBDpM/MAF-OQBBDpM/1/tl.png"
                                />
                            ) : (
                                <img
                                    alt="Thinking"
                                    className="w-full h-full object-contain"
                                    src="https://media-public.canva.com/sNBVI/MAF-OFsNBVI/1/t.png"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* After correct answer */}
            {isCorrect && selectedAnswer && (
                <div className="flex flex-col space-y-8 p-4 bg-white dark:bg-black rounded-2xl">
                    <div className="w-full flex flex-col items-end space-y-6">
                        <div className="text-green-500 dark:text-green-400 font-semibold animate-fade-in">
                            ✅ Chính xác!
                        </div>

                        {isRecordingDone && correctPercent > 70 && (
                            <Button
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white transition-colors"
                                onClick={handleNextQuestion}
                            >
                                Tiếp tục câu tiếp theo →
                            </Button>
                        )}

                        <PronunciationPractice
                            answerExplain={currentScript?.answerExplain as string}
                            result={result}
                            setCorrectPercent={setCorrectPercent}
                            setResult={setResult}
                            text={selectedAnswer}
                            onComplete={() => setIsRecordingDone(true)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
