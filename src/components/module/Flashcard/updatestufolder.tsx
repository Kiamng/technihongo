"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  onSuccess?: (updatedName: string, updatedDescription: string) => void; // Cập nhật kiểu này
}

const folderSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

type FolderFormValues = z.infer<typeof folderSchema>;

export default function UpdateStuFolderPopup({
  folder,
  isOpen,
  onClose,
  onSuccess,
}: UpdateStuFolderPopupProps) {
  const { data: session } = useSession();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  useEffect(() => {
    if (isOpen && folder) {
      reset({
        name: folder.name,
        description: folder.description,
      });

      // Focus vào input đầu tiên sau khi dialog mở
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, folder, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof folderSchema>) => {
    if (!session?.user?.token) {
      toast.error("Vui lòng đăng nhập lại!");

      return;
    }

    if (!folder?.folderId) {
      toast.error("Không tìm thấy ID thư mục cần cập nhật!");

      return;
    }

    try {
      const response = await updateStuFolder(
        session.user.token,
        folder.folderId,
        values,
      );

      if (!response || response.success === false) {
        toast.error(response?.message || "Cập nhật thư mục thất bại!");
      } else {
        toast.success("Cập nhật thư mục thành công!");
        onSuccess?.(values.name, values.description); // Truyền tham số vào đây
        handleClose();
      }
    } catch (error: any) {
      console.error("Error updating student folder:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thư mục.",
      );
    }
  };

  if (!folder) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <p className="text-center text-destructive py-4">
            Không tìm thấy dữ liệu thư mục.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thư mục</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="folder-name">Tên thư mục</FormLabel>
                  <FormControl>
                    <Input
                      id="folder-name"
                      {...field}
                      ref={firstInputRef}
                      autoComplete="off"
                      disabled={isSubmitting}
                      placeholder="Nhập tên thư mục"
                    />
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
                  <FormLabel htmlFor="folder-desc">Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      id="folder-desc"
                      {...field}
                      autoComplete="off"
                      disabled={isSubmitting}
                      placeholder="Nhập mô tả"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button disabled={isSubmitting || !isValid} type="submit">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
