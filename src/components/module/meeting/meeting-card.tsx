import { Mic } from "lucide-react";
import Link from "next/link";

import { Meeting } from "@/types/meeting";

interface MeetingCardProps {
    meeting: Meeting;
}
const MeetingCard = ({ meeting }: MeetingCardProps) => {
    return (
        <div className="flex-shrink-0 w-[calc(33.33%-1rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 flex flex-col rounded-2xl hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <div className="flex-1 space-y-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row space-x-3 items-center">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Mic className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                            {meeting.title}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                    {meeting.description || "Không có mô tả"}
                </p>
            </div>
            <div className="flex flex-row justify-between items-center pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(meeting.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/meeting/${meeting.meetingId}`}>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Bắt đầu
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default MeetingCard;
