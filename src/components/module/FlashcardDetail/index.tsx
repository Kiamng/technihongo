"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

import ReviewGame from "./reviewPage";
import TextHighlighterWithTranslate from "./TextHighlighterWithTranslate";

import TermList from "@/components/module/FlashcardDetail/term-list";
import {
  FlashcardSet,
  getFlashcardSetById,
} from "@/app/api/studentflashcardset/stuflashcard.api";
import FlashcardList from "@/components/module/FlashcardDetail/flashcard-list";

interface FlashcardDetailModuleProps {
  studentSetId: number;
}

export default function FlashcardDetailModule({
  studentSetId,
}: FlashcardDetailModuleProps) {
  const { data: session, status } = useSession();
  const token = session?.user?.token || "";
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReview, setIsReview] = useState<boolean>(false);

  useEffect(() => {
    if (status === "loading" || !studentSetId) {
      setLoading(false);

      return;
    }

    if (status === "unauthenticated" || !token) {
      console.log("User not authenticated or no token available");
      setLoading(false);

      return;
    }

    const fetchFlashcardSet = async () => {
      try {
        setLoading(true);
        const data = await getFlashcardSetById(studentSetId, token);

        setFlashcardSet(data);
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        setFlashcardSet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [studentSetId, status, token]);

  if (status === "loading")
    return <p className="text-center">Đang tải thông tin phiên...</p>;
  if (loading)
    return <p className="text-center">Đang tải dữ liệu flashcard...</p>;
  if (!flashcardSet)
    return <p className="text-center">Không tìm thấy bộ flashcard.</p>;

  const creatorName =
    session?.user?.userName || `Student ${flashcardSet.studentSetId}`;

  if (isReview) {
    return (
      <ReviewGame
        flashcards={flashcardSet.flashcards}
        onExit={() => setIsReview(false)}
      />
    );
  }

  return (
    <div className="w-full space-y-20 min-h-screen pt-6">
      <TextHighlighterWithTranslate />
      <div>
        <div className="text-center">
          <div className="px-8 py-4 bg-primary  dark:text-inherit  w-fit mx-auto rounded-tl-3xl rounded-tr-3xl min-w-[765px]">
            <span className="text-white text-2xl font-bold">
              {flashcardSet.title || "No title"}
            </span>
            <p className="mt-2 text-sm text-white mx-auto">
              {flashcardSet.description || ""}
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="flashcard-app flex flex-col space-y-6 bg-white dark:bg-gray-800 p-10 w-fit rounded-2xl shadow-md dark:shadow-none min-w-[800px]">
            <div className="flex gap-x-2 items-center">
              <div className="avatar w-10 h-10 rounded-full bg-primary" />
              <div>
                <div className="text-xl font-bold text-primary">
                  {creatorName}
                </div>
                <div className="italic text-base text-gray-400">
                  {format(new Date(flashcardSet.createdAt), "dd-MM-yyyy")}
                </div>
              </div>
            </div>

            {flashcardSet.flashcards.length > 0 ? (
              <FlashcardList FlashcardList={flashcardSet.flashcards} />
            ) : (
              <p>No flashcards available</p>
            )}
            {flashcardSet.flashcards.length > 0 && (
              <button
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:scale-105 transition duration-200"
                onClick={() => setIsReview(true)}
              >
                Học
              </button>
            )}
          </div>
        </div>
      </div>

      {flashcardSet.flashcards.length > 0 ? (
        <TermList FlashcardList={flashcardSet.flashcards} />
      ) : null}
    </div>
  );
}
