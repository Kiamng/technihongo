"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, FolderPlus, MoreVertical, Edit, Trash2 } from "lucide-react";

import AddStuFolderPopup from "./addstufolderpopup";
import UpdateStuFolderPopup from "./updatestufolder";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FlashcardProps {
  flashcardId: string;
  name: string;
  description: string;
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

export default function FlashcardModule() {
  const { data: session } = useSession();
  const [folders, setFolders] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatingFolder, setUpdatingFolder] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);

  const fetchUserFolders = useCallback(async () => {
    if (!session?.user?.id || !session?.user?.token) {
      console.error("Không tìm thấy studentId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/student-folder/getStudentFolder/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );

      console.log("API Response:", response.data);
      setFolders(response.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thư mục:", error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchUserFolders();
  }, [session, fetchUserFolders]);

  const handleUpdate = (folder: {
    id: number;
    name: string;
    description: string;
  }) => {
    if (!session?.user?.token) {
      console.error("Token bị mất, yêu cầu đăng nhập lại!");

      return;
    }
    console.log("Folder được chọn để cập nhật:", folder); // Debug log
    setUpdatingFolder({
      id: folder.id,
      name: folder.name,
      description: folder.description,
    });
    setIsUpdatePopupOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!session?.user?.token) {
      console.error("Token bị mất, yêu cầu đăng nhập lại!");

      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/student-folder/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      // Refresh folder list after delete
      await fetchUserFolders();
    } catch (error) {
      console.error("Lỗi khi xóa thư mục:", error);
    }
  };

  // Handler để refresh sau khi thêm folder
  const handleFolderAdded = () => {
    setIsPopupOpen(false);
    fetchUserFolders();
  };

  // Handler để refresh sau khi cập nhật folder
  const handleFolderUpdated = () => {
    setIsUpdatePopupOpen(false);
    setUpdatingFolder(null);
    fetchUserFolders();
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-10 p-5">
      <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-secondary">
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

      <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-secondary relative">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold text-primary">
            FOLDER của tôi
          </div>
          <button
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            onClick={() => setIsPopupOpen(true)}
          >
            <FolderPlus size={24} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            Loading...
          </div>
        ) : (
          <div className="relative overflow-hidden mt-5">
            {folders.length > 0 ? (
              folders.map((folder, index) => (
                <div
                  key={folder.id || `folder-${index}`}
                  className="flex justify-between items-center w-full p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 mb-4"
                >
                  <Link className="flex flex-col" href={`/folder/${folder.id}`}>
                    <h3 className="text-lg font-semibold text-primary">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {folder.description}
                    </p>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdate(folder)}>
                        <Edit className="mr-2 h-4 w-4" /> Cập nhật
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(folder.id)}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center w-full py-5">
                Không có thư mục nào
              </div>
            )}
          </div>
        )}
      </div>

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
  );
}
