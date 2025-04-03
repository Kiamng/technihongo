// import { use } from "react";

// import { fetchCourseDetail } from "@/app/api/course/courseDetail.api";
// import CourseDetail from "@/components/module/Course/CourseDetail";

// // Async Server Component
// interface CourseDetailPageProps {
//   params: Promise<{ courseId: string }>;
// }

// export default async function CourseDetailPage({
//   params,
// }: CourseDetailPageProps) {
//   const resolvedParams = use(params);
//   const courseDetail = await fetchCourseDetail(resolvedParams.courseId);

//   return <CourseDetail initialCourseDetail={courseDetail} />;
// }
import { fetchCourseDetail } from "@/app/api/course/courseDetail.api";
import CourseDetail from "@/components/module/Course/CourseDetail";

interface CourseDetailPageProps {
  params: { courseId: string };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const courseDetail = await fetchCourseDetail(params.courseId);

  return <CourseDetail initialCourseDetail={courseDetail} />;
}
