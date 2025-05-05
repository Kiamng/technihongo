"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { CircleStop, Loader2, Mic } from "lucide-react"; // icon loading xoay

import FeedbackDisplay from "./feedback";

import { Button } from "@/components/ui/button";

interface PronunciationPracticeProps {
    text: string;
    onComplete?: () => void;
    setCorrectPercent: Dispatch<SetStateAction<number>>;
    result: any;
    setResult: Dispatch<any>;
}

const PronunciationPractice = ({
    text,
    onComplete,
    setCorrectPercent,
    result,
    setResult,
}: PronunciationPracticeProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null,
    );
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [recordTimeout, setRecordTimeout] = useState<NodeJS.Timeout | null>(
        null,
    );

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
        });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });

            setAudioBlob(blob);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);

        const timeout = setTimeout(() => {
            stopRecording();
        }, 60000); // 60000 ms = 1 minute

        setRecordTimeout(timeout);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
        if (recordTimeout) {
            clearTimeout(recordTimeout); // Clear the timeout when recording is stopped manually
        }
    };

    const sendAudioToServer = async () => {
        if (!audioBlob) return;
        setIsLoading(true);

        const formData = new FormData();

        formData.append("audio", audioBlob);
        formData.append("text", text);

        try {
            const res = await fetch("/api/assemblyai-pronunciation", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.pronunciation_score && setCorrectPercent) {
                setCorrectPercent(data.pronunciation_score);
            }
            setResult(data);
            console.log("respond o client:", data);
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Error sending audio:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setResult(null);
        setIsRecording(false);
        if (recordTimeout) {
            clearTimeout(recordTimeout); // Clear any timeout if reset
        }
    };

    const getColorClass = (confidence: number) => {
        if (confidence >= 0.9) return "text-green-600";
        if (confidence >= 0.7) return "text-yellow-600";

        return "text-red-600";
    };

    return (
        <div className="flex flex-col items-end space-y-6 w-full">
            {!result ? (
                <>
                    <div className="flex space-x-4 items-center">
                        <div className="relative bg-green-50 dark:bg-green-900 text-black dark:text-white p-4 rounded-2xl text-md font-medium max-w-[80%] shadow-sm">
                            <div className="absolute -right-2 top-4 w-4 h-4 bg-green-50 dark:bg-green-900 transform rotate-45" />
                            {text}
                        </div>

                        {!audioBlob && !isRecording && (
                            <button
                                className="p-2 bg-primary/10 rounded-full hover:scale-110 transition-all duration-300"
                                onClick={startRecording}
                            >
                                <Mic className="w-5 h-5 text-primary" />
                            </button>
                        )}

                        {isRecording && (
                            <button
                                className="p-2 bg-primary/10 rounded-full hover:scale-110 transition-all duration-300"
                                onClick={stopRecording}
                            >
                                <CircleStop className="w-5 h-5 text-primary" />
                            </button>
                        )}

                        {audioBlob && !isRecording && (
                            <Button disabled={isLoading} onClick={sendAudioToServer}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4" /> Đang đánh
                                        giá...
                                    </span>
                                ) : (
                                    "🚀 Nhận đánh giá"
                                )}
                            </Button>
                        )}

                        {/* Nút reset */}
                        {audioBlob && !isRecording && (
                            <Button variant="outline" onClick={resetRecording}>
                                🔄 Ghi âm lại
                            </Button>
                        )}
                    </div>

                    {/* {isLoading && (
                        <div className="flex flex-col items-center space-y-2 mt-4">
                            <Loader2 className="animate-spin h-6 w-6 text-primary" />
                            <p className="text-sm text-gray-600">
                                Đang đánh giá, vui lòng đợi...
                            </p>
                        </div>
                    )} */}
                </>
            ) : (
                <>
                    <div className="w-full flex flex-col space-y-2 p-4 bg-gray-50 dark:bg-secondary rounded-2xl">
                        <h2 className="text-xl font-bold">Kết quả Phát Âm</h2>
                        {/* <p className="text-lg">
                            Độ chính xác:{" "}
                            <span className="font-bold text-green-600">
                                {Math.round(result.confidence * 100)}%
                            </span>
                        </p> */}
                        <p className="text-lg">
                            Độ chính xác:{" "}
                            <span className="font-bold text-green-600">
                                {result.pronunciation_score}%
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center text-lg">
                            {/* {result.words?.map((word: any, idx: number) => {
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
                                        {word.word}
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                            {tooltip}
                                        </div>
                                    </div>
                                );
                            })} */}
                            <FeedbackDisplay words={result.words} />
                        </div>
                    </div>

                    {result && (
                        <Button variant="outline" onClick={resetRecording}>
                            🔄 Ghi âm lại
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default PronunciationPractice;
