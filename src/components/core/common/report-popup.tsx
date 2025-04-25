import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createReport } from "@/app/api/violation/violation.api";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/app/api/studentflashcardset/stuflashcard.api";
import { CourseRating } from "@/types/course";

interface ReportPopup {
    token: string;
    onOpen: boolean;
    onClose: (value: boolean) => void;
    contentId: number;
    type: "FlashcardSet" | "Rating";
    flashcardSet?: FlashcardSet;
    rating?: CourseRating;
}

const ReportPopup = ({
    token,
    onOpen,
    onClose,
    contentId,
    type,
    flashcardSet,
    rating,
}: ReportPopup) => {
    const [description, setDescription] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setDescription(e.target.value);
    };

    const submit = async () => {
        if (description.trim() === "") {
            toast.error("Nội dung báo cáo không được để trống");

            return;
        }
        try {
            setIsPending(true);
            const res = await createReport(token, type, contentId, description);

            if (res.success) {
                toast.success(
                    "Tạo báo cáo thành công. TechNihongo sẽ xem xét và xử lí báo cáo của bạn. Trân trọng cảm ơn",
                );
                onClose(false);
            }
        } catch (error) {
            toast.error("Có lỗi trong quá trình tạo báo cáo, vui lòng thử lại sau");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={onOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-center text-primary text-2xl">
                        Báo cáo vi phạm
                    </DialogTitle>
                </DialogHeader>
                <div className="flex space-x-2">
                    <span className="font-bold">
                        {type === "FlashcardSet" ? "Flashcard" : "Đánh giá"}:
                    </span>
                    {flashcardSet && <span>{flashcardSet.title}</span>}
                    {rating && (
                        <>
                            <div className="flex text-orange-500">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={
                                            i < rating.rating ? "text-orange-500" : "text-gray-300"
                                        }
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-600">{rating.review}</span>
                        </>
                    )}
                </div>
                <div className="flex space-x-2">
                    <span className="font-bold">Người dùng:</span>
                    <span>{flashcardSet ? flashcardSet.userName : rating?.userName}</span>
                </div>
                <div className="mt-2">
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        placeholder="Hãy nhập nội dung báo cáo"
                        rows={4}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        className="text-lg hover:scale-105 duration-300 transition-all"
                        disabled={isPending}
                        variant={"destructive"}
                        onClick={() => onClose(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        className="text-lg hover:scale-105 duration-300 transition-all"
                        disabled={isPending}
                        variant={"outline"}
                        onClick={submit}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" /> Đang tạo
                            </>
                        ) : (
                            "Tạo"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReportPopup;
