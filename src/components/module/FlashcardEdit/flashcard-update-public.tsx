import { Dispatch, SetStateAction, useTransition } from "react";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateFlashcardSetPublicStatus } from "@/app/api/studentflashcardset/stuflashcard.api";
import { FlashcardSet } from "@/types/stuflashcardset";

interface SetPublicStatusUpdateProps {
    flashcardSetId: number;
    flashcardSet: FlashcardSet;
    token: string;
    setInitialData: Dispatch<SetStateAction<FlashcardSet | undefined>>;
}

const SetPublicStatusUpdate = ({
    flashcardSetId,
    flashcardSet,
    token,
    setInitialData,
}: SetPublicStatusUpdateProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!flashcardSet) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateFlashcardSetPublicStatus(
                    token,
                    flashcardSetId,
                    publicStatus === "true",
                );

                if (response.success) {
                    toast.success("Cập nhật trạng thái bộ flashcard thành công!");

                    setInitialData((prevSet) =>
                        prevSet
                            ? { ...prevSet, isPublic: publicStatus === "true" }
                            : prevSet,
                    );
                } else {
                    toast.error(
                        response.message || "Cập nhật trạng thái bộ flashcard thất bại!",
                    );
                }
            } catch (error) {
                console.error(
                    "Đã xảy ra lỗi khi cập nhật trạng thái bộ flashcard!",
                    error,
                );
                toast.error("Đã xảy ra lỗi khi cập nhật trạng thái bộ flashcard!");
            }
        });
    };

    return (
        <>
            <span>Ai có thể xem bộ flashcard này của bạn :</span>
            <div>
                <Select
                    disabled={isUSPending}
                    value={flashcardSet?.isPublic.toString()}
                    onValueChange={(value) => handleChangePublicStatus(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chế độ hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Công khai</SelectItem>
                        <SelectItem value="false">Một mình tôi</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    );
};

export default SetPublicStatusUpdate;
