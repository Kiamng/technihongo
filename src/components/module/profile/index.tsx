"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/profile";
import { getUserById, updateUsername } from "@/app/api/profile/profile.api";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editableUserName, setEditableUserName] = useState("");

  const fetchUserData = useCallback(async () => {
    const userId = Number(session?.user?.id);
    const token = session?.user?.token || (session as any)?.accessToken;

    if (!userId || !token) {
      console.error("Không tìm thấy userId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await getUserById(token, userId);

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
        const token = session?.user?.token || (session as any)?.accessToken;

        await updateUsername(token, user.userId, editableUserName);
        window.location.reload();
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!user) return <p>Không tìm thấy dữ liệu người dùng.</p>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            {user.profileImg ? (
              <Image
                alt="User Avatar"
                className="rounded-full border"
                layout="fill"
                src={user.profileImg}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                No Image
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">Thông tin tài khoản</h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label>Tên học viên</Label>
            <Input
              value={editableUserName}
              onChange={(e) => setEditableUserName(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input disabled value={user.email} />
          </div>
          <div>
            <Label>Ngày sinh</Label>
            <Input disabled value={user.dob || "Không có"} />
          </div>
          <div>
            <Label>Tiểu sử</Label>
            <Input disabled value={user.bio || "Chưa có thông tin"} />
          </div>
          <div>
            <Label>Nghề nghiệp</Label>
            <Input disabled value={user.occupation || "Không rõ"} />
          </div>
          <div>
            <Label>Nhắc nhở bật/tắt</Label>
            <Input disabled value={user.reminderEnabled ? "Bật" : "Tắt"} />
          </div>
        </div>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSave}
        >
          Lưu thông tin
        </button>
      </CardContent>
    </Card>
  );
}
