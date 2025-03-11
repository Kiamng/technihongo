"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import CourseCards from "./course-card";

import { CourseList } from "@/types/course";
import { getAllCourse } from "@/app/api/course/course.api";

export default function CourseModule() {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [coursesList, setCoursesList] = useState<CourseList>();

  const fetchCourses = async () => {
    try {
      setIsloading(true);
      const response = await getAllCourse({
        token: session?.user.token as string,
        pageNo: currentPage,
        pageSize: 5,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      setCoursesList(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.token) {
      return;
    }
    fetchCourses();
  }, [session?.user?.token, currentPage]);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Đang tải khóa học...</p>
        </div>
      ) : (
        <CourseCards courses={coursesList?.content} />
      )}
    </div>
  );
}
