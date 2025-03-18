"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowBigRight, ArrowBigLeft, LandPlot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LearningPath } from "@/types/learningpath";
import { getAllLearningPaths } from "@/app/api/learningpath/learningpath.api";

interface PathCardProps {
  learningPath: LearningPath;
}

function PathCard({ learningPath }: PathCardProps) {
  // Định dạng createdAt thành định dạng ngắn gọn
  const formattedDate = new Date(learningPath.createdAt).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <Card className="w-[250px] h-[200px] flex flex-col p-4 border-2 border-primary rounded-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg z-10">
      <CardHeader className="p-0 flex-1">
        <CardTitle className="text-primary font-bold text-lg">
          {learningPath.title}
        </CardTitle>
        <CardDescription className="text-gray-700 text-sm mt-1 line-clamp-2">
          {learningPath.description}
        </CardDescription>
      </CardHeader>
      <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
        <LandPlot className="w-4 h-4" />
        <span>{learningPath.totalCourses} khóa học</span>
      </div>
      <div className="mt-2 text-gray-700 text-sm">{formattedDate}</div>
      <Button
        className="mt-3 w-full bg-primary text-white hover:bg-primary/90"
        size="sm"
        variant="default"
      >
        Xem chi tiết
      </Button>
    </Card>
  );
}

export function LearningPathModule() {
  const { data: session, status } = useSession();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchLearningPaths = async () => {
      if (status === "loading" || !session?.user?.token) return;
      try {
        const data = await getAllLearningPaths(session.user.token);

        setLearningPaths(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khóa học:", error);
      }
    };

    fetchLearningPaths();
  }, [session, status]);

  if (status === "loading") return <div>Đang tải...</div>;

  const handleNext = () => {
    if (currentIndex + itemsPerPage < learningPaths.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5 bg-white rounded-xl border border-gray-300">
      <h2 className="text-2xl font-semibold text-primary relative z-0 mb-4">
        Lộ trình gợi ý
      </h2>
      <div className="relative flex items-center">
        <Button
          className="absolute left-[-40px] z-20 bg-white rounded-full shadow-md"
          disabled={currentIndex === 0}
          size="icon"
          variant="outline"
          onClick={handlePrev}
        >
          <ArrowBigLeft className="w-6 h-6" />
        </Button>
        <div className="flex w-full justify-around overflow-hidden gap-4">
          {learningPaths
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((learningPath, index) => (
              <PathCard key={index} learningPath={learningPath} />
            ))}
        </div>
        <Button
          className="absolute right-[-40px] z-20 bg-white rounded-full shadow-md"
          disabled={currentIndex + itemsPerPage >= learningPaths.length}
          size="icon"
          variant="outline"
          onClick={handleNext}
        >
          <ArrowBigRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
