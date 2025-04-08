import { FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ImportType {
    isCreating: boolean;
    type: "quiz" | "flashcard";
    isEditingOrder?: boolean;
}
const ImportCSVPopup = ({ type, isCreating, isEditingOrder }: ImportType) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                    disabled={isCreating || isEditingOrder}
                    type="button"
                >
                    Thêm từ CSV <FileSpreadsheet />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center">
                        Thêm từ CSV
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 text-xl text-center p-4">
                    <div>
                        1.{" "}
                        <a
                            className="text-primary underline"
                            href={`${type === "flashcard" ? process.env.NEXT_PUBLIC_FLASHCARD_CSV_LINK : process.env.NEXT_PUBLIC_QUIZ_CSV_LINK}/edit?usp=sharing/copy`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Tạo bản sao
                        </a>{" "}
                        hoặc{" "}
                        <a
                            className="text-primary underline"
                            href={`${type === "flashcard" ? process.env.NEXT_PUBLIC_FLASHCARD_CSV_LINK : process.env.NEXT_PUBLIC_QUIZ_CSV_LINK}/export?format=xlsx`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            tải xuống
                        </a>{" "}
                        mẫu của chúng tôi.
                    </div>
                    <div>2. Điền vào và tải xuống dưới dạng CSV UTF-8</div>
                    <div>3. Tải lên bên dưới</div>
                    <Button
                        className="text-lg"
                        type="button"
                        onClick={() => {
                            const fileInput = document.querySelector(
                                'input[type="file"]',
                            ) as HTMLInputElement;

                            fileInput?.click();
                        }}
                    >
                        Tải lên
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportCSVPopup;
