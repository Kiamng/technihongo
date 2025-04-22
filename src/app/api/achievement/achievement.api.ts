import axiosClient from "@/lib/axiosClient";
import {
  Achievement,
  AchievementResponse,
  StudentAchievement,
  StudentAchievementResponse,
} from "@/types/achievement";

const ENDPOINT = {
  GET_ALL_ACHIEVEMENTS: "/achievement/all",
  GET_STUDENT_ACHIEVEMENTS: "/achievement/student/achievement",
};

export const getAllAchievements = async (
  token: string,
): Promise<Achievement[]> => {
  if (!token) {
    console.error("Token không hợp lệ!");
    throw new Error("Invalid token");
  }

  try {
    const response = await axiosClient.get<AchievementResponse>(
      ENDPOINT.GET_ALL_ACHIEVEMENTS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      console.error("Dữ liệu API không đúng định dạng:", response.data);
      throw new Error(
        response.data.message || "Dữ liệu từ API không đúng định dạng!",
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách achievements:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách thành tích!",
    );
  }
};

export const getStudentAchievements = async (
  token: string,
  studentId: number,
): Promise<StudentAchievement[]> => {
  if (!token) {
    console.error("Token không hợp lệ!");
    throw new Error("Invalid token");
  }
  if (!studentId || studentId <= 0) {
    console.error("Student ID không hợp lệ!");
    throw new Error("Invalid student ID");
  }

  const url = `${ENDPOINT.GET_STUDENT_ACHIEVEMENTS}/${studentId}`;

  try {
    const response = await axiosClient.get<StudentAchievementResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      console.warn("API trả về không thành công:", response.data.message);

      return []; // Trả về mảng rỗng nếu không có thành tích
    }

    if (!Array.isArray(response.data.data)) {
      console.error("Dữ liệu API không đúng định dạng:", response.data);
      throw new Error(
        response.data.message || "Dữ liệu từ API không đúng định dạng!",
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách thành tích của học sinh:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Không thể lấy danh sách thành tích của học sinh!",
    );
  }
};
