import { use } from "react";

import FlashcardDetailModule from "@/components/module/FlashcardDetail";

interface FlashcardDetailPageProps {
  params: Promise<{ studentSetId: string }>;
}

export default function FlashcardDetailPage({
  params,
}: FlashcardDetailPageProps) {
  const resolvedParams = use(params);
  const studentSetId = Number(resolvedParams.studentSetId);

  return <FlashcardDetailModule studentSetId={studentSetId} />;
}
