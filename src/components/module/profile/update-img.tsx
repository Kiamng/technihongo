import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { uploadImageCloud } from "@/app/api/image/image-upload.api";
import { updateUserProfile } from "@/app/api/profile/profile.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/core/common/providers/user-provider";

interface UpdateImageComponentProps {
    user: UserProfile;
}

const UpdateImageComponent = ({ user }: UpdateImageComponentProps) => {
    const { setProfileImg } = useUser();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.profileImg);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setIsFileSelected(true);
        }
    };

    const handleButtonClick = () => {
        setIsDialogOpen(true);
    };

    const handleChangeClick = () => {
        fileInputRef.current?.click();
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setPreviewUrl(user.profileImg);
        setSelectedImage(null);
        setIsFileSelected(false);
    };

    const handleUpload = async () => {
        if (selectedImage) {
            setIsUploading(true);
            try {
                const formData = new FormData();

                formData.append("file", selectedImage);

                const uploadedImageUrl = await uploadImageCloud(formData);

                if (uploadedImageUrl) {
                    localStorage.setItem("profileImg", uploadedImageUrl);
                    const session = await getSession();
                    const token = session?.user.token;
                    const userId = session?.user.id;

                    if (!token || !userId) {
                        throw new Error("Không tìm thấy thông tin đăng nhập.");
                    }

                    await updateUserProfile(token, Number(userId), {
                        profileImg: uploadedImageUrl,
                    });
                    setProfileImg(uploadedImageUrl);
                    setPreviewUrl(uploadedImageUrl);
                    toast.success("Cập nhật ảnh đại diện thành công!");
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error("Upload or Update error:", error);
                toast.error("Có lỗi khi cập nhật ảnh. Vui lòng thử lại.");
            } finally {
                setIsUploading(false);
                setSelectedImage(null);
                setIsFileSelected(false);
            }
        }
    };

    return (
        <>
            <button
                className="relative mt-4 inline-block group"
                onClick={handleButtonClick}
            >
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#56D071]/20 to-[#56D071]/10 flex items-center justify-center overflow-hidden">
                        <Avatar className="w-full h-full">
                            <AvatarImage
                                className="object-cover"
                                src={previewUrl as string}
                            />
                            <AvatarFallback className="text-xl font-semibold">
                                {user.userName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#56D071] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#56D071] group-hover:text-white">
                    <Camera className="w-4 h-4" />
                </div>
            </button>

            <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleImageChange}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold w-full flex justify-center">
                            Thay đổi ảnh đại diện
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col items-center gap-4">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#56D071]/20">
                            {previewUrl ? (
                                <img
                                    alt="Selected Preview"
                                    className="w-full h-full object-cover"
                                    src={previewUrl}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image selected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 gap-2">
                        <Button
                            disabled={isUploading}
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="bg-[#56D071] hover:bg-[#56D071]/90"
                            disabled={isUploading}
                            onClick={isFileSelected ? handleUpload : handleChangeClick}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : isFileSelected ? (
                                "Lưu"
                            ) : (
                                "Thay đổi"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateImageComponent;
