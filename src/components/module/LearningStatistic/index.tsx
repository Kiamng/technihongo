"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  Flame,
  Home,
  MessageSquare,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { activityGroups, weekProgress } from "@/types/learningstatistic";

export default function DailyTracker() {
  const [activeTab, setActiveTab] = useState<string>("activity");

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "lesson":
        return <FileText className="h-5 w-5 text-white" />;
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
        return <Home className="h-5 w-5 text-white" />;
      default:
        return <FileText className="h-5 w-5 text-white" />;
    }
  };

  const getIconBgColor = (type: string): string => {
    switch (type) {
      case "lesson":
        return "bg-red-500";
      case "system":
        return "bg-blue-500";
      case "login":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIconContainerBgColor = (type: string): string => {
    switch (type) {
      case "lesson":
        return "bg-red-100";
      case "system":
        return "bg-blue-100";
      case "login":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      {/* Streak Card - Full Width */}
      <div className="mb-8 w-full">
        <Card className="bg-[#40c4c8] text-white border-none relative overflow-hidden shadow-md w-full">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge
                  className="bg-white/20 border-none px-3 py-1.5"
                  variant="outline"
                >
                  <span className="text-2xl font-bold mr-1">1</span>
                  <span className="text-sm">ngày streak</span>
                </Badge>
              </div>
              <div className="bg-white/20 rounded-full p-2">
                <Flame className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mt-4 mb-2">
              {weekProgress.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <div className="text-xs mb-1">{day.day}</div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      day.completed ? "bg-[#2ba9ad]" : "bg-white/30"
                    }`}
                  >
                    {day.completed && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs className="mb-6" defaultValue="activity">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger
            className="rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none bg-transparent"
            value="activity"
            onClick={() => setActiveTab("activity")}
          >
            Thống kê học tập
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none bg-transparent"
            value="stats"
            onClick={() => setActiveTab("stats")}
          >
            Lịch sử hoạt động
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4" value="activity">
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Lưu ý: Lần đã đăng nhập sẽ được tính là trong 30 ngày</span>
          </div>
          <div className="space-y-8">
            {activityGroups.map((group) => (
              <div key={group.date}>
                <h3 className="font-medium mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {group.formattedDate}
                </h3>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className={`${getIconContainerBgColor(item.type)} p-2 rounded-md h-fit`}
                      >
                        <div
                          className={`w-5 h-5 ${getIconBgColor(item.type)} rounded-sm flex items-center justify-center`}
                        >
                          {renderIcon(item.icon)}
                        </div>
                      </div>
                      <div>
                        {item.type === "system" ? (
                          <div className="text-sm">
                            <span className="text-blue-500 font-medium">
                              {item.time}
                            </span>{" "}
                            {item.title}
                          </div>
                        ) : (
                          <>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">
                              {item.timeAgo}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {group !== activityGroups[activityGroups.length - 1] && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="p-8 text-center text-gray-500">
            <Coins className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">Thống kê Coin</h3>
            <p>Chưa có dữ liệu thống kê coin</p>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">Lịch sử hoạt động</h3>
            <p>Chưa có dữ liệu lịch sử hoạt động</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
