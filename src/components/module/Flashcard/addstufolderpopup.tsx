import { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addStuFolder } from "@/app/api/studentfolder/stufolder.api";

// Định nghĩa schema kiểm tra dữ liệu form
const addStuFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  description: z.string().min(1, "Description is required"),
});

interface AddStuFolderPopupProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFolderAdded: () => void; // ✅ Thêm callback này
}

const AddStuFolderPopup = ({
  isOpen,
  setIsOpen,
  onFolderAdded,
}: AddStuFolderPopupProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof addStuFolderSchema>>({
    resolver: zodResolver(addStuFolderSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmitForm = async (values: z.infer<typeof addStuFolderSchema>) => {
    if (!session?.user?.id || !session?.user?.token) {
      toast.error("Không tìm thấy thông tin xác thực!");

      return;
    }

    const studentId = Number(session.user.id);
    const token = session.user.token;

    try {
      setIsLoading(true);
      const response = await addStuFolder(token, studentId, values);

      if (response.success === false) {
        toast.error("Failed to add new folder!");
      } else {
        toast.success("Folder added successfully!");
        setIsOpen(false);
        form.reset();
        onFolderAdded(); // ✅ Gọi callback sau khi tạo thành công
      }
    } catch (error) {
      console.error("Error adding folder:", error);
      toast.error("An error occurred!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Folder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(onSubmitForm)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
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
                  <FormLabel>Description</FormLabel>
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
                    <LoaderCircle className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStuFolderPopup;
