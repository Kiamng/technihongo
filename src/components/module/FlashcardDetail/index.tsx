"use client";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Flag, Loader2, Pencil, Share2, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ReviewGame from "./reviewPage";
import TextHighlighterWithTranslate from "./TextHighlighterWithTranslate";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TermList from "@/components/module/FlashcardDetail/term-list";
import {
  deleteStudentSet,
  FlashcardSet,
  getFlashcardSetById,
} from "@/app/api/studentflashcardset/stuflashcard.api";
import FlashcardList from "@/components/module/FlashcardDetail/flashcard-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReportPopup from "@/components/core/common/report-popup";
import SharePopup from "@/components/core/common/share";
import { Button } from "@/components/ui/button";

interface FlashcardDetailModuleProps {
  studentSetId: number;
}

export default function FlashcardDetailModule({
  studentSetId,
}: FlashcardDetailModuleProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.user?.token || "";
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReview, setIsReview] = useState<boolean>(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const [isShareModelOpen, setIsShareModelOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await deleteStudentSet(
          session?.user.token as string,
          flashcardSet?.studentSetId as number,
        );

        if (res.success) {
          toast.success(`Xóa bộ flashcard thành công`);
          router.push("/flashcard");
        }
      } catch (error) {
        console.log(error);

        toast.error(
          "Đã có lỗi trong quá trình xóa bộ flashcard, vui lòng thử lại sau!",
        );
      }
    });
  };

  useEffect(() => {
    if (status === "loading" || !studentSetId) {
      setLoading(false);

      return;
    }

    if (status === "unauthenticated" || !token) {
      console.log("User not authenticated or no token available");
      setLoading(false);

      return;
    }

    const fetchFlashcardSet = async () => {
      try {
        setLoading(true);
        const data = await getFlashcardSetById(studentSetId, token);

        setFlashcardSet(data);
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        setFlashcardSet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [studentSetId, status, token]);

  if (status === "loading")
    return <p className="text-center">Đang tải thông tin phiên...</p>;
  if (loading)
    return <p className="text-center">Đang tải dữ liệu flashcard...</p>;
  if (!flashcardSet)
    return <p className="text-center">Không tìm thấy bộ flashcard.</p>;
  if (isReview) {
    return (
      <ReviewGame
        flashcards={flashcardSet.flashcards}
        onExit={() => setIsReview(false)}
      />
    );
  }

  return (
    <div className="w-full space-y-20 min-h-screen pt-6">
      <TextHighlighterWithTranslate />
      <div>
        <div className="text-center">
          <div className="px-8 py-4 bg-primary  dark:text-inherit  w-fit mx-auto rounded-tl-3xl rounded-tr-3xl min-w-[765px]">
            <span className="text-white text-2xl font-bold">
              {flashcardSet.title || "No title"}
            </span>
            <p className="mt-2 text-sm text-white mx-auto">
              {flashcardSet.description || ""}
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="flashcard-app flex flex-col space-y-6 bg-white dark:bg-black p-10 w-fit rounded-2xl shadow-md dark:shadow-none min-w-[800px]">
            <div className="w-full flex flex-row justify-between">
              <div className="flex gap-x-2 items-center">
                <Avatar className="">
                  <AvatarImage alt="@shadcn" src={flashcardSet.profileImg} />
                  <AvatarFallback>{flashcardSet.userName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold text-primary">
                    {flashcardSet.userName}
                  </div>
                  <div className="italic text-base text-gray-400">
                    {format(new Date(flashcardSet.createdAt), "dd-MM-yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                {flashcardSet.studentId === Number(session?.user.studentId) ? (
                  <>
                    <Link href={`/flashcard/edit/${flashcardSet.studentSetId}`}>
                      <button className="hover:-translate-y-1 transition-all duration-300">
                        <Pencil className="text-gray-600 hover:text-primary" />
                      </button>
                    </Link>
                    <button
                      className="hover:-translate-y-1 transition-all duration-300"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash className="text-gray-600 hover:text-red-500" />
                    </button>
                    <button
                      className="hover:-translate-y-1 transition-all duration-300"
                      onClick={() => setIsShareModelOpen(true)}
                    >
                      <Share2 className="text-gray-600 hover:text-blue-500" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="hover:-translate-y-1 transition-all duration-300"
                      onClick={() => setIsShareModelOpen(true)}
                    >
                      <Share2 className="text-gray-600 hover:text-blue-500" />
                    </button>
                    <button
                      className="hover:-translate-y-1 transition-all duration-300"
                      onClick={() => setIsFlagModalOpen(true)}
                    >
                      <Flag className="text-gray-600 hover:text-yellow-500" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {flashcardSet.flashcards.length > 0 ? (
              <FlashcardList FlashcardList={flashcardSet.flashcards} />
            ) : (
              <p>No flashcards available</p>
            )}
            {flashcardSet.flashcards.length > 0 && (
              <button
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:scale-105 transition duration-200"
                onClick={() => setIsReview(true)}
              >
                Học
              </button>
            )}
          </div>
        </div>
      </div>
      {isShareModelOpen && (
        <SharePopup
          contentURL={`/flashcard/${flashcardSet.studentSetId}`}
          onClose={setIsShareModelOpen}
          onOpen={isShareModelOpen}
        />
      )}

      {isFlagModalOpen && (
        <ReportPopup
          contentId={flashcardSet.studentSetId}
          flashcardSet={flashcardSet}
          token={token}
          type="FlashcardSet"
          onClose={setIsFlagModalOpen}
          onOpen={isFlagModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn không ?</DialogTitle>
              <DialogDescription>
                Hành động sẽ không thể được hoàn tác và bộ flashcard này sẽ bị
                xóa vĩnh viễn
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex justify-end">
              <div className="flex flex-row space-x-4">
                <Button
                  disabled={isPending}
                  variant={"outline"}
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  disabled={isPending}
                  variant={"destructive"}
                  onClick={handleDelete}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" /> Đang xử lí
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {flashcardSet.flashcards.length > 0 ? (
        <TermList FlashcardList={flashcardSet.flashcards} />
      ) : null}
    </div>
  );
}
