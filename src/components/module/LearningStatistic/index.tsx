"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  Flame,
  LogIn,
  MessageSquare,
  RefreshCw,
  BookOpen,
  TrendingUp,
  GraduationCap,
  BookOpenCheck,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Thêm import này

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getLearningLog,
  getLearningStatistics,
  getActivityLog,
} from "@/app/api/learningLog/learninglog.api";

interface LearningLog {
  logId: number;
  student: Student;
  logDate: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
  dailyGoalAchieved: boolean;
  streak: number;
  createdAt: string;
}

interface LearningStatistics {
  learningStatId: number;
  student: Student;
  totalStudyTime: number;
  totalCompletedCourses: number;
  totalCompletedLessons: number;
  totalCompletedQuizzes: number;
  activeDaysCount: number;
  maxDaysStreak: number;
  totalAchievementsUnlocked: number;
  lastStudyDate: string;
  updatedAt: string;
}

interface Student {
  studentId: number;
  bio: string | null;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: string | null;
  updatedAt: string;
}

interface ActivityLog {
  logId: number;
  description: string;
  activityType: string;
  createdAt: string;
}

// Component Loading Animation giống SubscriptionHistoryPage
const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center">
      <DotLottieReact
        autoplay
        loop
        className="w-40 h-40"
        src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
      />
      <p className="text-gray-500 mt-2 animate-pulse">Đang tải dữ liệu...</p>
    </div>
  );
};

export default function DailyTracker() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("activity");
  const [learningData, setLearningData] = useState<LearningLog | null>(null);
  const [statsData, setStatsData] = useState<LearningStatistics | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityLog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 4;
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  const calculateProgress = () => {
    if (!learningData || !learningData.student.dailyGoal) return 0;
    const progress =
      (learningData.studyTime / learningData.student.dailyGoal) * 100;

    return Math.min(progress, 100);
  };

  const getDaysOfWeek = () => {
    const today = new Date();
    const day = today.getDay();

    return Array(7)
      .fill(0)
      .map((_, i) => {
        const vietnamIndex = i + 1 > 7 ? 1 : i + 1;
        const isCurrentDay = vietnamIndex === (day === 0 ? 7 : day);

        return {
          shortName: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i],
          isCurrentDay,
          completed: isCurrentDay
            ? learningData?.dailyGoalAchieved
            : vietnamIndex < (day === 0 ? 7 : day),
        };
      });
  };

  const fetchData = async (forceRefresh = false) => {
    if (status === "loading" || (dataFetchedRef.current && !forceRefresh))
      return;
    if (status === "unauthenticated" || !session?.user?.token) {
      setError("Vui lòng đăng nhập để xem thống kê");
      setLoading(false);

      return;
    }

    try {
      if (forceRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);

      const currentDate = new Date().toISOString().split("T")[0];
      const studentId = Number(session.user.studentId) || 18;

      const [logData, statsData, activityData] = await Promise.all([
        getLearningLog({
          token: session.user.token as string,
          date: currentDate,
        }),
        getLearningStatistics({
          token: session.user.token as string,
          studentId,
        }),
        getActivityLog({ token: session.user.token as string }),
      ]);

      setLearningData(logData);
      setStatsData(statsData);
      setActivityLog(activityData);
      setVisibleActivities(activityData.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(0);
      dataFetchedRef.current = true;
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => fetchData(true);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newActivities = activityLog.slice(startIndex, endIndex);

    setVisibleActivities((prev) => [...prev, ...newActivities]);
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    fetchData();
  }, [session, status]);

  const renderIcon = (iconType: string) => {
    switch (iconType.toLowerCase()) {
      case "lesson":
        return <BookOpen className="h-5 w-5 text-white" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-white" />;
      case "streak":
        return <Flame className="h-5 w-5 text-white" />;
      case "coin":
        return <Coins className="h-5 w-5 text-white" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-white" />;
      case "daily":
        return <Calendar className="h-5 w-5 text-white" />;
      case "login":
        return <LogIn className="h-5 w-5 text-white" />;
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-white" />;
      default:
        return <FileText className="h-5 w-5 text-white" />;
    }
  };

  const getIconBgColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "lesson":
        return "bg-indigo-600";
      case "system":
        return "bg-blue-600";
      case "login":
        return "bg-cyan-600";
      case "complete":
        return "bg-green-600";
      case "streak":
        return "bg-amber-600";
      case "coin":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getIconContainerBgColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "lesson":
        return "bg-indigo-100";
      case "system":
        return "bg-blue-100";
      case "login":
        return "bg-cyan-100";
      case "complete":
        return "bg-green-100";
      case "streak":
        return "bg-amber-100";
      case "coin":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans flex flex-col items-center justify-center py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const daysOfWeek = getDaysOfWeek();

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-[#57D061]" />
          Theo dõi học tập
        </h2>
        <Button
          className="flex items-center gap-2 transition-all hover:scale-105"
          disabled={isRefreshing}
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>

      <div className="mb-8 w-full">
        <Card className="bg-gradient-to-r from-[#57D061] to-[#45A94F] text-white border-none relative overflow-hidden shadow-lg rounded-xl w-full">
          <div className="absolute right-0 top-0 opacity-10">
            <Flame className="h-40 w-40 -mr-10 -mt-10" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-1">Streak hiện tại</h3>
                <p className="text-white/80 text-sm">
                  Duy trì thói quen học tập mỗi ngày
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3 shadow-inner">
                <Flame className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mt-3 mb-5">
              <Badge
                className="bg-white/20 backdrop-blur-sm border-none px-4 py-2 text-lg"
                variant="outline"
              >
                <span className="text-3xl font-bold mr-2">
                  {learningData?.streak || 0}
                </span>
                <span className="text-sm">ngày streak</span>
              </Badge>
              {statsData?.maxDaysStreak && (
                <Badge
                  className="bg-white/20 backdrop-blur-sm border-none px-4 py-2"
                  variant="outline"
                >
                  <Trophy className="h-4 w-4 mr-1 text-yellow-300" />
                  <span className="text-sm">
                    Kỷ lục: {statsData.maxDaysStreak} ngày
                  </span>
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-7 gap-3 my-4">
              {daysOfWeek.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xs mb-1 font-medium">
                    {day.shortName}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${day.isCurrentDay
                        ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                        : ""
                      } ${day.completed ? "bg-white text-[#57D061]" : "bg-white/30"}`}
                  >
                    {day.completed && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                </div>
              ))}
            </div>
            {statsData && (
              <div className="text-sm mt-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Tổng ngày hoạt động:{" "}
                <span className="font-bold ml-1">
                  {statsData.activeDaysCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 border shadow-md">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2 text-[#57D061]" />
            Mục tiêu hàng ngày
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Thời gian học</span>
              <span className="text-sm font-medium">
                {learningData?.studyTime || 0} /{" "}
                {learningData?.student?.dailyGoal || 0} phút
              </span>
            </div>
            <Progress className="h-2 mb-4" value={progress} />
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center text-blue-700 mb-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Bài học</span>
                </div>
                <span className="text-lg font-bold">
                  {learningData?.completedLessons || 0}
                </span>
              </div>
              <div className="flex flex-col bg-indigo-50 p-3 rounded-lg">
                <div className="flex items-center text-indigo-700 mb-1">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Quiz</span>
                </div>
                <span className="text-lg font-bold">
                  {learningData?.completedQuizzes || 0}
                </span>
              </div>
              <div className="flex flex-col bg-green-50 p-3 rounded-lg">
                <div className="flex items-center text-green-700 mb-1">
                  <BookOpenCheck className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Tài liệu</span>
                </div>
                <span className="text-lg font-bold">
                  {learningData?.completedResources || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent w-full justify-center p-0 h-auto mb-2 border-b">
          <TabsTrigger
            className="rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#57D061] data-[state=active]:shadow-none bg-transparent data-[state=active]:text-[#57D061] transition-all"
            value="activity"
          >
            <Clock className="h-4 w-4 mr-2" />
            Thống kê học tập
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#57D061] data-[state=active]:shadow-none bg-transparent data-[state=active]:text-[#57D061] transition-all"
            value="stats"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Thống kê tổng quát
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#57D061] data-[state=active]:shadow-none bg-transparent data-[state=active]:text-[#57D061] transition-all"
            value="activityLog"
          >
            <FileText className="h-4 w-4 mr-2" />
            Nhật ký hoạt động
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="activity">
          <div className="text-sm text-gray-500 mb-6 flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Clock className="h-4 w-4 mr-2 text-amber-500" />
            <span>Lưu ý: Lần đã đăng nhập sẽ được tính là trong 30 ngày</span>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-medium mb-4 flex items-center px-3 py-2 bg-gray-50 rounded-lg border-l-4 border-[#57D061]">
                <Calendar className="h-5 w-5 mr-2 text-[#57D061]" />
                {learningData?.logDate || "Hôm nay"}
              </h3>
              <div className="space-y-5">
                <Card className="border shadow-sm overflow-hidden">
                  <div className="flex">
                    <div className="bg-blue-600 px-4 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <CardContent className="py-4">
                      <div className="font-medium text-lg">Thời gian học</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <span className="font-semibold text-blue-600 mr-1">
                            {learningData?.studyTime || 0} phút
                          </span>
                          <span>
                            / {learningData?.student?.dailyGoal || 0} phút
                          </span>
                        </div>
                        <Progress className="h-1.5 mt-2" value={progress} />
                      </div>
                    </CardContent>
                  </div>
                </Card>
                <Card className="border shadow-sm overflow-hidden">
                  <div className="flex">
                    <div className="bg-indigo-600 px-4 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <CardContent className="py-4">
                      <div className="font-medium text-lg">
                        Bài học hoàn thành
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-bold text-indigo-600">
                          {learningData?.completedLessons || 0}
                        </span>
                        <Badge className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                          {learningData?.completedLessons
                            ? `+${learningData?.completedLessons}`
                            : "0"}{" "}
                          hôm nay
                        </Badge>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                <Card className="border shadow-sm overflow-hidden">
                  <div className="flex">
                    <div className="bg-green-600 px-4 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <CardContent className="py-4">
                      <div className="font-medium text-lg">Quiz hoàn thành</div>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-bold text-green-600">
                          {learningData?.completedQuizzes || 0}
                        </span>
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                          {learningData?.completedQuizzes
                            ? `+${learningData?.completedQuizzes}`
                            : "0"}{" "}
                          hôm nay
                        </Badge>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          {statsData ? (
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-2">
                  <h4 className="text-blue-800 font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Thời gian học tập
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-700">
                      {statsData.totalStudyTime}
                    </span>
                    <span className="ml-2 text-gray-500">phút</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Tương đương với {Math.floor(statsData.totalStudyTime / 60)}{" "}
                    giờ {statsData.totalStudyTime % 60} phút
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 pb-2">
                  <h4 className="text-indigo-800 font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Khóa học hoàn thành
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-indigo-700">
                      {statsData.totalCompletedCourses}
                    </span>
                    <span className="ml-2 text-gray-500">khóa học</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-2">
                  <h4 className="text-green-800 font-medium flex items-center">
                    <BookOpenCheck className="h-4 w-4 mr-2" />
                    Bài học hoàn thành
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-green-700">
                      {statsData.totalCompletedLessons}
                    </span>
                    <span className="ml-2 text-gray-500">bài học</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-2">
                  <h4 className="text-purple-800 font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Quiz hoàn thành
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-700">
                      {statsData.totalCompletedQuizzes}
                    </span>
                    <span className="ml-2 text-gray-500">quiz</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-2">
                  <h4 className="text-amber-800 font-medium flex items-center">
                    <Flame className="h-4 w-4 mr-2" />
                    Hoạt động
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500 mb-1">
                        Ngày hoạt động
                      </div>
                      <div className="font-bold text-xl">
                        {statsData.activeDaysCount}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500 mb-1">
                        Streak tối đa
                      </div>
                      <div className="font-bold text-xl">
                        {statsData.maxDaysStreak}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 pb-2">
                  <h4 className="text-yellow-800 font-medium flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Thành tích
                  </h4>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-yellow-700">
                      {statsData.totalAchievementsUnlocked}
                    </span>
                    <span className="ml-2 text-gray-500">thành tích</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Cập nhật lần cuối:{" "}
                    {new Date(statsData.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <Coins className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chưa có dữ liệu thống kê</p>
              <p className="text-sm mt-2">
                Hoàn thành bài học để xem thống kê của bạn
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activityLog">
          {activityLog.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#57D061] mb-4">
                <h3 className="font-medium flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-2 text-[#57D061]" />
                  Nhật ký hoạt động
                </h3>
                <p className="text-sm text-gray-500">
                  Các hoạt động gần đây của bạn
                </p>
              </div>
              <div className="divide-y border rounded-lg shadow-sm bg-white">
                {visibleActivities.map((log) => (
                  <div
                    key={log.logId}
                    className="p-4 flex gap-3 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`${getIconContainerBgColor(log.activityType.toLowerCase())} p-2 rounded-lg h-12 w-12 flex items-center justify-center shadow-sm`}
                    >
                      <div
                        className={`w-7 h-7 ${getIconBgColor(log.activityType.toLowerCase())} rounded-md flex items-center justify-center shadow-sm`}
                      >
                        {renderIcon(log.activityType.toLowerCase())}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{log.description}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Badge
                      className={`${getIconContainerBgColor(log.activityType.toLowerCase()).replace("bg-", "bg-")} ${log.activityType.toLowerCase() === "lesson"
                          ? "text-indigo-800"
                          : log.activityType.toLowerCase() === "complete"
                            ? "text-green-800"
                            : log.activityType.toLowerCase() === "login"
                              ? "text-cyan-800"
                              : "text-gray-800"
                        }`}
                    >
                      {log.activityType}
                    </Badge>
                  </div>
                ))}
              </div>
              {visibleActivities.length < activityLog.length && (
                <div className="text-center mt-6">
                  <Button
                    className="px-6 py-2 hover:bg-gray-100 transition-all"
                    variant="outline"
                    onClick={handleLoadMore}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Xem thêm nhật ký
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chưa có nhật ký hoạt động</p>
              <p className="text-sm mt-2">
                Hoàn thành bài học để xem nhật ký hoạt động của bạn
              </p>
              <Button className="mt-4" variant="outline">
                Bắt đầu học
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-xs text-center text-gray-400 mt-6 pt-4 border-t">
        <p>
          © 2025 Learning Tracking Platform. Tất cả dữ liệu được cập nhật theo
          thời gian thực.
        </p>
      </div>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
