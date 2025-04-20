"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CalendarIcon, User2Icon, Camera } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";
import {
  getUserById,
  updateUserNameFunction,
  updateUserProfile,
} from "@/app/api/profile/profile.api";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Thêm trạng thái lưu

  const [editableUserName, setEditableUserName] = useState("");
  const [editableBio, setEditableBio] = useState("");
  const [editableDob, setEditableDob] = useState("");
  const [editableOccupation, setEditableOccupation] = useState("");
  const [editableReminder, setEditableReminder] = useState(false);
  const [editableReminderTime, setEditableReminderTime] = useState("08:00");
  const [dobError, setDobError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [saveMessage, setSaveMessage] = useState(""); // Thông báo thành công/lỗi

  const validateUserName = (name: string) => {
    const hasLetter = /[a-zA-Z]/.test(name);

    if (!hasLetter && name.length > 0) {
      setUserNameError("Tên người dùng phải chứa ít nhất một chữ cái.");

      return false;
    }
    setUserNameError("");

    return true;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setEditableDob(value);

    const selectedDate = new Date(value);
    const today = new Date();

    if (selectedDate > today) {
      setDobError("❌ Ngày sinh không được ở tương lai.");
    } else {
      setDobError("");
    }
  };

  const fetchUserData = useCallback(async () => {
    const userId = Number(session?.user?.id);

    if (!userId || !session?.user.token) {
      console.error("Không tìm thấy userId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await getUserById(session?.user.token, userId);
      const data = response.data;

      console.log("User data from API:", data);
      setUser(data);
      setEditableUserName(data.userName);
      setEditableBio(data.student?.bio || "");
      setEditableDob(data.dob || "");
      setEditableOccupation(data.student?.occupation || "");
      setEditableReminder(data.student?.reminderEnabled ?? false);
      setEditableReminderTime(
        data.student?.reminderTime
          ? data.student.reminderTime.slice(0, 5)
          : "08:00",
      );
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
    if (!user) return;
    if (!validateUserName(editableUserName)) return;

    setIsSaving(true);
    setSaveMessage(""); // Xóa thông báo cũ

    try {
      const token = session?.user.token as string;

      if (editableUserName !== user.userName) {
        await updateUserNameFunction(token, user.userId, editableUserName);
      }

      const formattedReminderTime = editableReminder
        ? `${editableReminderTime}:00`
        : null;

      await updateUserProfile(token, user.userId, {
        bio: editableBio,
        dob: editableDob,
        occupation: [
          "STUDENT",
          "EMPLOYED",
          "UNEMPLOYED",
          "FREELANCER",
          "OTHER",
        ].includes(editableOccupation)
          ? (editableOccupation as
              | "STUDENT"
              | "EMPLOYED"
              | "UNEMPLOYED"
              | "FREELANCER"
              | "OTHER")
          : undefined,
        reminderEnabled: editableReminder,
        reminderTime: formattedReminderTime,
      });

      await fetchUserData(); // Cập nhật dữ liệu mà không reload
      setSaveMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(" Lỗi cập nhật thông tin:", error);
      setSaveMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (!user)
    return (
      <p className="text-center mt-10">Không tìm thấy dữ liệu người dùng.</p>
    );

  return (
    <div className="min-h-screen w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full bg-[#56D071] p-6 text-white">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-medium">Thông tin tài khoản</h1>
            <p className="text-sm opacity-90">
              Bạn có thể chỉnh sửa thông tin tài khoản tại đây
            </p>
          </div>
        </div>

        <div className="relative mt-4 inline-block">
          <div className="w-16 h-16 rounded-full bg-white p-1">
            <div className="w-full h-full rounded-full bg-[#56D071]/20 flex items-center justify-center overflow-hidden">
              {user.profileImg ? (
                <Image
                  alt="Profile avatar"
                  height={60}
                  src={user.profileImg}
                  width={60}
                />
              ) : (
                <Image
                  alt="Profile avatar"
                  height={60}
                  src="/assets/images/logo.png"
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

      <div className="border-b">
        <div className="flex">
          <div className="px-6 py-3 border-b-2 border-[#56D071] text-[#56D071] font-medium">
            Thông tin cá nhân
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="userName"
            >
              Tên người dùng
            </label>
            <div className="relative">
              <Input
                className={`pl-10 ${userNameError ? "border-red-500" : ""}`}
                id="userName"
                placeholder="Nhập tên học viên"
                value={editableUserName}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setEditableUserName(newValue);
                  validateUserName(newValue);
                }}
              />
              <User2Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {userNameError && (
              <p className="text-red-500 text-sm mt-1">{userNameError}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="dob"
            >
              Ngày sinh
            </label>
            <div className="relative">
              <Input
                className={`pl-10 ${dobError ? "border-red-500" : ""}`}
                id="dob"
                max={new Date().toISOString().split("T")[0]}
                type="date"
                value={editableDob}
                onChange={handleDobChange}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {dobError && (
              <p className="text-red-500 text-sm mt-1">{dobError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="bio"
            >
              Tiểu sử
            </label>
            <Input
              id="bio"
              value={editableBio}
              onChange={(e) => setEditableBio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="occupation"
            >
              Nghề nghiệp
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              id="occupation"
              value={editableOccupation}
              onChange={(e) => setEditableOccupation(e.target.value)}
            >
              <option value="">Chọn nghề nghiệp</option>
              <option value="STUDENT">Học sinh / Sinh viên</option>
              <option value="EMPLOYED">Đã đi làm</option>
              <option value="UNEMPLOYED">Thất nghiệp</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="reminderEnabled"
            >
              Nhắc nhở bật/tắt
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              id="reminderEnabled"
              value={editableReminder ? "true" : "false"}
              onChange={(e) => setEditableReminder(e.target.value === "true")}
            >
              <option value="true">Bật</option>
              <option value="false">Tắt</option>
            </select>
          </div>

          {editableReminder && (
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="reminderTime"
              >
                Chọn thời điểm nhận lời nhắc học tập
              </label>
              <Input
                className="w-full"
                id="reminderTime"
                type="time"
                value={editableReminderTime}
                onChange={(e) => setEditableReminderTime(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            className="bg-[#56D071] hover:bg-[#56D071]/90"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Đang lưu..." : "Lưu thông tin"}
          </Button>
        </div>
        {saveMessage && (
          <p
            className={`mt-4 text-sm ${
              saveMessage.includes("thành công")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
