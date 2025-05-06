"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { CircleStop, Loader2, Mic } from "lucide-react"; // icon loading xoay
import { toast } from "sonner";

import FeedbackDisplay from "./feedback";

import { Button } from "@/components/ui/button";

interface PronunciationPracticeProps {
    text: string;
    answerExplain: string;
    onComplete?: () => void;
    setCorrectPercent: Dispatch<SetStateAction<number>>;
    result: any;
    setResult: Dispatch<any>;
}

const PronunciationPractice = ({
    text,
    answerExplain,
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

    const checkMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            startRecording();
            stream.getTracks().forEach((track) => track.stop());
        } catch (err) {
            toast.error(
                "Vui lòng cấp quyền sử dụng microphone trên trình duyệt để ghi âm.",
            );
        }
    };

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
            clearTimeout(recordTimeout);
        }
    };

    return (
        <div className="flex flex-col items-end space-y-6 w-full">
            {!result ? (
                <>
                    <div className="flex space-x-4 items-center">
                        <div className="relative bg-green-50 dark:bg-green-900 text-black dark:text-white p-4 rounded-2xl shadow-sm">
                            <div className="absolute -right-2 top-4 w-4 h-4 bg-green-50 dark:bg-green-900 transform rotate-45" />

                            <div className="text-xl font-bold">{text}</div>
                            {answerExplain && (
                                <div className="text-base text-gray-500 dark:text-gray-400 mt-2">
                                    {answerExplain}
                                </div>
                            )}
                        </div>

                        {!audioBlob && !isRecording && (
                            <button
                                className="p-2 bg-primary/10 rounded-full hover:scale-110 transition-all duration-300"
                                onClick={checkMicrophonePermission}
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
                            <Button
                                disabled={isLoading}
                                variant="outline"
                                onClick={resetRecording}
                            >
                                🔄 Ghi âm lại
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full flex flex-col space-y-2 p-4 bg-gray-50 dark:bg-secondary rounded-2xl">
                        <h2 className="text-xl font-bold">Kết quả Phát Âm</h2>
                        <p className="text-lg">
                            Độ chính xác:{" "}
                            <span className="font-bold text-green-600">
                                {result.pronunciation_score}%
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center text-lg">
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
