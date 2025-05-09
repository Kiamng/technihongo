"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Loader2,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPublicFlashcardSets } from "@/app/api/studentfolder/stufolder.api";
import { cloneFlashcardSet } from "@/app/api/studentflashcardset/stuflashcard.api";
import { FlashcardSet } from "@/types/stuflashcardset";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyStateComponent from "@/components/core/common/empty-state";

// Thêm prop onCloneSuccess
interface PublicFlashcardSetListProps {
  onCloneSuccess?: () => void;
}

export default function PublicFlashcardSetList({
  onCloneSuccess,
}: PublicFlashcardSetListProps) {
  const { data: session, status } = useSession();
  const token = session?.user?.token;
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
      toast.error("Vui lòng đăng nhập để clone bộ flashcard này");

      return;
    }

    setCloneLoading(studentSetId);
    setError(null);
    setSuccess(null);

    try {
      const clonedSet = await cloneFlashcardSet(studentSetId, token);

      toast.success(`Đã clone thành công bộ flashcard "${clonedSet.title}"`);

      // Gọi onCloneSuccess để fetch lại flashcard sets
      if (onCloneSuccess) {
        onCloneSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Clone bộ flashcard thất bại";

      toast.error(errorMessage);
    } finally {
      setCloneLoading(null);
    }
  };

  return (
    <div className="flex flex-col space-y-6 justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-black relative">
      {/* Tiêu đề */}
      <span className="text-2xl font-semibold text-primary">
        Các bộ flashcard trên hệ thống
      </span>

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
            <EmptyStateComponent
              imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
              message={"Hiện chưa có bộ flashcard nào trên hệ thống"}
              size={100}
            />
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
                      className="flex-shrink-0 w-[calc(33.33%-1rem)] h-40 p-4 border-[1px] border-primary rounded-lg bg-white dark:bg-secondary hover:shadow-md flex flex-col relative transform transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Container cho tiêu đề và các thông tin khác */}
                      <div className="flex-grow">
                        <Link href={`/flashcard/${set.studentSetId}`}>
                          <h3 className="text-lg font-semibold truncate">
                            {set.title}
                          </h3>
                        </Link>
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
                                "Sao chép"
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-auto flex flex-row space-x-2 items-center">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            alt="@shadcn"
                            src={set.profileImg || "Unknown"}
                          />
                          <AvatarFallback>{set.userName?.[0]}</AvatarFallback>
                        </Avatar>
                        <Link
                          className="hover:text-primary text-sm dark:text-white font-bold"
                          href={`/flashcard/userFolder/${set.studentId}`}
                        >
                          {set.userName || "Unknown"}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {sets.length > 3 && (
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const carousel = document.getElementById(
                        "public-sets-carousel",
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
                        "public-sets-carousel",
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
          )}
        </div>
      )}
    </div>
  );
}
