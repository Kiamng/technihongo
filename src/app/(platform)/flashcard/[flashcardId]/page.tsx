import { use } from "react";

import FlashcardDetailModule from "@/components/module/FlashcardDetail";

interface FlashcardDetailPageProps {
  params: Promise<{ flashcardId: string }>;
}

export default function FlashcardDetailPage({
  params,
}: FlashcardDetailPageProps) {
  const resolvedParams = use(params);

  return <FlashcardDetailModule flashcardId={resolvedParams.flashcardId} />;
}
