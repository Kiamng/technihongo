import { fetchCourseDetail } from "@/app/api/course/courseDetail.api";
import CourseDetail from "@/components/module/Course/CourseDetail";

// Define the props interface with params as a Promise
interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>; // params is a Promise in async pages
}

// Async page component
export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  // Await the params to resolve the courseId
  const resolvedParams = await params;
  const courseDetail = await fetchCourseDetail(resolvedParams.courseId);

  return <CourseDetail initialCourseDetail={courseDetail} />;
}
