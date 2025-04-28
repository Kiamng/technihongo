"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

import MeetingCard from "./meeting-card";

import { getAllMeeting } from "@/app/api/meeting/meeting.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";
import { MeetingList } from "@/types/meeting";
import { useUser } from "@/components/core/common/providers/user-provider";
import EmptyStateComponent from "@/components/core/common/empty-state";

export default function MeetingModule() {
    const { data: session } = useSession();
    const { userName } = useUser();
    const [meetingListData, setMeetingListData] = useState<MeetingList>();
    const [sortDir, setSortDir] = useState<string>("desc");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getNewMeetings = (meetings: MeetingList) => {
        const oneWeekAgo = new Date();

        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return {
            ...meetings,
            content: meetings.content.filter(
                (meeting) => new Date(meeting.createdAt) > oneWeekAgo,
            ),
        };
    };

    const getAllMeetings = (meetings: MeetingList) => {
        return meetings;
    };

    const fetchMeetingList = async () => {
        try {
            if (!session?.user.token) {
                throw new Error("No token found");
            }
            const meeting = await getAllMeeting({
                token: session?.user.token,
                sortBy: "createdAt",
                sortDir: sortDir,
            });

            setMeetingListData(meeting);
        } catch (error) {
            console.error(`Đã có lỗi trong quá trình tải các hội thoại:`, error);
            toast.error(`Tải các cuộc hội thoại thất bại`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetingList();
    }, [session?.user.token, sortDir]);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black space-y-8 p-8">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 rounded-2xl flex flex-row space-x-6 items-center shadow-lg">
                <img
                    alt="img"
                    className="rounded-xl shadow-md"
                    height={180}
                    src={"https://media-public.canva.com/fTcwI/MAF-OXfTcwI/1/t.png"}
                    width={180}
                />
                <div className="w-full flex flex-col space-y-2">
                    <h1 className="text-3xl text-white font-bold">
                        Xin chào {userName},
                    </h1>
                    <h1 className="text-2xl text-white/90 font-semibold">
                        Chọn một cuộc hội thoại và bắt đầu luyện tập nào
                    </h1>
                </div>
            </div>

            {meetingListData &&
                getNewMeetings(meetingListData).content.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Mới
                        </h2>
                        <div className="relative overflow-hidden">
                            <div
                                className="flex space-x-6 overflow-hidden scroll-smooth py-2 px-1"
                                id="new-meetings-carousel"
                            >
                                {getNewMeetings(meetingListData).content.map((meeting) => (
                                    <MeetingCard key={meeting.meetingId} meeting={meeting} />
                                ))}
                            </div>
                        </div>
                        {getNewMeetings(meetingListData).content.length > 3 && (
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                        const carousel = document.getElementById(
                                            "new-meetings-carousel",
                                        );

                                        if (carousel) {
                                            const setWidth = carousel.offsetWidth / 3;

                                            carousel.scrollLeft -= setWidth;
                                        }
                                    }}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                        const carousel = document.getElementById(
                                            "new-meetings-carousel",
                                        );

                                        if (carousel) {
                                            const setWidth = carousel.offsetWidth / 3;

                                            carousel.scrollLeft += setWidth;
                                        }
                                    }}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tất cả cuộc hội thoại
                </h2>
                <div className="relative overflow-hidden">
                    <div
                        className="flex space-x-6 overflow-hidden scroll-smooth py-2 px-1"
                        id="all-meetings-carousel"
                    >
                        {meetingListData ? (
                            getAllMeetings(meetingListData).content.map((meeting) => (
                                <MeetingCard key={meeting.meetingId} meeting={meeting} />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <EmptyStateComponent
                                    imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
                                    message={"Chưa có cuộc hội thoại nào, vui lòng quay lại sau!"}
                                    size={300}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {meetingListData &&
                    getAllMeetings(meetingListData).content.length > 3 && (
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => {
                                    const carousel = document.getElementById(
                                        "all-meetings-carousel",
                                    );

                                    if (carousel) {
                                        const setWidth = carousel.offsetWidth / 3;

                                        carousel.scrollLeft -= setWidth;
                                    }
                                }}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => {
                                    const carousel = document.getElementById(
                                        "all-meetings-carousel",
                                    );

                                    if (carousel) {
                                        const setWidth = carousel.offsetWidth / 3;

                                        carousel.scrollLeft += setWidth;
                                    }
                                }}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
            </div>
        </div>
    );
}
