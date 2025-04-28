import { LandPlot } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { LearningPath } from "@/types/learningpath";

interface LearningPathCardProps {
    learningPath: LearningPath;
}
const LearningPathCard = ({ learningPath }: LearningPathCardProps) => {
    return (
        <Card className=" h-[220px] flex flex-col p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2">
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
            <div className="mt-2 text-gray-500 text-xs">
                {new Date(learningPath.createdAt).toLocaleDateString()}
            </div>
            <Link href={`/learning-path/${learningPath.pathId}`}>
                <Button
                    className="mt-4 w-full bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors duration-200"
                    size="sm"
                    variant="default"
                >
                    Xem chi tiết
                </Button>
            </Link>
        </Card>
    );
};

export default LearningPathCard;
