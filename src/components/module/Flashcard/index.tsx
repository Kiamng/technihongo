"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Eye,
  FolderPlus,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import AddStuFolderPopup from "./addstufolderpopup";
import UpdateStuFolderPopup from "./updatestufolder";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";
import { getAllFlashcardSets } from "@/app/api/studentflashcardset/stuflashcard.api";

interface FlashcardProps {
  flashcardId: string;
  name: string;
  description: string;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Flashcard = ({ flashcardId, name, description }: FlashcardProps) => {
  return (
    <div className="w-full p-3 flex flex-col justify-between border-[1px] border-primary rounded-lg gap-y-3 hover:-translate-y-1 hover:opacity-90 transition-all duration-300 hover:shadow-lg">
      <Link href={`/flashcard/${flashcardId}`}>
        <div className="text-base font-bold text-primary">{name}</div>
        <div className="flex flex-row gap-x-1 mt-1">
          <div className="flex px-2 py-1 bg-secondary dark:bg-slate-700 items-center rounded-lg text-xs">
            100 <Eye size={16} strokeWidth={1.5} />
          </div>
          <div className="px-2 py-1 flex bg-secondary dark:bg-slate-700 items-center rounded-lg text-xs">
            {description}
          </div>
        </div>
        <div className="mt-3">rating</div>
      </Link>
      <Link className="hover:text-primary" href={"/"}>
        Creator
      </Link>
    </div>
  );
};

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Xác nhận xóa thư mục</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Bạn có chắc chắn muốn xóa thư mục này không? Hành động này không thể
          hoàn tác.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FlashcardModule() {
  const { data: session } = useSession();
  const [folders, setFolders] = useState<
    { folderId: number; name: string; description: string }[]
  >([]);
  const [flashcardSets, setFlashcardSets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFlashcardSets, setLoadingFlashcardSets] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatingFolder, setUpdatingFolder] = useState<{
    folderId: number;
    name: string;
    description: string;
  } | null>(null);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchUserFolders = useCallback(async () => {
    if (!session?.user?.id || !session?.user?.token) {
      console.error("Không tìm thấy studentId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await axiosClient.get(
        `/student-folder/getStudentFolder/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );

      setFolders(response.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thư mục:", error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchFlashcardSets = useCallback(async () => {
    if (!session?.user?.token) {
      console.error("Không tìm thấy token trong session");
      setLoadingFlashcardSets(false);

      return;
    }

    try {
      const data = await getAllFlashcardSets(session.user.token);

      console.log("Flashcard sets data:", data); // Thêm console.log để log dữ liệu
      setFlashcardSets(data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách flashcard sets:", error);
      setFlashcardSets([]);
    } finally {
      setLoadingFlashcardSets(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchUserFolders();
      fetchFlashcardSets();
    }
  }, [session, fetchUserFolders, fetchFlashcardSets]);

  const handleFolderAdded = () => {
    setIsPopupOpen(false);
    fetchUserFolders();
  };

  const handleFolderUpdated = () => {
    setIsUpdatePopupOpen(false);
    setUpdatingFolder(null);
    fetchUserFolders();
  };

  const handleUpdate = (folder: {
    folderId: number;
    name: string;
    description: string;
  }) => {
    setUpdatingFolder(folder);
    setIsUpdatePopupOpen(true);
  };

  const openDeleteDialog = (folderId: number) => {
    setFolderToDelete(folderId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!folderToDelete) return;

    try {
      await axiosClient.delete(
        `/student-folder/deleteFolder/${folderToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        },
      );
      toast.success("Xóa thư mục thành công!");
      fetchUserFolders();
    } catch (error) {
      console.error("Lỗi khi xóa thư mục:", error);
      toast.error("Xóa thư mục thất bại!");
    } finally {
      setIsDeleteDialogOpen(false);
      setFolderToDelete(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ảnh nền */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://i.imgur.com/Q9omoFa.jpeg")' }}
      />
      {/* Kiểm tra tải ảnh */}
      <img
        alt="preload"
        src="https://i.imgur.com/Q9omoFa.jpeg"
        style={{ display: "none" }}
        onError={() => console.log("Failed to load background image")}
        onLoad={() => console.log("Background image loaded successfully")}
      />

      {/* Nội dung chính */}
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10 p-5 relative z-1">
        {/* TechNihongo gợi ý */}
        <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-secondary dark:bg-opacity-50">
          <div className="text-2xl font-semibold text-primary">
            TechNihongo gợi ý
          </div>
          <div className="flex flex-row w-full justify-between gap-x-4 mt-5">
            <Flashcard
              description="100 Thuật ngữ"
              flashcardId="123"
              name="Flashcard 1"
            />
            <Flashcard
              description="150 Thuật ngữ"
              flashcardId="456"
              name="Flashcard 2"
            />
            <Flashcard
              description="200 Thuật ngữ"
              flashcardId="789"
              name="Flashcard 3"
            />
          </div>
        </div>

        {/* MY FOLDER */}
        <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-secondary dark:bg-opacity-50 relative">
          <div className="flex justify-between items-start">
            <div
              className="absolute top-[-20px] left-0 px-6 py-3 
           bg-green-500 text-white rounded-t-2xl 
           shadow-lg border border-green-700"
            >
              <span className="text-2xl font-semibold">MY FOLDER</span>
            </div>
            <Button
              className="absolute top-[-20px] right-0 px-4 py-3 
           bg-green-500 text-white rounded-t-2xl 
           shadow-lg border border-green-700 hover:bg-green-600 transition-colors"
              onClick={() => setIsPopupOpen(true)}
            >
              <FolderPlus className="inline-block mr-2" size={24} />
              Thêm Folder
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mr-2" />
              Loading...
            </div>
          ) : (
            <div className="mt-5 relative">
              {folders.length > 0 ? (
                <>
                  <div className="relative overflow-hidden">
                    <div
                      className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                      id="folder-carousel"
                    >
                      {folders.map((folder) => (
                        <div
                          key={folder.folderId}
                          className="flex-shrink-0 w-64 h-40 p-4 border rounded-lg bg-gray-100 bg-opacity-50 dark:bg-gray-700 hover:shadow-md transition-shadow flex flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              className="flex-grow"
                              href={`/folder/${folder.folderId}`}
                            >
                              <h3 className="text-lg font-semibold text-green-600 truncate">
                                {folder.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                                {folder.description}
                              </p>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical size={20} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUpdate(folder)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Cập nhật
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    openDeleteDialog(folder.folderId)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {folders.length > 4 && (
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const carousel =
                            document.getElementById("folder-carousel");

                          if (carousel) carousel.scrollLeft -= 300;
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const carousel =
                            document.getElementById("folder-carousel");

                          if (carousel) carousel.scrollLeft += 300;
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-center w-full py-5 bg-gray-50 bg-opacity-50 dark:bg-gray-700 rounded-lg border border-dashed flex flex-col items-center justify-center">
                  <img
                    alt="Empty folder"
                    className="w-24 h-24 object-contain mb-3 opacity-70"
                    src="https://i.imgur.com/H82IgpA.jpeg"
                  />
                  <p>Không có thư mục nào</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Đã xem gần đây (Recently Viewed) */}
        <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-secondary dark:bg-opacity-50 relative">
          <div className="flex justify-between items-start">
            <div
              className="absolute top-[-20px] left-0 px-6 py-3 
      bg-green-500 text-white rounded-t-2xl 
      shadow-lg border border-green-700"
            >
              <span className="text-2xl font-semibold">Recently Viewed</span>
            </div>
          </div>

          {loadingFlashcardSets ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mr-2" />
              Loading...
            </div>
          ) : (
            <div className="mt-5 relative">
              {flashcardSets.length > 0 ? (
                <>
                  <div className="relative overflow-hidden">
                    <div
                      className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                      id="recently-viewed-carousel"
                    >
                      {flashcardSets.map((set: any) => (
                        <div
                          key={set.studentSetId}
                          className="flex-shrink-0 w-64 h-40 p-4 border rounded-lg bg-gray-100 bg-opacity-50 dark:bg-gray-700 hover:shadow-md transition-shadow flex flex-col"
                        >
                          <Link
                            className="flex-grow"
                            href={`/flashcard/${set.studentSetId}`}
                          >
                            <h3 className="text-lg font-semibold text-green-600 truncate">
                              {set.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {set.flashcards?.length || 0} thuật ngữ
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {flashcardSets.length > 4 && (
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const carousel = document.getElementById(
                            "recently-viewed-carousel",
                          );

                          if (carousel) carousel.scrollLeft -= 300;
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const carousel = document.getElementById(
                            "recently-viewed-carousel",
                          );

                          if (carousel) carousel.scrollLeft += 300;
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-center w-full py-5 bg-gray-50 bg-opacity-50 dark:bg-gray-700 rounded-lg border border-dashed flex flex-col items-center justify-center">
                  <img
                    alt="Empty flashcard sets"
                    className="w-24 h-24 object-contain mb-3 opacity-70"
                    src="https://i.imgur.com/H82IgpA.jpeg"
                  />
                  <p>Không có bộ flashcard nào đã xem gần đây</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />

        <AddStuFolderPopup
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
          onFolderAdded={handleFolderAdded}
        />

        {isUpdatePopupOpen && updatingFolder && (
          <UpdateStuFolderPopup
            folder={updatingFolder}
            isOpen={isUpdatePopupOpen}
            onClose={handleFolderUpdated}
          />
        )}
      </div>
    </div>
  );
}
