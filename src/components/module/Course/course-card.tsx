"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

// Props for the component
interface CourseCardsProps {
  courses: Course[] | undefined;
}

const CourseCards: React.FC<CourseCardsProps> = ({ courses }) => {
  const router = useRouter();

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

  const handleCourseDetail = (courseId: number) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Khóa học gợi ý</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses &&
          courses.map((course) => (
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
                      const fallback =
                        target.nextElementSibling as HTMLDivElement;

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

                <div className="mt-auto w-full">
                  <Button
                    className="w-full"
                    onClick={() => handleCourseDetail(course.courseId)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CourseCards;
