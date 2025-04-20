"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CongratulationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRating: () => void;
}

export default function CongratulationDialog({
    isOpen,
    onClose,
    onOpenRating,
}: CongratulationDialogProps) {
    const router = useRouter();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-primary">
                        Chúc mừng bạn! 🎉
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg mt-4 space-y-2">
                        Bạn đã hoàn thành khóa học một cách xuất sắc! Hãy để lại đánh giá
                        của bạn về khóa học nhé
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                    <Button
                        className="w-full"
                        onClick={() => {
                            onClose();
                            router.push("/course");
                        }}
                    >
                        Quay lại danh sách khóa học
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            onClose();
                            onOpenRating();
                        }}
                    >
                        Đánh giá khóa học
                    </Button>
                    <Button className="w-full" variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
