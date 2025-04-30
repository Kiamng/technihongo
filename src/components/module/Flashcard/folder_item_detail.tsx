"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { AddFlashcardSetModal } from "./add_folder_item";
import UpdateStuFolderPopup from "./updatestufolder";
import { DeleteConfirmationDialog } from "./delete_folder_item";

import { Button } from "@/components/ui/button";
import { getFlashcardSetById } from "@/app/api/studentflashcardset/stuflashcard.api";
import { FolderItem } from "@/types/folderitem";
import { FlashcardSet } from "@/types/stuflashcardset";
import {
  deleteFolderItem,
  getFolderItemsByFolderId,
} from "@/app/api/folderitem/folderitem.api";
import {
  deleteStuFolder,
  getStuFolder,
} from "@/app/api/studentfolder/stufolder.api";

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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateFolderOpen, setIsUpdateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState(initialName || "");
  const [folderDescription, setFolderDescription] = useState(
    initialDescription || "",
  );
  const [accessDenied, setAccessDenied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = session?.user?.token;

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
    } catch (error: any) {
      console.error("Lỗi khi lấy folder items:", error);

      if (error.response?.status === 403) {
        setAccessDenied(true);
      }
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
      await fetchFolderItems();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };
  const handleDeleteFolder = async () => {
    if (!token || !session?.user?.studentId) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");

      return;
    }

    try {
      // Kiểm tra xem folder có chứa flashcard sets không
      const currentFolderItems = await getFolderItemsByFolderId(
        token,
        folderId,
      );

      if (currentFolderItems.length > 0) {
        toast.error("Không thể xóa folder khi còn chứa flashcard sets");
        setIsDeleteDialogOpen(false);

        return;
      }

      setIsDeleting(true);
      const response = await deleteStuFolder(token, folderId);

      if (response.success) {
        toast.success(`Đã xóa folder "${folderName}" thành công!`);
        router.push("/flashcard");
      } else {
        toast.error(response.message || "Xóa folder không thành công");
      }
    } catch (error: any) {
      console.error("Error deleting folder:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xóa folder";

      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdateSuccess = (
    updatedName: string,
    updatedDescription: string,
  ) => {
    setFolderName(updatedName);
    setFolderDescription(updatedDescription);
  };

  if (!token) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  if (accessDenied) {
    return (
      <div className="text-center text-red-600 mt-10 font-semibold text-lg">
        Bạn không có quyền truy cập vào folder này (Private)
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#7EE395] to-cyan-100 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #7EE395 50%, #d1f1f9 100%)",
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2">
          <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-[#7EE395] opacity-30 rounded-tr-full" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-96 bg-[#7EE395] opacity-20 rounded-t-full" />
          <div className="absolute bottom-0 right-0 w-1/2 h-80 bg-[#7EE395] opacity-25 rounded-tl-full" />
        </div>

        {/* Stylized Mountains */}
        <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-[#7EE395] opacity-50 transform -rotate-12 rounded-tr-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-80 bg-[#7EE395] opacity-50 transform rotate-12 rounded-tl-3xl" />

        {/* Birds */}
        <div className="absolute top-1/4 left-1/3 text-[#7EE395] text-2xl">
          ✓
        </div>
        <div className="absolute top-1/3 left-1/4 text-[#7EE395] text-xl">
          ✓
        </div>
        <div className="absolute top-1/5 right-1/3 text-[#7EE395] text-xl">
          ✓
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm rounded-xl m-4 shadow-sm border border-[#7EE395]/30">
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
        <h2 className="text-2xl font-semibold text-gray-800">
          {session?.user?.userName}
        </h2>

        <div className="flex gap-2">
          <Button
            className="bg-[#7EE395]/30 hover:bg-[#7EE395]/50 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-xl">✏️</span>
          </Button>
          <Button
            className="bg-[#7EE395]/30 hover:bg-[#7EE395]/50 border-0 rounded-lg h-10 w-10"
            size="icon"
            variant="outline"
            onClick={() => setIsUpdateFolderOpen(true)}
          >
            <span className="text-xl">👕</span>
          </Button>

          <Button
            className="bg-red-500/30 hover:bg-red-500/50 border-0 rounded-lg h-10 w-10"
            disabled={isDeleting}
            size="icon"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            {isDeleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <span className="text-xl">🗑️</span>
            )}
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
                  className="bg-[#7EE395] hover:bg-[#7EE395]/80 text-white px-6 py-2 rounded-md"
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
                    className="p-4 bg-white/90 rounded-lg shadow-md flex justify-between items-center border-l-4 border-[#7EE395]/50"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-[#7EE395]">
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

      {/* Add Flashcard Set Modal */}
      <AddFlashcardSetModal
        currentSetIds={flashcardSets.map((set) => set.studentSetId)}
        folderId={folderId}
        isOpen={isModalOpen}
        token={token || ""}
        onAddSuccess={fetchFolderItems}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Update Folder Popup */}
      <UpdateStuFolderPopup
        folder={{
          folderId,
          name: folderName,
          description: folderDescription,
        }}
        isOpen={isUpdateFolderOpen}
        onClose={() => setIsUpdateFolderOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
      {/* Các modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        itemName={folderName}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteFolder}
      />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-0 opacity-30">
        <div className="w-2 h-2 bg-[#7EE395] rounded-full animate-ping mx-16 mb-12" />
        <div className="w-2 h-2 bg-[#7EE395] rounded-full animate-ping mx-16 mb-24 animate-delay-300" />
        <div className="w-2 h-2 bg-[#7EE395] rounded-full animate-ping mx-16 mb-8 animate-delay-700" />
      </div>
    </main>
  );
}
