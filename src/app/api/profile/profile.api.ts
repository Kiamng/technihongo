import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GETUSERID: (userId: number) => `/user/getUser/${userId}`,
  UPDATE_PROFILE: (userId: number) => `/student/${userId}/profile`,
  UPDATE_USERNAME: (userId: number) => `/user/${userId}/username`,
  UPDATE_DAILY_GOAL: (studentId: number) => `/student/${studentId}/daily-goal`,
};

export const updateDailyGoal = async (
  token: string,
  studentId: number,
  dailyGoal: number,
): Promise<any> => {
  if (!studentId || !token) {
    throw new Error("Thiếu studentId hoặc token");
  }

  const url = ENDPOINT.UPDATE_DAILY_GOAL(studentId);

  console.log(" Đang cập nhật daily goal:", dailyGoal);

  try {
    // Gửi thẳng object { dailyGoal } trong axios.patch
    const response = await axiosClient.patch(
      url,
      { dailyGoal }, // Tạo object tại đây
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "🔥 Lỗi khi cập nhật daily goal:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật mục tiêu hàng ngày",
    );
  }
};
export const getUserById = async (
  token: string,
  userId: number,
): Promise<any> => {
  if (!userId) {
    console.error(" Lỗi: userId không hợp lệ!", userId);
    throw new Error("Invalid userId");
  }

  if (!token) {
    console.error("Lỗi: Token không hợp lệ!", token);
    throw new Error("Invalid token");
  }

  const url = ENDPOINT.GETUSERID(userId);

  console.log(" Đang gọi API:", url);

  try {
    const response = await axiosClient.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

interface UpdateProfilePayload {
  bio?: string;
  dob?: string | null;
  profileImg?: string | null;
  occupation?: "STUDENT" | "EMPLOYED" | "UNEMPLOYED" | "FREELANCER" | "OTHER";
  reminderEnabled?: boolean;
  reminderTime?: string | null; // định dạng "HH:mm:ss"
  studentId?: number;
  dailyGoal?: number;
  difficultyLevel?: "N5" | "N4" | "N3" | "N2" | "N1" | null;
}

export const updateUserProfile = async (
  token: string,
  userId: number,
  payload: UpdateProfilePayload,
): Promise<any> => {
  if (!userId || !token) {
    throw new Error("Thiếu userId hoặc token");
  }

  const url = ENDPOINT.UPDATE_PROFILE(userId);

  console.log(" Payload gửi đi:", payload);

  try {
    const response = await axiosClient.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      " Lỗi khi cập nhật profile:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật hồ sơ người dùng",
    );
  }
};
export const updateUserNameFunction = async (
  token: string,
  userId: number,
  userName: string,
): Promise<any> => {
  if (!userId || !token || !userName) {
    throw new Error("Thiếu userId, token hoặc userName");
  }

  const url = ENDPOINT.UPDATE_USERNAME(userId);

  console.log(" Đang cập nhật userName:", userName);

  try {
    const response = await axiosClient.patch(
      url,
      { userName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      " Lỗi khi cập nhật userName:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật userName",
    );
  }
};
