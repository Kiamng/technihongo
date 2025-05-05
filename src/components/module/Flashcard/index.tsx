"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Users,
  Lock,
  Pencil,
  MessageSquareWarning,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AddStuFolderPopup from "./addstufolderpopup";
import UpdateStuFolderPopup from "./updatestufolder";
import PublicFlashcardSetList from "./public-flashcard-set";
import SearchFlashcardSets from "./search_flashcard_set";

import { Button } from "@/components/ui/button";
import {
  FlashcardSet,
  getAllFlashcardSets,
} from "@/app/api/studentflashcardset/stuflashcard.api";
import {
  getStuFolder,
  deleteStuFolder,
} from "@/app/api/studentfolder/stufolder.api";
import { getFolderItemsByFolderId } from "@/app/api/folderitem/folderitem.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";
import EmptyStateComponent from "@/components/core/common/empty-state";
import { Badge } from "@/components/ui/badge";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
          <Button
            ref={confirmButtonRef}
            variant="destructive"
            onClick={onConfirm}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FlashcardModule() {
  const { data: session } = useSession();
  const router = useRouter();
  const [folders, setFolders] = useState<
    { folderId: number; name: string; description: string }[]
  >([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState<boolean>(true);
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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchUserFolders = useCallback(async () => {
    if (!session?.user?.id || !session?.user?.token) {
      console.error("Không tìm thấy studentId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const data = await getStuFolder(
        session.user.token,
        Number(session.user.studentId),
      );

      setFolders(data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thư mục:", error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  const fetchFlashcardSets = useCallback(async () => {
    if (!session?.user?.token) {
      console.error("Không tìm thấy token trong session");
      setLoadingFlashcardSets(false);

      return;
    }

    try {
      const data = await getAllFlashcardSets(session.user.token);
      const sets: FlashcardSet[] = data.data || [];

      setFlashcardSets(sets);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách flashcard sets:", error);
      setFlashcardSets([]);
    } finally {
      setLoadingFlashcardSets(false);
    }
  }, [session?.user.token]);

  useEffect(() => {
    if (session) {
      fetchUserFolders();
      fetchFlashcardSets();
    }
  }, [session?.user.token, fetchUserFolders, fetchFlashcardSets]);

  const handleFolderAdded = () => {
    setIsPopupOpen(false);
    fetchUserFolders();
  };

  const handleFolderUpdated = () => {
    setIsUpdatePopupOpen(false);
    setUpdatingFolder(null);
    fetchUserFolders();

    // Focus vào phần tử an toàn sau khi đóng popup
    setTimeout(() => {
      const safeElement = document.querySelector("button:not([aria-hidden])");

      if (safeElement) {
        (safeElement as HTMLElement).focus();
      }
    }, 100);
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

  const handleDelete = async (folderId: number) => {
    try {
      if (!session?.user?.token) {
        toast.error("Không tìm thấy token trong session");

        return;
      }

      const folderItems = await getFolderItemsByFolderId(
        session.user.token,
        folderId,
      );

      if (folderItems.length > 0) {
        toast.error("Không thể xóa thư mục vì nó chứa các bộ flashcard!");
        setIsDeleteDialogOpen(false);

        return;
      }

      await deleteStuFolder(session.user.token, folderId);
      toast.success("Xoá thư mục thành công!");
      fetchUserFolders();
      setIsDeleteDialogOpen(false);
      setFolderToDelete(null);
    } catch (error) {
      toast.error("Xoá thư mục thất bại.");
      console.error("Error in handleDelete:", error);
    }
  };

  const handleSearchResults = useCallback((results: any[]) => {
    setSearchResults(results);
  }, []);

  const handleLoading = useCallback((isLoading: boolean) => {
    setIsSearching(isLoading);
  }, []);

  const handleSearchStart = useCallback((isSearching: boolean) => {
    setIsSearchActive(isSearching);
    if (!isSearching) {
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const originalTitle = document.title;

    document.title = "Flashcard Module - TechNihongo";

    return () => {
      document.title = originalTitle;
      setIsUpdatePopupOpen(false);
      setIsPopupOpen(false);
      setIsDeleteDialogOpen(false);
    };
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="max-w-[1200px] mx-auto flex flex-col gap-10 p-5 relative"
        inert={
          isUpdatePopupOpen || isPopupOpen || isDeleteDialogOpen
            ? true
            : undefined
        }
      >
        <div ref={searchContainerRef}>
          {session?.user?.token && (
            <SearchFlashcardSets
              token={session.user.token}
              userName={session.user.userName}
              onLoading={handleLoading}
              onSearchResults={handleSearchResults}
              onSearchStart={handleSearchStart}
            />
          )}
        </div>

        {isSearchActive && (
          <div className="relative mt-4 bg-white dark:bg-black rounded-lg shadow-lg max-h-96 overflow-y-auto z-20">
            {isSearching ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mr-2" />
                Đang tải...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4 flex flex-col space-y-4">
                {searchResults.map((set: any) => (
                  <Link
                    key={set.studentSetId}
                    className="block p-2 border-primary border-[1px] dark:hover:bg-secondary rounded-lg hover:-translate-y-1 transition-all duration-300 "
                    href={`/flashcard/${set.studentSetId}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold">{set.title}</h3>
                        <div className="flex flex-row space-x-2 mt-1">
                          <div className="flex text-sm space-x-1 items-center dark:text-white px-2 py-1 rounded-lg bg-[#57d061] bg-opacity-20">
                            <span>{set.flashcards?.length || 0}</span>{" "}
                            <Copy className="w-4 h-4" />
                          </div>
                          <div className="flex space-x-1 items-center text-sm dark:text-white px-2 py-1 rounded-lg bg-[#57d061] bg-opacity-20">
                            <span>{set.totalViews || 0}</span>
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="mt-auto flex flex-row space-x-2 items-center">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              alt="@shadcn"
                              src={set.profileImg || "Unknown"}
                            />
                            <AvatarFallback>{set.userName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="hover:text-primary text-sm dark:text-white font-bold">
                            {set.userName || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="p-4 text-gray-500 text-center">
                Không tìm thấy kết quả
              </p>
            )}
          </div>
        )}
      </div>

      <div
        className="max-w-[1200px] mx-auto flex flex-col gap-10 p-5 relative"
        inert={
          isUpdatePopupOpen || isPopupOpen || isDeleteDialogOpen
            ? true
            : undefined
        }
      >
        <div className="mt-8 flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-black relative">
          <div className="flex flex-row justify-between items-center">
            <span className="text-2xl font-semibold text-primary">
              Thư mục của tôi
            </span>
            <Button
              className="hover:scale-105 duration-300 transition-all"
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
                          className="flex-shrink-0 w-[calc(33.33%-1rem)] h-40 p-4 border-[1px] border-primary rounded-lg bg-white dark:bg-secondary hover:shadow-md flex flex-col relative transform transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              className="flex-grow"
                              href={`/flashcard/folder/${folder.folderId}`}
                            >
                              <h3 className="text-lg font-semibold truncate">
                                {folder.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                {folder.description}
                              </p>
                            </Link>
                            <img
                              alt="img"
                              height={70}
                              src="https://i.imgur.com/9cBcFK5.png"
                              width={70}
                            />
                          </div>
                          <div className={`mt-auto w-full flex justify-end`}>
                            <Link href={`/flashcard/folder/${folder.folderId}`}>
                              <Button variant={"link"}>
                                <span className="flex items-center">
                                  Xem thêm <ChevronRight />
                                </span>
                              </Button>
                            </Link>
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

                          if (carousel) {
                            const setWidth = carousel.offsetWidth / 3;

                            carousel.scrollLeft -= setWidth;
                          }
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

                          if (carousel) {
                            const setWidth = carousel.offsetWidth / 3;

                            carousel.scrollLeft += setWidth;
                          }
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateComponent
                  imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
                  message={"Bạn chưa có thư mục nào"}
                  size={100}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-black relative">
          <div className="flex flex-row justify-between items-center">
            <span className="text-2xl font-semibold text-primary">
              Các bộ flashcard của tôi
            </span>
            <Link href={"/flashcard/create"}>
              <Button className="hover:scale-105 duration-300 transition-all">
                <Copy className="inline-block mr-2" size={24} />
                Thêm mới bộ flashcard
              </Button>
            </Link>
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
                      {flashcardSets.map((set) => (
                        <div
                          key={set.studentSetId}
                          className="flex-shrink-0 w-[calc(33.33%-1rem)] h-40 p-4 border-[1px] border-primary rounded-lg bg-white dark:bg-secondary hover:shadow-md flex flex-col relative transform transition-all duration-300 hover:-translate-y-1"
                        >
                          <Link
                            className="flex-grow"
                            href={`/flashcard/${set.studentSetId}`}
                          >
                            <div className="w-full flex flex-row justify-between">
                              <h3 className="text-lg font-semibold truncate">
                                {set.title}
                              </h3>
                              {set.isPublic ? (
                                <Users strokeWidth={1} />
                              ) : (
                                <Lock strokeWidth={1} />
                              )}
                            </div>
                            <div className="flex flex-row space-x-2 mt-2">
                              <div className="flex text-sm space-x-1 items-center dark:text-white px-2 py-1 rounded-lg bg-[#57d061] bg-opacity-20">
                                <span>{set.flashcards?.length || 0}</span>{" "}
                                <Copy className="w-4 h-4" />
                              </div>
                              <div className="flex space-x-1 items-center text-sm dark:text-white px-2 py-1 rounded-lg bg-[#57d061] bg-opacity-20">
                                <span>{set.totalViews || 0}</span>
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                          </Link>
                          <div
                            className={`mt-auto w-full flex flex-row ${set.isViolated ? "justify-between" : "justify-end"}`}
                          >
                            {set.isViolated && (
                              <Badge className="bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-400 hover:bg-opacity-10 flex space-x-1">
                                <span>Vi phạm</span>{" "}
                                <MessageSquareWarning size={16} />
                              </Badge>
                            )}
                            <Link href={`/flashcard/edit/${set.studentId}`}>
                              <Pencil size={20} strokeWidth={1} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {flashcardSets.length > 3 && (
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const carousel = document.getElementById(
                            "recently-viewed-carousel",
                          );

                          if (carousel) {
                            const setWidth = carousel.offsetWidth / 3;

                            carousel.scrollLeft -= setWidth;
                          }
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

                          if (carousel) {
                            const setWidth = carousel.offsetWidth / 3;

                            carousel.scrollLeft += setWidth;
                          }
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateComponent
                  imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
                  message={"Bạn chưa có bộ flashcard nào"}
                  size={100}
                />
              )}
            </div>
          )}
        </div>
        <PublicFlashcardSetList />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() =>
            folderToDelete !== null && handleDelete(folderToDelete)
          }
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
