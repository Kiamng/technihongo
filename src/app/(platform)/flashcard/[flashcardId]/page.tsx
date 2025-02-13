import FlashcardList from "@/components/module/Flashcard/flashcard-list";
import { use } from "react";

interface FlashcardDetailPageProps {
  params: Promise<{ flashcardId: string }>;
}

export default function FlashcardDetailPage({
  params,
}: FlashcardDetailPageProps) {
  const resolvedParams = use(params);
  return (
    <div>
      {resolvedParams.flashcardId}
      <FlashcardList />
    </div>
  );
}
