"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Import DotLottieReact

import CourseCards from "./course-card";

import { CourseList, CourseProgress } from "@/types/course";
import {
  getAllCourse,
  getStudentAllCourseProgress,
} from "@/app/api/course/course.api";

// Component Loading Animation
const LoadingAnimation = () => {
  return (
    <DotLottieReact
      autoplay
      loop
      className="w-64 h-64" // Điều chỉnh kích thước (có thể thay đổi)
      src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
    />
  );
};

export default function CourseModule() {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [coursesList, setCoursesList] = useState<CourseList>();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);

  const fetchCoursesProgress = async () => {
    const response = await getStudentAllCourseProgress(
      Number(session?.user.studentId),
      session?.user.token as string,
    );

    setCourseProgress(response);
  };

  const fetchCourses = async () => {
    const response = await getAllCourse({
      token: session?.user.token as string,
      pageNo: currentPage,
      pageSize: 5,
      sortBy: "createdAt",
      sortDir: "desc",
    });

    setCoursesList(response);
  };

  useEffect(() => {
    if (!session?.user?.token) {
      return;
    }

    const fetchData = async () => {
      setIsloading(true);
      try {
        // Chạy cả 2 fetch đồng thời
        await Promise.all([fetchCourses(), fetchCoursesProgress()]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [session?.user?.token, currentPage]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64">
          <LoadingAnimation /> {/* Sử dụng component LoadingAnimation */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-6 bg-white dark:bg-black p-10">
      {courseProgress && (
        <>
          <h2 className="text-2xl font-bold">Khóa học của tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseProgress?.map((courseProgress) => (
              <CourseCards
                key={courseProgress.progressId}
                course={courseProgress.course}
                courseProgress={courseProgress}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="text-2xl font-bold">Khóa học gợi ý</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coursesList?.content.map((course) => (
          <CourseCards key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
}
