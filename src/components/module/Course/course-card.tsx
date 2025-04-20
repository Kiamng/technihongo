"use client";
import React from "react";
import { Award, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Course, CourseProgress } from "@/types/course";
import { Progress } from "@/components/ui/progress";

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
      return { progressColor: "bg-slate-400", textColor: "text-slate-500" };
    if (percentage <= 50)
      return { progressColor: "bg-blue-400", textColor: "text-blue-500" };
    if (percentage <= 75)
      return { progressColor: "bg-yellow-400", textColor: "text-yellow-600" };

    return { progressColor: "bg-green-400", textColor: "text-green-600" };
  };

  const generateBackgroundColor = (title: string) => {
    let hash = 0;

    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;

    return `hsl(${hue}, 85%, 75%)`;
  };

  const getCourseInitials = (title: string) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage === 100) return "Hoàn thành";
    if (percentage > 0) return "Đang học";

    return "Chưa bắt đầu";
  };

  const buttonBaseStyle =
    "flex font-medium gap-2 hover:opacity-90 items-center justify-center py-2 rounded-lg text-white transition-all duration-300 w-full";
  const primaryButtonStyle = `${buttonBaseStyle} bg-[#56D071] hover:bg-[#4bba63] shadow-md`;
  const continueButtonStyle = `${buttonBaseStyle} bg-[#56D071] hover:bg-[#4bba63] shadow-md`;

  return (
    <div
      key={course.courseId.toString()}
      className="bg-white border flex flex-col h-full hover:shadow-lg overflow-hidden rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex h-52 items-center justify-center overflow-hidden relative w-full group">
        {course.thumbnailUrl ? (
          <img
            alt={course.title}
            className="h-full object-cover transition-transform duration-500 group-hover:scale-110 w-full"
            src={course.thumbnailUrl}
            onError={(e) => {
              const target = e.target as HTMLImageElement;

              target.onerror = null;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLDivElement;

              fallback.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="absolute flex font-bold group-hover:scale-110 inset-0 items-center justify-center text-5xl text-white transition-transform duration-500"
          style={{
            backgroundColor: generateBackgroundColor(course.title),
            display: course.thumbnailUrl ? "none" : "flex",
          }}
        >
          {getCourseInitials(course.title)}
        </div>

        {/* Updated Difficulty Level Tag */}
        <div className="absolute bg-[#56D071] font-bold px-4 py-1.5 right-3 rounded-full text-white text-xs top-3 shadow-md">
          {course.difficultyLevel.tag}
        </div>

        {courseProgress && (
          <div className="absolute bg-[#56D071] bg-opacity-90 font-medium left-3 px-3 py-1 rounded-full text-white text-xs top-3">
            {getProgressStatus(courseProgress.completionPercentage)}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-bold line-clamp-2 mb-3 min-h-14 text-gray-800 text-xl">
          {course.title}
        </h3>

        <p className="line-clamp-2 mb-4 text-gray-600 text-sm">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-[#e9f7ed] font-medium px-3 py-1 rounded-full text-[#56D071] text-xs">
            {course.domain.tag}
          </span>
          <span className="bg-[#f0f8f3] font-medium px-3 py-1 rounded-full text-[#459a58] text-xs">
            {course.domain.name}
          </span>
        </div>

        <div className="flex items-center mb-5 text-gray-700 text-sm">
          <Calendar className="flex-shrink-0 mr-2 text-[#56D071]" size={16} />
          <span>{course.estimatedDuration}</span>
        </div>

        {courseProgress && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600 text-xs">
                {getProgressStatus(courseProgress.completionPercentage)}
              </span>
              <span className="font-bold text-xs text-[#56D071]">
                {courseProgress.completionPercentage}%
              </span>
            </div>
            <Progress
              className="bg-gray-200 h-2 rounded-full"
              value={courseProgress.completionPercentage}
            />
            <div
              className="bg-[#56D071] h-2 rounded-full -mt-2"
              style={{ width: `${courseProgress.completionPercentage}%` }}
            />
          </div>
        )}

        <div className="mt-auto pt-2">
          {!courseProgress ? (
            <Link className="block w-full" href={`/course/${course.courseId}`}>
              <Button className={primaryButtonStyle}>
                <BookOpen size={16} />
                Xem chi tiết
              </Button>
            </Link>
          ) : (
            <Link
              className="block w-full"
              href={`/course/study/${course.courseId}?lessonId=${courseProgress.currentLesson.lessonId}&lessonOrder=${courseProgress.currentLesson.lessonOrder}`}
            >
              <Button className={continueButtonStyle}>
                <Award size={16} />
                Tiếp tục học
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCards;
