import axiosClient from "@/lib/axiosClient";
import { FolderItem } from "@/types/studentfolder";

const ENDPOINT = {
  ADD_FOLDER_ITEM: `/folder-item/add`,
  GET_ITEMS_BY_FOLDER: (folderId: number) => `/folder-item/folder/${folderId}`,
  DELETE_FOLDER_ITEM: `/folder-item/remove`,
};

interface AddFolderItemParams {
  folderId: number;
  studentSetId: number;
}

export const addFolderItem = async (
  token: string,
  params: AddFolderItemParams,
): Promise<FolderItem> => {
  try {
    const response = await axiosClient.post(ENDPOINT.ADD_FOLDER_ITEM, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error adding folder item:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to add item to folder",
    );
  }
};

export const getFolderItemsByFolderId = async (
  token: string,
  folderId: number,
): Promise<FolderItem[]> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_ITEMS_BY_FOLDER(folderId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.data.success) {
      if (response.data.message === "This folder is empty!") {
        return [];
      }
      throw new Error(response.data.message);
    }

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error: any) {
    console.error(
      "Error fetching folder items:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch folder items",
    );
  }
};

interface RemoveFolderItemParams {
  folderItemId: number;
  studentId: number;
}

export const deleteFolderItem = async (
  token: string,
  params: RemoveFolderItemParams,
) => {
  try {
    const response = await axiosClient.delete(ENDPOINT.DELETE_FOLDER_ITEM, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: params,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting folder item:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to remove item from folder",
    );
  }
};
