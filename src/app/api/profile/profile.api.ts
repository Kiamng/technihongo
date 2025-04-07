import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GETUSERID: (userId: number) => `/user/getUser/${userId}`,
  UPDATE_USERNAME: (userId: number) => `/user/${userId}/username`,
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
    console.error("🔥 Lỗi khi gọi API:", error);
    throw error;
  }
};

export const updateUsername = async (
  token: string,
  userId: number,
  newUserName: string,
): Promise<any> => {
  if (!userId) {
    console.error("❌ Lỗi: userId không hợp lệ!", userId);
    throw new Error("Invalid userId");
  }

  if (!token) {
    console.error("❌ Lỗi: Token không hợp lệ!", token);
    throw new Error("Invalid token");
  }

  if (!newUserName) {
    console.error("❌ Lỗi: newUserName không hợp lệ!", newUserName);
    throw new Error("Invalid newUserName");
  }

  const url = ENDPOINT.UPDATE_USERNAME(userId);

  console.log("🌍 Đang gọi API:", url);
  console.log("🔑 Token sử dụng:", token);

  try {
    const response = await axiosClient.patch(
      url,
      { userName: newUserName },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("✅ API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("🔥 Lỗi khi gọi API:", error);
    throw error;
  }
};
