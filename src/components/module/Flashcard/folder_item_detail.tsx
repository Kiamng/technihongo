"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AddFlashcardSetModal } from "./add_folder_item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getFlashcardSetById } from "@/app/api/studentflashcardset/stuflashcard.api";
import { FolderItem } from "@/types/folderitem";
import { FlashcardSet } from "@/types/stuflashcardset";
import {
  deleteFolderItem,
  getFolderItemsByFolderId,
} from "@/app/api/folderitem/folderitem.api";
import { getStuFolder } from "@/app/api/studentfolder/stufolder.api";
// Đảm bảo đường dẫn đúng

interface FolderDetailProps {
  folderId: number;
  name?: string;
  description?: string;
}

export default function FolderDetail({
  folderId,
  name: initialName,
  description: initialDescription,
}: FolderDetailProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [folderName, setFolderName] = useState(initialName || "");
  const [folderDescription, setFolderDescription] = useState(
    initialDescription || "",
  );

  const token = session?.user?.token;

  // Fetch folder details if not provided via props
  useEffect(() => {
    const fetchFolderDetails = async () => {
      if (!token || !session?.user?.studentId) return;

      if (!initialName || !initialDescription) {
        try {
          const folderData = await getStuFolder(
            token,
            Number(session.user.studentId),
          );
          const currentFolder = folderData?.data?.find(
            (folder: { folderId: number }) => folder.folderId === folderId,
          );

          if (currentFolder) {
            setFolderName(currentFolder.name);
            setFolderDescription(currentFolder.description);
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin folder:", error);
        }
      }
    };

    fetchFolderDetails();
  }, [folderId, token, session, initialName, initialDescription]);

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

  useEffect(() => {
    fetchFolderItems();
  }, [folderId, token]);

  const handleDeleteSet = async (studentSetId: number) => {
    if (!token || !session?.user?.studentId) return;

    const item = folderItems.find((item) => item.studentSetId === studentSetId);

    if (!item) return;

    try {
      await deleteFolderItem(token, {
        folderItemId: item.folderItemId,
        studentId: Number(session.user.studentId),
      });

      await fetchFolderItems(); // cần await để đảm bảo state cập nhật đúng lúc
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  if (!token) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-300 to-cyan-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2">
          <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-cyan-100 opacity-50 rounded-tr-full" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-96 bg-cyan-100 opacity-30 rounded-t-full" />
          <div className="absolute bottom-0 right-0 w-1/2 h-80 bg-cyan-100 opacity-40 rounded-tl-full" />
        </div>

        {/* Stylized Mountains */}
        <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-cyan-50 opacity-70 transform -rotate-12 rounded-tr-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-80 bg-cyan-50 opacity-70 transform rotate-12 rounded-tl-3xl" />

        {/* Birds */}
        <div className="absolute top-1/4 left-1/3 text-cyan-100 text-2xl">
          ✓
        </div>
        <div className="absolute top-1/3 left-1/4 text-cyan-100 text-xl">✓</div>
        <div className="absolute top-1/5 right-1/3 text-cyan-100 text-xl">
          ✓
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm rounded-xl m-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img
              alt="Folder icon"
              className="h-10 w-10 object-contain"
              src="https://i.imgur.com/9cBcFK5.png"
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">{folderName}</h1>
            <p className="text-xs text-gray-600">{folderDescription}</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-white h-12 w-12">
            <AvatarImage alt="User" src="https://via.placeholder.com/48" />
            <AvatarFallback>HKD</AvatarFallback>
          </Avatar>
          <h2 className="font-medium text-gray-800">
            Hoang Khanh Duy (K17 HCM)
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            className="bg-cyan-200/50 hover:bg-cyan-200/70 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-xl">✏️</span>
          </Button>
          <Button
            className="bg-cyan-200/50 hover:bg-cyan-200/70 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
          >
            <span className="text-xl">📷</span>
          </Button>
          <Button
            className="bg-cyan-200/50 hover:bg-cyan-200/70 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
          >
            <span className="text-xl">🔔</span>
          </Button>
          <Button
            className="bg-cyan-200/50 hover:bg-cyan-200/70 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
          >
            <span className="text-xl">👕</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-8 px-4">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="w-full max-w-2xl">
            {flashcardSets.length === 0 ? (
              <div className="text-center">
                <img
                  alt="Empty folder"
                  className="w-40 h-40 object-contain mb-3 opacity-70 rounded-full mx-auto"
                  src="https://i.imgur.com/H82IgpA.jpeg"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Hiện tại bạn chưa có flashcard sets nào
                </h2>
                <p className="text-gray-700 mb-6">
                  Hãy thêm các flashcard sets để TechNihongo giúp bạn học tập
                  tốt hơn nhé
                </p>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  Thêm Flashcard Set
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {flashcardSets.map((set) => (
                  <div
                    key={set.studentSetId}
                    className="p-4 bg-white/90 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-green-700">
                        {set.title}
                      </h4>
                      <p className="text-sm text-gray-600">{set.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSet(set.studentSetId)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thêm Modal */}
      <AddFlashcardSetModal
        currentSetIds={flashcardSets.map((set) => set.studentSetId)}
        folderId={folderId}
        isOpen={isModalOpen}
        token={token || ""}
        onAddSuccess={fetchFolderItems}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-0 opacity-30">
        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping mx-16 mb-12" />
        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping mx-16 mb-24 animate-delay-300" />
        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping mx-16 mb-8 animate-delay-700" />
      </div>
    </main>
  );
}
