"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye } from "lucide-react";

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

  const fetchUserFolders = useCallback(async () => {
    const studentId = Number(session?.user?.id);
    const token = session?.user?.token || (session as any)?.accessToken;

    if (!studentId || !token) {
      console.error("Không tìm thấy studentId hoặc token trong session");
      setLoading(false);

      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/student-folder/getStudentFolder/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("API Response:", response.data);
      const data = response.data?.data || [];

      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchUserFolders();
  }, [session, fetchUserFolders]);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-10 p-5">
      {/* TechNihongo Gợi Ý Section */}
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

      {/* Folder Section */}
      <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-secondary relative">
        <div className="text-2xl font-semibold text-primary">
          FOLDER của tôi
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            Loading...
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-300">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="min-w-[33.33%] p-5 border rounded-xl bg-gray-100 dark:bg-gray-700 mx-2"
                >
                  <Link href={`/folder/${folder.id}`}>
                    <h3 className="text-lg font-semibold text-primary">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {folder.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
