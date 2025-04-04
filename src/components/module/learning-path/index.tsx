"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const formattedDate = new Date(learningPath.createdAt).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <Card className="w-[280px] h-[220px] flex flex-col p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2">
      <CardHeader className="p-0 flex-1">
        <CardTitle className="text-primary font-bold text-xl line-clamp-1">
          {learningPath.title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mt-2 line-clamp-2">
          {learningPath.description}
        </CardDescription>
      </CardHeader>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
        <LandPlot className="w-5 h-5 text-primary" />
        <span>{learningPath.totalCourses} khóa học</span>
      </div>
      <div className="mt-2 text-gray-500 text-xs">{formattedDate}</div>
      <Button
        className="mt-4 w-full bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors duration-200"
        size="sm"
        variant="default"
        onClick={() => router.push(`/learning-path/${learningPath.pathId}`)}
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
    if (status !== "authenticated" || !session?.user?.token) return;

    const fetchLearningPaths = async () => {
      try {
        const data = await getAllLearningPaths(session.user.token);

        console.log("LearningPaths data:", data);
        setLearningPaths(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lộ trình học:", error);
      }
    };

    fetchLearningPaths();
  }, [session, status]);

  if (status === "loading")
    return <div className="text-center text-gray-500">Đang tải...</div>;

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
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-6 tracking-tight">
        Lộ trình gợi ý
      </h2>
      <div className="relative flex items-center">
        <Button
          className="absolute left-[-50px] z-20 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 disabled:opacity-50"
          disabled={currentIndex === 0}
          size="icon"
          variant="outline"
          onClick={handlePrev}
        >
          <ArrowBigLeft className="w-7 h-7 text-primary" />
        </Button>
        <div className="flex w-full justify-around overflow-hidden gap-6">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (280 + 24)}px)`,
              gap: "4px",
            }}
          >
            {learningPaths.map((learningPath) => (
              <div key={learningPath.pathId} className="flex-shrink-0">
                <PathCard learningPath={learningPath} />
              </div>
            ))}
          </div>
        </div>
        <Button
          className="absolute right-[-50px] z-20 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 disabled:opacity-50"
          disabled={currentIndex + itemsPerPage >= learningPaths.length}
          size="icon"
          variant="outline"
          onClick={handleNext}
        >
          <ArrowBigRight className="w-7 h-7 text-primary" />
        </Button>
      </div>
    </div>
  );
}
