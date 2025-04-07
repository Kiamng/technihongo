/*import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getFlashcardSetById } from "@/app/api/studentflashcardset/stuflashcard.api";
import { FolderItem } from "@/types/folderitem";
import { FlashcardSet } from "@/types/stuflashcardset";
import {
  addFolderItem,
  deleteFolderItem,
  getFolderItemsByFolderId,
} from "@/app/api/folderitem/folderitem.api";

interface FolderDetailProps {
  folderId: number;
}

export default function FolderDetail({ folderId }: FolderDetailProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);

  // Đảm bảo token được lấy từ session
  const token = session?.user?.token;

  useEffect(() => {
    const fetchFolderItems = async () => {
      if (!token) {
        setLoading(false);

        return;
      }

      try {
        const items = await getFolderItemsByFolderId(token, folderId);

        setFolderItems(items);

        const flashcardSetPromises = items.map((item) =>
          getFlashcardSetById(item.studentSetId, token),
        );
        const sets = await Promise.all(flashcardSetPromises);

        setFlashcardSets(sets);
      } catch (error) {
        console.error("Lỗi khi lấy folder items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderItems();
  }, [folderId, token]); // Đảm bảo rằng token và folderId là dependencies của useEffect

  if (!token) {
    return <div>Đang tải...</div>;
  }

  const handleDelete = async (folderItemId: number) => {
    try {
      await deleteFolderItem(token, folderItemId);
      setFolderItems((prevItems) =>
        prevItems.filter((item) => item.folderItemId !== folderItemId),
      );
    } catch (error) {
      console.error("Lỗi khi xóa folder item:", error);
    }
  };

  const handleAddToFolder = async (studentSetId: number) => {
    try {
      await addFolderItem(token, folderId, studentSetId);
      setFolderItems((prevItems) => [
        ...prevItems,
        { folderItemId: Date.now(), folderId, studentSetId }, // Tạo folderItemId giả để update UI
      ]);
    } catch (error) {
      console.error("Lỗi khi thêm vào folder:", error);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white">
      <h3 className="text-xl font-semibold">Chi tiết folder #{folderId}</h3>

      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {flashcardSets.length === 0 ? (
            <div className="text-gray-500">
              Không có flashcard sets trong folder này.
            </div>
          ) : (
            flashcardSets.map((set) => (
              <div
                key={set.studentSetId}
                className="p-4 border rounded-lg bg-gray-100"
              >
                <h4 className="text-lg font-semibold text-green-700">
                  {set.title}
                </h4>
                <p className="text-sm text-gray-600">{set.description}</p>
                <button
                  className="mt-2 text-red-500 hover:underline"
                  onClick={() => handleDelete(set.studentSetId)}
                >
                  Xóa khỏi folder
                </button>
              </div>
            ))
          )}

          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={() => handleAddToFolder(123)} // Thêm vào một studentSetId cụ thể
          >
            Thêm Flashcard Set vào folder
          </button>
        </div>
      )}
    </div>
  );
} */
