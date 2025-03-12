import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateStuFolder } from "@/app/api/studentfolder/stufolder.api";

interface FolderType {
  folderId: number;
  name: string;
  description: string;
}

interface UpdateStuFolderPopupProps {
  folder: FolderType | null;
  isOpen: boolean;
  onClose: () => void;
}

const folderSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

const UpdateStuFolderPopup: React.FC<UpdateStuFolderPopupProps> = ({
  folder,
  isOpen,
  onClose,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen && folder) {
      console.log("📌 Folder khi mở popup:", folder);
      form.reset({
        name: folder.name,
        description: folder.description,
      });
    }
  }, [isOpen, folder, form]);

  const onSubmitForm = async (values: z.infer<typeof folderSchema>) => {
    try {
      setIsLoading(true);
      const token = session?.user?.token;

      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");

        return;
      }

      if (!folder?.folderId) {
        toast.error("Không tìm thấy ID thư mục cần cập nhật!");
        console.error("❌ Missing folderId:", folder);

        return;
      }

      console.log("🚀 Gửi request update với folderId:", folder.folderId);
      console.log("🚀 Dữ liệu gửi đi:", values);

      const response = await updateStuFolder(token, folder.folderId, values);

      if (!response || response.success === false) {
        toast.error(response?.message || "Cập nhật thư mục thất bại!");
      } else {
        toast.success("Cập nhật thư mục thành công!");
        onClose();
      }
    } catch (error: any) {
      console.error(
        "❌ Error updating student folder:",
        error.response?.data || error,
      );
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thư mục.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Cập nhật thư mục</DialogTitle>
        </DialogHeader>

        {folder ? (
          <Form {...form}>
            <form
              className="w-full space-y-5"
              onSubmit={form.handleSubmit(onSubmitForm)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thư mục</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p className="text-center text-red-500">
            Không tìm thấy dữ liệu thư mục.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStuFolderPopup;
