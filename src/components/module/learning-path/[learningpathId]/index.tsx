"use client";

import type { PathCourse } from "@/types/pathcourse";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getPathCourseListByLearningPathId } from "@/app/api/pathcourse/pathcourse.api";

export default function LearningPathRoadmap() {
  const { data: session, status } = useSession();
  const { learningpathId } = useParams();
  const router = useRouter();
  const [pathCourses, setPathCourses] = useState<PathCourse[]>([]);
  const [learningPathName, setLearningPathName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!learningpathId) {
      setError(" Không tìm thấy ID lộ trình.");
      setLoading(false);

      return;
    }

    const fetchPathCourses = async () => {
      if (status === "loading" || !session?.user?.token) return;

      try {
        const response = await getPathCourseListByLearningPathId({
          pathId: Number.parseInt(learningpathId as string),
          token: session.user.token,
          pageNo: 0,
          pageSize: 100,
          sortBy: "courseOrder",
          sortDir: "asc",
        });

        if (!response || response.length === 0) {
          setError("Không có khóa học nào trong lộ trình này.");

          return;
        }

        const learningPathTitle = response[0]?.learningPath?.title;

        setLearningPathName(learningPathTitle || "Lộ trình học tập");
        setPathCourses(response);
      } catch (error) {
        setError("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchPathCourses();
  }, [session?.user.token, status, learningpathId]);

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
      case "cơ bản":
        return "bg-blue-500";
      case "intermediate":
      case "trung bình":
        return "bg-yellow-500";
      case "advanced":
      case "nâng cao":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getCourseIcon = (index: number) => {
    const icons = [BookOpen, Award, BarChart3, Clock, CheckCircle2];

    return icons[index % icons.length];
  };

  if (loading) return <div className="text-center p-8">Đang tải...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-12">
        <Button
          className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200"
          size="icon"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
          {learningPathName || "Lộ trình học tập"}
        </h1>
        <div className="w-12" />
      </div>

      <div className="relative">
        <div className="absolute w-1 bg-gray-200 top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
        {pathCourses.map((course, index) => {
          const segmentHeight = `${100 / pathCourses.length}%`;
          const top = `${(index / pathCourses.length) * 100}%`;
          const difficultyColor = getDifficultyColor(
            course.course.difficultyLevel.name,
          );

          return (
            <div
              key={`line-${course.pathCourseId}`}
              className={`absolute w-1 ${difficultyColor} left-1/2 transform -translate-x-1/2`}
              style={{ top, height: segmentHeight }}
            />
          );
        })}

        <div className="space-y-24 relative py-4">
          {pathCourses.map((course, index) => {
            const isEven = index % 2 === 0;
            const CourseIcon = getCourseIcon(index);
            const difficultyColor = getDifficultyColor(
              course.course.difficultyLevel.name,
            );

            return (
              <div
                key={course.pathCourseId}
                className="flex items-center relative"
              >
                {isEven && (
                  <div className="w-1/2 pr-8 md:pr-12 text-right">
                    <Card
                      className="inline-block w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-300 border-l-4"
                      style={{
                        borderLeftColor: difficultyColor.replace("bg-", "rgb("),
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          {course.course.thumbnailUrl && (
                            <img
                              alt={course.course.title}
                              className="w-1/2 h-auto object-cover rounded-md"
                              src={course.course.thumbnailUrl}
                            />
                          )}
                          <div className="flex-1 text-left">
                            <span className="text-sm font-medium text-gray-500 mb-1 block">
                              Khóa học {course.courseOrder}
                            </span>
                            <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                              {course.course.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 line-clamp-2">
                              {course.course.description}
                            </CardDescription>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">Mức độ:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs ${difficultyColor}`}
                              >
                                {course.course.difficultyLevel.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                )}

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-16 h-16 rounded-full ${difficultyColor} flex items-center justify-center z-10 border-4 border-white shadow-lg`}
                  >
                    <CourseIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {!isEven && (
                  <div className="w-1/2 pl-8 md:pl-12 ml-auto">
                    <Card
                      className="inline-block w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-300 border-l-4"
                      style={{
                        borderLeftColor: difficultyColor.replace("bg-", "rgb("),
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          {course.course.thumbnailUrl && (
                            <img
                              alt={course.course.title}
                              className="w-1/2 h-auto object-cover rounded-md"
                              src={course.course.thumbnailUrl}
                            />
                          )}
                          <div className="flex-1 text-left">
                            <span className="text-sm font-medium text-gray-500 mb-1 block">
                              Khóa học {course.courseOrder}
                            </span>
                            <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                              {course.course.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 line-clamp-2">
                              {course.course.description}
                            </CardDescription>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">Mức độ:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs ${difficultyColor}`}
                              >
                                {course.course.difficultyLevel.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center text-gray-600">
        <p className="max-w-2xl mx-auto">
          Hoàn thành lộ trình học tập này để nâng cao kỹ năng của bạn. Mỗi khóa
          học được thiết kế để xây dựng trên kiến thức từ các khóa học trước đó.
        </p>
      </div>
    </div>
  );
}
