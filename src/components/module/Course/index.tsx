"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CourseCards from "./course-card";
import LearningPathCard from "./learning-path-card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CourseList, CourseProgress } from "@/types/course";
import { DomainList } from "@/types/domain";
import { DifficultyLevel } from "@/types/difficulty-level";
import {
  getAllCourse,
  getStudentAllCourseProgress,
} from "@/app/api/course/course.api";
import { getAllDifficultyLevel } from "@/app/api/difficulty-level/difficulty-level.api";
import { getChildrenDomain } from "@/app/api/domain/system.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";
import { LearningPath } from "@/types/learningpath";
import { getAllLearningPaths } from "@/app/api/learningpath/learningpath.api";
import { Button } from "@/components/ui/button";

export default function CourseModule() {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [coursesList, setCoursesList] = useState<CourseList>();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [domains, setDomains] = useState<DomainList>();
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>(
    [],
  );
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const memoizedDomains = useMemo(() => domains, [domains]);
  const memoizedDifficultyLevels = useMemo(
    () => difficultyLevels,
    [difficultyLevels],
  );

  const fetchCoursesProgress = async () => {
    const response = await getStudentAllCourseProgress(
      Number(session?.user.studentId),
      session?.user.token as string,
    );

    setCourseProgress(response);
  };

  const fetchLearningPaths = async () => {
    try {
      const data = await getAllLearningPaths(session?.user.token as string);

      setLearningPaths(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lộ trình học:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsloading(true);
      const response = await getAllCourse({
        token: session?.user.token as string,
        pageNo: currentPage,
        pageSize: 5,
        sortBy: "createdAt",
        sortDir: "desc",
        keyword: debouncedSearchValue,
        domainId: selectedDomain,
        difficultyLevelId: selectedLevel,
      });

      setCoursesList(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsloading(false);
    }
  };

  const fetchDomain = async () => {
    try {
      const response = await getChildrenDomain({
        token: session?.user.token as string,
        pageNo: 0,
        pageSize: 20,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      setDomains(response);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDifficultyLevel = async () => {
    try {
      const response = await getAllDifficultyLevel(
        session?.user.token as string,
      );

      setDifficultyLevels(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDomainChange = (value: string) => {
    setSelectedDomain(value === "None" ? null : parseInt(value, 10));
    if (currentPage === 0) {
      return;
    }
    setCurrentPage(0);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value === "None" ? null : parseInt(value, 10));
    if (currentPage === 0) {
      return;
    }
    setCurrentPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setDebouncedSearchValue(event.target.value);
    }, 500);

    setTimeoutId(id);
  };

  useEffect(() => {
    if (!session?.user?.token) return;
    const fetchData = async () => {
      setIsloading(true);
      try {
        await fetchCourses();
        await Promise.all([
          fetchLearningPaths(),
          fetchDomain(),
          fetchDifficultyLevel(),
          fetchCoursesProgress(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [session?.user?.token]);

  useEffect(() => {
    if (!session?.user?.token) {
      return;
    }
    fetchCourses();
  }, [debouncedSearchValue, selectedDomain, currentPage, selectedLevel]);

  const loading =
    isLoading || !memoizedDomains || !memoizedDifficultyLevels.length;

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full flex flex-col space-y-6 bg-white dark:bg-black p-10">
      {learningPaths && learningPaths.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Lộ trình học tập gợi ý</h2>
          <div className="relative">
            <div className="relative overflow-hidden">
              <div
                className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                id="learning-paths-carousel"
              >
                {learningPaths.map((path) => (
                  <div
                    key={path.pathId}
                    className="flex-shrink-0 w-[calc(33.33%-1rem)]"
                  >
                    <LearningPathCard learningPath={path} />
                  </div>
                ))}
              </div>
            </div>
            {learningPaths.length > 3 && (
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const carousel = document.getElementById(
                      "learning-paths-carousel",
                    );

                    if (carousel) {
                      const setWidth = carousel.offsetWidth / 3;

                      carousel.scrollLeft -= setWidth;
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const carousel = document.getElementById(
                      "learning-paths-carousel",
                    );

                    if (carousel) {
                      const setWidth = carousel.offsetWidth / 3;

                      carousel.scrollLeft += setWidth;
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      {courseProgress && courseProgress.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Khóa học của tôi</h2>
          <div className="relative">
            <div className="relative overflow-hidden">
              <div
                className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                id="course-progress-carousel"
              >
                {courseProgress?.map((courseProgress) => (
                  <div
                    key={courseProgress.progressId}
                    className="flex-shrink-0 w-[calc(33.33%-1rem)]"
                  >
                    <CourseCards
                      course={courseProgress.course}
                      courseProgress={courseProgress}
                    />
                  </div>
                ))}
              </div>
            </div>
            {courseProgress.length > 3 && (
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const carousel = document.getElementById(
                      "course-progress-carousel",
                    );

                    if (carousel) {
                      const setWidth = carousel.offsetWidth / 3;

                      carousel.scrollLeft -= setWidth;
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const carousel = document.getElementById(
                      "course-progress-carousel",
                    );

                    if (carousel) {
                      const setWidth = carousel.offsetWidth / 3;

                      carousel.scrollLeft += setWidth;
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      <h2 className="text-2xl font-bold">Khóa học của TechNihongo</h2>
      <div className="w-full flex flex-row justify-between">
        <Input
          className="w-[300px]"
          placeholder="Tìm tên"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <div className="flex flex-row space-x-4">
          <Select disabled={loading} onValueChange={handleDomainChange}>
            <SelectTrigger className="w-[300px]">
              <SelectValue
                placeholder={loading ? "Đang tải ..." : "Chọn lĩnh vực"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">Trống</SelectItem>
              {memoizedDomains?.content.map((domain) => (
                <SelectItem
                  key={domain.domainId}
                  value={domain.domainId.toString()}
                >
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select disabled={loading} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-[300px]">
              <SelectValue
                placeholder={loading ? "Đang tải ..." : "Chọn độ khó"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">Trống</SelectItem>
              {memoizedDifficultyLevels.map((level) => (
                <SelectItem
                  key={level.levelId}
                  value={level.levelId.toString()}
                >
                  {level.tag} : {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative">
        <div className="relative overflow-hidden">
          <div
            className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
            id="courses-carousel"
          >
            {coursesList?.content.map((course) => (
              <div
                key={course.courseId}
                className="flex-shrink-0 w-[calc(33.33%-1rem)]"
              >
                <CourseCards course={course} />
              </div>
            ))}
          </div>
        </div>
        {coursesList?.content && coursesList.content.length > 3 && (
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const carousel = document.getElementById("courses-carousel");

                if (carousel) {
                  const setWidth = carousel.offsetWidth / 3;

                  carousel.scrollLeft -= setWidth;
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const carousel = document.getElementById("courses-carousel");

                if (carousel) {
                  const setWidth = carousel.offsetWidth / 3;

                  carousel.scrollLeft += setWidth;
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
