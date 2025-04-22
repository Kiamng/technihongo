"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import CourseCards from "./course-card";

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

const LoadingAnimation = () => {
  return (
    <DotLottieReact
      autoplay
      loop
      className="w-64 h-64"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coursesList?.content.map((course) => (
          <CourseCards key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
}
