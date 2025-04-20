"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarIcon, User2Icon, Camera } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";
import { getUserById, updateUsername } from "@/app/api/profile/profile.api";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editableUserName, setEditableUserName] = useState("");

  const fetchUserData = useCallback(async () => {
    const userId = Number(session?.user?.id);

    if (!userId || !session?.user.token) {
      console.error("Không tìm thấy userId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await getUserById(session?.user.token, userId);

      console.log("User data from API:", response.data);
      setUser(response.data);
      setEditableUserName(response.data.userName);
    } catch (error) {
      console.error("Lỗi lấy user:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchUserData();
  }, [session, fetchUserData]);

  const handleSave = async () => {
    if (user && editableUserName !== user.userName) {
      try {
        await updateUsername(
          session?.user.token as string,
          user.userId,
          editableUserName,
        );
        window.location.reload();
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (!user)
    return (
      <p className="text-center mt-10">Không tìm thấy dữ liệu người dùng.</p>
    );

  return (
    <div className="min-h-screen w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative w-full bg-[#56D071] p-6 text-white">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-medium">Thông tin tài khoản</h1>
            <p className="text-sm opacity-90">
              Bạn có thể chỉnh sửa thông tin tài khoản tại đây
            </p>
          </div>
        </div>

        {/* Profile avatar */}
        <div className="relative mt-4 inline-block">
          <div className="w-16 h-16 rounded-full bg-white p-1">
            <div className="w-full h-full rounded-full bg-[#56D071]/20 flex items-center justify-center overflow-hidden">
              {user.profileImg ? (
                <img
                  alt="Profile avatar"
                  height={60}
                  src={user.profileImg}
                  width={60}
                />
              ) : (
                <img
                  alt="Profile avatar"
                  height={60}
                  src="/placeholder.svg?height=60&width=60"
                  width={60}
                />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#56D071]">
            <Camera className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <div className="px-6 py-3 border-b-2 border-[#56D071] text-[#56D071] font-medium">
            Thông tin cá nhân
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full name */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="userName"
            >
              Tên người dùng
            </label>
            <div className="relative">
              <Input
                className="pl-10"
                id="userName"
                placeholder="Nhập tên học viên"
                value={editableUserName}
                onChange={(e) => setEditableUserName(e.target.value)}
              />
              <User2Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              disabled
              className="bg-gray-100"
              id="email"
              type="email"
              value={user.email}
            />
          </div>

          {/* Date of birth */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="dob"
            >
              Ngày sinh
            </label>
            <div className="relative">
              <Input
                disabled
                className="pl-10"
                id="dob"
                type="date"
                value={user.dob || ""}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="bio"
            >
              Tiểu sử
            </label>
            <Input
              disabled
              className="bg-gray-100"
              id="bio"
              value={user.bio || "Chưa có thông tin"}
            />
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="occupation"
            >
              Nghề nghiệp
            </label>
            <Input
              disabled
              className="bg-gray-100"
              id="occupation"
              value={user.occupation || "Không rõ"}
            />
          </div>

          {/* Reminder Enabled */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="reminderEnabled"
            >
              Nhắc nhở bật/tắt
            </label>
            <Input
              disabled
              className="bg-gray-100"
              id="reminderEnabled"
              value={user.reminderEnabled ? "Bật" : "Tắt"}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            className="bg-[#56D071] hover:bg-[#56D071]/90"
            onClick={handleSave}
          >
            Lưu thông tin
          </Button>
        </div>
      </div>
    </div>
  );
}
