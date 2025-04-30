"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarIcon, User2Icon, Camera } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";
import {
  getUserById,
  updateUserNameFunction,
  updateUserProfile,
  updateDailyGoal,
} from "@/app/api/profile/profile.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";

const formatDateToDisplay = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
};

const formatDateToSave = (dateString: string) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableBio, setEditableBio] = useState("");
  const [editableDob, setEditableDob] = useState("");
  const [editableOccupation, setEditableOccupation] = useState("");
  const [editableReminder, setEditableReminder] = useState(false);
  const [editableReminderTime, setEditableReminderTime] = useState("08:00");
  const [dobError, setDobError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [editableDailyGoal, setEditableDailyGoal] = useState<number | null>(
    null,
  );

  const validateUserName = (name: string) => {
    const hasLetter = /[a-zA-Z]/.test(name);

    if (!hasLetter && name.length > 0) {
      setUserNameError("Tên người dùng phải chứa ít nhất một chữ cái.");

      return false;
    }
    setUserNameError("");

    return true;
  };

  const validateDate = (dateString: string) => {
    if (!dateString) return true;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dateRegex.test(dateString)) {
      setDobError("Vui lòng nhập đúng định dạng DD/MM/YYYY");

      return false;
    }
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) {
      setDobError("Ngày không hợp lệ");

      return false;
    }
    setDobError("");

    return true;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setEditableDob(value);
    if (!validateDate(value)) return;
    const formattedValue = formatDateToSave(value);
    const selectedDate = new Date(formattedValue);
    const today = new Date();

    if (selectedDate > today) {
      setDobError("Ngày sinh không được ở tương lai.");
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

      setUser(data);
      setEditableUserName(data.userName);
      setEditableBio(data.student?.bio || "");
      setEditableDob(data.dob ? formatDateToDisplay(data.dob) : "");
      setEditableOccupation(data.student?.occupation || "");
      setEditableReminder(data.student?.reminderEnabled ?? false);
      setEditableReminderTime(
        data.student?.reminderTime
          ? data.student.reminderTime.slice(0, 5)
          : "08:00",
      );
      setEditableDailyGoal(data.student?.dailyGoal || null);
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
    if (!validateDate(editableDob)) return;

    if (editableDailyGoal !== null && editableDailyGoal < 30) {
      setSaveMessage("Mục tiêu hàng ngày phải từ 30 phút trở lên.");

      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const token = session?.user.token as string;

      if (editableUserName !== user.userName) {
        await updateUserNameFunction(token, user.userId, editableUserName);
      }

      if (editableDailyGoal !== user.dailyGoal) {
        await updateDailyGoal(token, user.userId, editableDailyGoal || 0);
      }

      const formattedReminderTime = editableReminder
        ? `${editableReminderTime}:00`
        : null;

      await updateUserProfile(token, user.userId, {
        bio: editableBio,
        dob: editableDob ? formatDateToSave(editableDob) : null,
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

      await fetchUserData();
      setSaveMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setSaveMessage("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingAnimation />;
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
                placeholder="DD/MM/YYYY"
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
              htmlFor="dailyGoal"
            >
              Mục tiêu học hàng ngày
            </label>
            <div className="flex items-center gap-2">
              <Input
                className="w-32"
                id="dailyGoal"
                max="100"
                min="1"
                placeholder="Nhập số phút mục tiêu"
                type="number"
                value={editableDailyGoal || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setEditableDailyGoal(isNaN(value) ? null : value);
                }}
              />
              <span className="text-sm text-gray-500">phút/ngày</span>
            </div>
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
