// src/context/QuizContext.tsx
"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface QuizContextType {
    isQuizStarted: boolean;
    setIsQuizStarted: React.Dispatch<React.SetStateAction<boolean>>;
    isSubmitted: boolean;
    setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
    const context = useContext(QuizContext);

    if (!context) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }

    return context;
};

interface QuizProviderProps {
    children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <QuizContext.Provider
            value={{ isQuizStarted, setIsQuizStarted, isSubmitted, setIsSubmitted }}
        >
            {children}
        </QuizContext.Provider>
    );
};
