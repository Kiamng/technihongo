import LearningPathId from "@/components/module/learning-path/[learningpathId]";

interface LearningPathDetailPageProps {
  params: { id: string };
}
export default function LearningPathDetailPage({
  params,
}: {
  params: { learningpathId: string };
}) {
  console.log("Resolved params:", params); // Kiểm tra dữ liệu params

  return <LearningPathId pathId={params.learningpathId} />;
}
