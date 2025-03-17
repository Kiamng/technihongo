import { Suspense } from "react";

import { fetchCourseDetail } from "@/app/api/course/courseDetail.api";
import CourseDetail from "@/components/module/Course/CourseDetail";

// Async Server Component
export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  // Fetch dữ liệu từ API
  const courseDetail = await fetchCourseDetail(params.courseId);

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <CourseDetail initialCourseDetail={courseDetail} />
    </Suspense>
  );
}
