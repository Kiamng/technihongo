"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPublicFlashcardSets } from "@/app/api/studentfolder/stufolder.api";
import {
  getUserByStudentId,
  cloneFlashcardSet,
} from "@/app/api/studentflashcardset/stuflashcard.api";
import { FlashcardSet } from "@/types/stuflashcardset";

export default function PublicFlashcardSetList() {
  const { data: session, status } = useSession();
  const token = session?.user?.token;
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloneLoading, setCloneLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetsAndUsers = async () => {
      if (status === "loading") return;
      if (!token) {
        console.error("Token is undefined");

        return;
      }

      try {
        const data = await getPublicFlashcardSets(token);

        setSets(data);

        const studentIds = [...new Set(data.map((set) => set.studentId))];
        const userPromises = studentIds.map((studentId) =>
          getUserByStudentId(token, studentId)
            .then((user) => ({ studentId, userName: user.userName }))
            .catch((err) => {
              console.error(
                `Failed to fetch user for studentId ${studentId}`,
                err,
              );

              return { studentId, userName: "Unknown" };
            }),
        );

        const userResults = await Promise.all(userPromises);
        const userMap = userResults.reduce(
          (acc, { studentId, userName }) => {
            acc[studentId] = userName;

            return acc;
          },
          {} as { [key: number]: string },
        );

        setUserNames(userMap);
      } catch (err) {
        console.error("Failed to fetch public flashcard sets or users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetsAndUsers();
  }, [token, status]);

  // Xử lý clone flashcard set
  const handleClone = async (studentSetId: number) => {
    if (!token) {
      setError("Please log in to clone this set.");

      return;
    }

    setCloneLoading(studentSetId);
    setError(null);
    setSuccess(null);

    try {
      const clonedSet = await cloneFlashcardSet(studentSetId, token);

      setSuccess(`Flashcard set "${clonedSet.title}" cloned successfully!`);
      // Không thêm vào danh sách vì đây là public sets, set mới sẽ thuộc về user
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to clone flashcard set.";

      setError(errorMessage);
    } finally {
      setCloneLoading(null);
    }
  };

  return (
    <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-secondary dark:bg-opacity-50 relative">
      {/* Tiêu đề */}
      <div className="flex justify-between items-start">
        <div
          className="absolute top-[-20px] left-0 px-6 py-3 
          bg-green-500 text-white rounded-t-2xl 
          shadow-lg border border-green-700"
        >
          <span className="text-2xl font-semibold">Public Flashcard Set</span>
        </div>
      </div>

      {/* Thông báo */}
      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Nội dung */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mr-2" />
          Loading...
        </div>
      ) : (
        <div className="mt-5 relative">
          {sets.length === 0 ? (
            <div className="text-gray-500 text-center w-full py-5 bg-gray-50 bg-opacity-50 dark:bg-gray-700 rounded-lg border border-dashed flex flex-col items-center justify-center">
              <img
                alt="Empty public sets"
                className="w-24 h-24 object-contain mb-3 opacity-70"
                src="https://i.imgur.com/H82IgpA.jpeg"
              />
              <p>Không có bộ flashcard công khai nào</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden">
                <div
                  className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                  id="public-sets-carousel"
                >
                  {sets.map((set) => (
                    <div
                      key={set.studentSetId}
                      className="flex-shrink-0 w-64 h-40 p-4 border rounded-lg bg-gray-100 bg-opacity-50 dark:bg-gray-700 hover:shadow-md transition-shadow flex flex-col relative"
                    >
                      {/* Container cho tiêu đề và các thông tin khác */}
                      <div className="flex-grow">
                        <Link
                          href={`/flashcard/${set.studentSetId}?studentId=${set.studentId}`}
                        >
                          <h3 className="text-lg font-semibold text-green-600 truncate">
                            {set.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {set.flashcards?.length || 0} thuật ngữ
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Eye className="w-4 h-4 mr-1" />
                          {set.totalViews || 0} lượt xem
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Created by:{" "}
                          <Link
                            className="hover:text-primary"
                            href={`/flashcard/userFolder/${set.studentId}`}
                          >
                            {userNames[set.studentId]}
                          </Link>
                        </div>
                      </div>

                      {/* Nút ba chấm ở góc trên bên phải */}
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              disabled={cloneLoading === set.studentSetId}
                              onClick={() => handleClone(set.studentSetId)}
                            >
                              {cloneLoading === set.studentSetId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Clone"
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {sets.length > 4 && (
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const carousel = document.getElementById(
                        "public-sets-carousel",
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
                        "public-sets-carousel",
                      );

                      if (carousel) carousel.scrollLeft += 300;
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
