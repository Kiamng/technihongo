import axiosClient from "@/lib/axiosClient";

// Định nghĩa các endpoint dưới dạng object với type rõ ràng
const ENDPOINT = {
  GET_STUFOLDER_BY_ID: (studentId: number) =>
    `/student-folder/getStudentFolder/${studentId}`,
  UPDATE_STUFOLDER: (folderId: number) => `/student-folder/update/${folderId}`,
  ADD_STUFOLDER: `/student-folder/create`,
  DELETE_STUFOLDER: (folderId: number) =>
    `/student-folder/deleteFolder/${folderId}`,
};

// Định nghĩa interface cho dữ liệu đầu vào
interface FolderData {
  name: string;
  description: string;
}

// Hàm thêm Student Folder
export const addStuFolder = async (
  token: string,
  studentId: number,
  values: FolderData,
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
    console.error("Error adding student folder:", error);
    throw error;
  }
};

// Hàm cập nhật Student Folder
export const updateStuFolder = async (
  token: string,
  folderId: number,
  values: FolderData,
) => {
  try {
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

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating student folder:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
