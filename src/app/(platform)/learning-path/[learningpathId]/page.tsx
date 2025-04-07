import LearningPathId from "@/components/module/learning-path/[learningpathId]";

interface LearningPathDetailPageProps {
  params: Promise<{ learningpathId: string }>;
}
export default async function LearningPathDetailPage({
  params,
}: LearningPathDetailPageProps) {
  const resolvedParams = await params;

  return <LearningPathId pathId={resolvedParams.learningpathId} />;
}
