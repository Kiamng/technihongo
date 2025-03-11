import axios from "axios";

const ENDPOINT = {
  GET_STUFOLDER_BY_ID: (studentId: number) =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/student-folder/getStudentFolder/${studentId}`,
  UPDATE_STUFOLDER: (folderId: number) =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/student-folder/update/${folderId}`,
  ADD_STUFOLDER: `${process.env.NEXT_PUBLIC_API_BASE_URL}/student-folder/create`,
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Hàm thêm Student Folder
export const addStuFolder = async (
  token: string,
  studentId: number,
  values: { name: string; description: string },
) => {
  try {
    const response = await axiosClient.post(
      ENDPOINT.ADD_STUFOLDER,
      {
        studentId,
        name: values.name,
        description: values.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(" Error adding student folder:", error);
    throw error;
  }
};

// ✅ Hàm cập nhật Student Folder (sửa PUT thành PATCH)
export const updateStuFolder = async (
  token: string,
  folderId: number,
  values: { name: string; description: string },
) => {
  try {
    console.log(" API URL:", ENDPOINT.UPDATE_STUFOLDER(folderId));
    console.log(" Token:", token);
    console.log(" Dữ liệu gửi đi:", values);

    const response = await axiosClient.patch(
      ENDPOINT.UPDATE_STUFOLDER(folderId),
      {
        name: values.name,
        description: values.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("✅ Kết quả API:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error updating student folder:",
      error.response?.data || error,
    );
    throw error;
  }
};
