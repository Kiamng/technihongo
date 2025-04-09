"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, Search } from "lucide-react";

// Import API
import {
  getFlashcardSetsByStudentId,
  getUserByStudentId,
} from "@/app/api/studentflashcardset/stuflashcard.api";

// Định nghĩa kiểu dữ liệu
interface Flashcard {
  flashcardId: number;
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string;
}

interface FlashcardSet {
  studentId: number;
  studentSetId: number;
  title: string;
  description: string;
  totalViews: number;
  isPublic: boolean;
  flashcards: Flashcard[];
  createdAt: Date;
}

interface UserFolderProps {
  studentId: number;
}

export default function UserFolderModule({ studentId }: UserFolderProps) {
  const { data: session } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);
  const [userName, setUserName] = useState<string>("Người dùng");

  // Hàm lấy thông tin người dùng
  const fetchUserName = useCallback(async () => {
    if (!session?.user?.token || !studentId) {
      console.error("Không tìm thấy token hoặc studentId");

      return;
    }

    try {
      const user = await getUserByStudentId(session.user.token, studentId);

      setUserName(user.userName);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setUserName("Người dùng");
    }
  }, [session, studentId]);

  // Hàm lấy danh sách flashcard sets
  const fetchFlashcardSets = useCallback(async () => {
    if (!session?.user?.token || !studentId) {
      console.error("Không tìm thấy token hoặc studentId");
      setLoadingFlashcards(false);

      return;
    }

    try {
      const data = await getFlashcardSetsByStudentId(
        studentId,
        session.user.token,
      );

      setFlashcardSets(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách flashcard sets:", error);
      setFlashcardSets([]);
    } finally {
      setLoadingFlashcards(false);
    }
  }, [session, studentId]);

  // Gọi API khi component mount
  useEffect(() => {
    if (session && studentId) {
      fetchUserName();
      fetchFlashcardSets();
    }
  }, [session, studentId, fetchUserName, fetchFlashcardSets]);

  return (
    <main
      className="min-h-screen w-full relative"
      style={{
        background: "linear-gradient(135deg, #7EE395 50%, #d1f1f9 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with Title and Search Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bài học của {userName}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              className="w-64 pl-10 pr-4 py-2 bg-white/80 border-none rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7EE395]"
              placeholder="Tìm kiếm bài học"
            />
          </div>
        </div>

        {/* Danh sách bài học */}
        <div className="w-full">
          {loadingFlashcards ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7EE395] mr-2" />
              <span className="text-gray-500">Đang tải...</span>
            </div>
          ) : flashcardSets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.map((set) => (
                <div
                  key={set.studentSetId}
                  className="p-4 rounded-lg bg-white/70 backdrop-blur-md hover:bg-white/90 transition-all duration-300 border-l-4 border-[#7EE395]/50"
                >
                  <Link href={`/flashcard/${set.studentSetId}`}>
                    <h3 className="text-lg font-medium text-[#7EE395] truncate">
                      {set.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {set.flashcards?.length || 0} thuật ngữ
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Eye className="w-4 h-4 mr-1" />
                      {set.totalViews || 0} lượt xem
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Không có bài học nào
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
