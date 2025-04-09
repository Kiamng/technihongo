"use client";
import React from "react";
import { Calendar } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Course, CourseProgress } from "@/types/course";
import { Progress } from "@/components/ui/progress";

// Props for the component
interface CourseCardsProps {
  course: Course;
  courseProgress?: CourseProgress;
}

const CourseCards: React.FC<CourseCardsProps> = ({
  course,
  courseProgress,
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage <= 25)
      return { progressColor: "bg-slate-500", textColor: "text-slate-500" };
    if (percentage <= 50)
      return { progressColor: "bg-red-500", textColor: "text-red-500" };
    if (percentage <= 75)
      return { progressColor: "bg-yellow-500", textColor: "text-yellow-500" };

    return { progressColor: "bg-green-500", textColor: "text-green-500" };
  };

  // Function to generate a color based on course title
  const generateBackgroundColor = (title: string) => {
    let hash = 0;

    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;

    return `hsl(${hue}, 70%, 80%)`;
  };

  // Function to get course initials
  const getCourseInitials = (title: string) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      key={course.courseId.toString()}
      className="border rounded-lg overflow-hidden shadow-sm bg-white h-full"
    >
      {/* Thumbnail container with dynamic fallback */}
      <div
        className="relative w-full h-48 flex items-center justify-center"
        style={{
          backgroundColor: generateBackgroundColor(course.title),
        }}
      >
        {course.thumbnailUrl ? (
          <img
            alt={course.title}
            className="w-full h-full object-cover"
            src={course.thumbnailUrl}
            onError={(e) => {
              const target = e.target as HTMLImageElement;

              target.onerror = null; // Prevent infinite loop
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLDivElement;

              fallback.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback content */}
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl"
          style={{
            backgroundColor: generateBackgroundColor(course.title),
            display: course.thumbnailUrl ? "none" : "flex",
          }}
        >
          {getCourseInitials(course.title)}
        </div>
      </div>

      {/* Card content with fixed heights for consistent sizing */}
      <div className="p-4 flex flex-col h-64">
        <h3 className="font-bold text-lg mb-2 h-14 line-clamp-2">
          {course.title}
        </h3>

        <div className="mb-4">
          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {course.description}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4 h-6">
          <Calendar className="mr-2 flex-shrink-0" size={16} />
          <span>{course.estimatedDuration}</span>
        </div>
        {courseProgress && (
          <div className="w-full flex flex-row space-x-2 items-center">
            <Progress
              className="mx-auto h-1"
              value={courseProgress.completionPercentage}
              // Đặt màu cho thanh tiến độ
              style={{
                backgroundColor: getProgressColor(courseProgress.completionPercentage).progressColor,
              }}
            />
            <span
              className={`text-xs ${getProgressColor(courseProgress.completionPercentage).textColor}`}
            >
              {courseProgress.completionPercentage}%
            </span>
          </div>
        )}
        {!courseProgress ? (
          <div className="mt-auto w-full">
            <Link href={`/course/${course.courseId}`}>
              <Button className="w-full">Xem chi tiết</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-auto w-full">
            <Link href={`/course/study/${course.courseId}`}>
              <Button className="w-full">Tiếp tục học</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCards;
