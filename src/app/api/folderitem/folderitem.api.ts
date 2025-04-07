import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  ADD_FOLDER_ITEM: `/folder-item/add`,
  GET_ITEMS_BY_FOLDER: (folderId: number) => `/folder-item/folder/${folderId}`,
  DELETE_FOLDER_ITEM: (folderItemId: number) =>
    `/folder-item/remove/${folderItemId}`,
};

export const addFolderItem = async (
  token: string,
  folderId: number,
  studentSetId: number,
): Promise<any> => {
  try {
    const response = await axiosClient.post(
      ENDPOINT.ADD_FOLDER_ITEM,
      {
        folderId,
        studentSetId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error adding folder item:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 📄 Lấy danh sách flashcard set trong 1 folder
export const getFolderItemsByFolderId = async (
  token: string,
  folderId: number,
): Promise<any[]> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_ITEMS_BY_FOLDER(folderId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching folder items:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ❌ Xoá 1 flashcard set khỏi folder
export const deleteFolderItem = async (
  token: string,
  folderItemId: number,
): Promise<void> => {
  try {
    await axiosClient.delete(ENDPOINT.DELETE_FOLDER_ITEM(folderItemId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(
      "Error deleting folder item:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
