import { use } from "react";

import { fetchCourseDetail } from "@/app/api/course/courseDetail.api";
import CourseDetail from "@/components/module/Course/CourseDetail";

// Async Server Component
interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const resolvedParams = use(params);
  const courseDetail = await fetchCourseDetail(resolvedParams.courseId);

  return <CourseDetail initialCourseDetail={courseDetail} />;
}
// import { use } from "react";

// import FlashcardDetailModule from "@/components/module/FlashcardDetail";

// interface FlashcardDetailPageProps {
//   params: Promise<{ flashcardId: string }>;
// }

// export default function FlashcardDetailPage({
//   params,
// }: FlashcardDetailPageProps) {
//   const resolvedParams = use(params);

//   return <FlashcardDetailModule flashcardId={resolvedParams.flashcardId} />;
// }
