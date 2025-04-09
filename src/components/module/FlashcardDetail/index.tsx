"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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

  return (
    <div className="w-full space-y-20 min-h-screen">
      <TextHighlighterWithTranslate />
      <div>
        <div className="text-center mb-4">
          <div
            className="px-8 py-4 text-white dark:text-inherit text-2xl font-bold w-fit mx-auto rounded-tl-3xl rounded-tr-3xl min-w-[765px]"
            style={{ backgroundColor: "#56D071" }}
          >
            {flashcardSet.title || "No title"}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-[800px] mx-auto">
            {flashcardSet.description || ""}
          </p>
        </div>
        <div className="w-full flex justify-center">
          <div className="flashcard-app flex flex-col space-y-6 bg-gray-100 dark:bg-gray-800 p-10 w-fit rounded-2xl shadow-md dark:shadow-none min-w-[800px]">
            <div className="flex gap-x-2 items-center">
              <div
                className="avatar w-10 h-10 rounded-full"
                style={{ backgroundColor: "#56D071" }}
              />
              <div>
                <div className="text-xl font-bold" style={{ color: "#56D071" }}>
                  {creatorName}
                </div>
                <div className="italic text-base text-gray-400">dd/mm/yyyy</div>
              </div>
            </div>

            {isReview ? (
              <ReviewGame
                flashcardSet={flashcardSet}
                onExit={() => setIsReview(false)}
              />
            ) : (
              <>
                {flashcardSet.flashcards.length > 0 ? (
                  <FlashcardList FlashcardList={flashcardSet.flashcards} />
                ) : (
                  <p>No flashcards available</p>
                )}
                {flashcardSet.flashcards.length > 0 && (
                  <button
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={() => setIsReview(true)}
                  >
                    Học
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {!isReview && flashcardSet.flashcards.length > 0 ? (
        <TermList FlashcardList={flashcardSet.flashcards} />
      ) : null}
    </div>
  );
}
