import { LandPlot } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LearningPath } from "@/types/learningpath";

interface LearningPathCardProps {
    learningPath: LearningPath;
}
const LearningPathCard = ({ learningPath }: LearningPathCardProps) => {
    return (
        <div className=" flex flex-col p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 space-y-2">
            <div className="p-0 flex-1">
                <h1 className="text-primary font-bold text-xl line-clamp-1">
                    {learningPath.title}
                </h1>
                <span className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {learningPath.description}
                </span>
            </div>

            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <LandPlot className="w-5 h-5 text-primary" />
                    <span>{learningPath.totalCourses} khóa học</span>
                </div>
                <span className="bg-[#f0f8f3] font-medium px-3 py-1 rounded-full text-[#459a58] text-xs w-fit">
                    {learningPath.domain.name}
                </span>
            </div>
            <Link href={`/course/learning-path/${learningPath.pathId}`}>
                <Button
                    className="mt-4 w-full bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors duration-200"
                    size="sm"
                    variant="default"
                >
                    Xem chi tiết
                </Button>
            </Link>
        </div>
    );
};

export default LearningPathCard;
