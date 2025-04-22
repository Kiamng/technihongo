import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import ReviewGame from "../../FlashcardDetail/reviewPage";
import TermList from "../../FlashcardDetail/term-list";
import FlashcardList from "../../FlashcardDetail/flashcard-list";

import { getSysFlashcardSetById } from "@/app/api/system-set/system-set.api";
import { LessonResource } from "@/types/lesson-resource";
import { SystemFlashcardSet } from "@/types/system-flashcard-set";
import { Flashcard } from "@/types/flashcard";

interface DynamicFlashcardSetProps {
  lessonResource: LessonResource;
  token: string;
  hanldeCompleteLessonResource: (
    type: string,
    lessonReourceId: number,
    resourceId: number,
  ) => Promise<void>;
}

const DynamicFlashcardSet = ({
  lessonResource,
  token,
  hanldeCompleteLessonResource,
}: DynamicFlashcardSetProps) => {
  const [flashcardSet, setFlashcardSet] = useState<SystemFlashcardSet>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isReview, setIsReview] = useState<boolean>(false);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        setLoading(true);
        const data = await getSysFlashcardSetById(
          token,
          lessonResource.systemFlashCardSet?.systemSetId as number,
        );

        setFlashcardSet(data);
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        setFlashcardSet(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [token, lessonResource]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isReview) {
    return (
      <div className="w-full space-y-20 min-h-screen mt-6">
        <ReviewGame
          flashcards={flashcardSet?.flashcards as Flashcard[]}
          hanldeCompleteLessonResource={hanldeCompleteLessonResource}
          isSystem={true}
          lessonResource={lessonResource}
          onExit={() => setIsReview(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-20 min-h-screen mt-6">
      <div>
        <div
          className="px-8 py-4 text-white dark:text-inherit text-2xl font-bold w-fit mx-auto rounded-tl-3xl rounded-tr-3xl min-w-[765px]"
          style={{ backgroundColor: "#56D071" }}
        >
          {flashcardSet?.title || "No title"}
        </div>
        <div className="w-full flex justify-center">
          <div className="flashcard-app flex flex-col space-y-6 bg-white dark:bg-black p-10 w-fit rounded-2xl shadow-md dark:shadow-none min-w-[800px]">
            {flashcardSet?.flashcards.length &&
              flashcardSet?.flashcards.length > 0 ? (
              <FlashcardList FlashcardList={flashcardSet.flashcards} />
            ) : (
              <p>No flashcards available</p>
            )}
            {(flashcardSet?.flashcards?.length ?? 0) > 0 && (
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

      {flashcardSet?.flashcards.length &&
        flashcardSet?.flashcards.length > 0 ? (
        <TermList FlashcardList={flashcardSet?.flashcards} />
      ) : null}
    </div>
  );
};

export default DynamicFlashcardSet;
