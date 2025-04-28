"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { CircleStop, Loader2, Mic } from "lucide-react"; // icon loading xoay

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
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
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

            if (data.confidence && setCorrectPercent) {
                setCorrectPercent(Math.round(data.confidence * 100));
            }
            setResult(data);

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
                            <Button
                                className="rounded-full"
                                size={"icon"}
                                onClick={startRecording}
                            >
                                <Mic />
                            </Button>
                        )}

                        {isRecording && (
                            <Button onClick={stopRecording}>
                                <CircleStop />
                            </Button>
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
                        <p className="text-lg">
                            Độ chính xác:{" "}
                            <span className="font-bold text-green-600">
                                {Math.round(result.confidence * 100)}%
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center text-lg">
                            {result.words?.map((word: any, idx: number) => (
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
