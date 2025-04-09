"use client";

import { GripVertical, ImagePlus, Plus, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { handleFlashcardFileUpload } from "./spreadsheet-import";
import ImportCSVPopup from "./import-csv";
import QuickAddPopup from "./quick-import";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FlashcardSetCreateSchema } from "@/schema/Flashcard/flashcard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createFlashcards,
  createStudentSet,
} from "@/app/api/studentflashcardset/stuflashcard.api";

export default function FlashcardCreateModule() {
  const { data: session } = useSession();
  const [isCreating, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleAddFlashcards = (
    newFlashcards: { japaneseDefinition: string; vietEngTranslation: string }[],
  ) => {
    newFlashcards.forEach((flashcard) => {
      append({
        flashcardId: null,
        japaneseDefinition: flashcard.japaneseDefinition,
        vietEngTranslation: flashcard.vietEngTranslation,
        imageUrl: null,
        cardOrder: null,
      });
    });
  };
  const handleImageUpload = (index: number, imageUrl: string) => {
    const updatedImageUrls = [...imageUrls];

    updatedImageUrls[index] = imageUrl;
    setImageUrls(updatedImageUrls);
    const updatedFlashcard = [...form.getValues().flashcards];

    updatedFlashcard[index].imageUrl = imageUrl;
    form.setValue("flashcards", updatedFlashcard);
  };

  const handleDeleteImage = (index: number) => {
    const updatedImageUrls = [...imageUrls];

    updatedImageUrls[index] = null;
    setImageUrls(updatedImageUrls);
    const updatedFlashcard = [...form.getValues().flashcards];

    updatedFlashcard[index].imageUrl = "";
    form.setValue("flashcards", updatedFlashcard);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }
    handleFlashcardFileUpload(file)
      .then((flashcards) => {
        flashcards.forEach((flashcard) => {
          append({
            flashcardId: null,
            japaneseDefinition: flashcard.japaneseDefinition,
            vietEngTranslation: flashcard.vietEngTranslation,
            imageUrl: "",
            cardOrder: 0,
          });
        });
      })
      .catch((error) => {
        console.error("Error importing CSV:", error);
      });
    e.target.value = "";
  };

  const form = useForm<z.infer<typeof FlashcardSetCreateSchema>>({
    resolver: zodResolver(FlashcardSetCreateSchema),
    defaultValues: {
      StudentFlashcardSetSchema: {
        title: "",
        description: "",
        isPublic: false,
      },
      flashcards: [
        {
          flashcardId: null,
          japaneseDefinition: "",
          vietEngTranslation: "",
          imageUrl: null,
          cardOrder: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

  const onSubmit = (data: z.infer<typeof FlashcardSetCreateSchema>) => {
    if (data.flashcards.length === 0) {
      toast.error("Bộ flashcard phải có ít nhất một flashcard.");

      return;
    }
    startTransition(async () => {
      try {
        const createSetResponse = await createStudentSet(
          session?.user.token as string,
          data.StudentFlashcardSetSchema,
        );

        if (!createSetResponse.success) {
          toast.error(
            "Tạo bộ flashcard thất bại. Vui lòng kiểm tra lại thông tin.",
          );

          return;
        }

        const createFlashcardsResponse = await createFlashcards(
          session?.user.token as string,
          createSetResponse.data.studentSetId,
          data.flashcards,
        );

        if (!createFlashcardsResponse.success) {
          toast.error(
            "Thêm flashcards thất bại. Vui lòng kiểm tra lại dữ liệu.",
          );

          return;
        }

        toast.success("Tạo bộ flashcard thành công");

        // Reset form nếu muốn (nếu cần)
        form.reset();
      } catch (error) {
        console.error("Error creating flashcard set:", error);
        toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    form.setValue("flashcards", items);
  };

  return (
    <div className="w-full min-h-screen space-y-8 bg-white dark:bg-black p-10">
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col space-y-6">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-3xl font-extrabold">
                TẠO MỘT BỘ FLASHCARD MỚI
              </h1>
              <div className="flex flex-row space-x-4 items-center">
                <span>Ai có thể xem bộ flashcard này của bạn :</span>
                <FormField
                  control={form.control}
                  name="StudentFlashcardSetSchema.isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value?.toString()}
                        disabled={isCreating}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chế độ hiển thị" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Công khai</SelectItem>
                          <SelectItem value="false">Một mình tôi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="hover:scale-105 transition-all duration-100 text-lg"
                  disabled={isCreating}
                  type="submit"
                >
                  {isCreating ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="StudentFlashcardSetSchema.title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      className="w-full font-medium text-lg py-2 px-3 rounded-xl bg-secondary focus:outline-primary"
                      disabled={isCreating}
                      placeholder="Hãy nhập tên của bài học"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-medium text-lg dark:text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="StudentFlashcardSetSchema.description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      className="w-full font-medium text-lg py-2 px-3 rounded-xl bg-secondary min-h-[100px] resize-none focus:outline-primary"
                      disabled={isCreating}
                      placeholder="Thêm một mô tả ... "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-medium text-lg dark:text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex flex-row space-x-4">
            <Button
              className="hover:scale-105 transition-all duration-100 font-medium text-lg"
              disabled={isCreating}
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
            >
              Thêm nhanh <Plus />
            </Button>
            <QuickAddPopup
              closeModal={() => setIsQuickAddOpen(false)}
              isOpen={isQuickAddOpen}
              onAddFlashcards={handleAddFlashcards}
            />
            <ImportCSVPopup isCreating={isCreating} type="flashcard" />
            <input
              accept=".csv"
              className="hidden"
              type="file"
              onChange={handleFileImport}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="flashcards">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {fields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="w-full flex flex-col bg-white dark:bg-secondary rounded-xl border-[1px] dark:border-none shadow-lg"
                        >
                          <div className="p-3 flex flex-row justify-between items-center">
                            <span className="font-semibold text-lg">
                              {index + 1}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="text-gray-500" />
                              </div>
                              <Button
                                className={`${isCreating ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-red-500 hover:scale-105 duration-100"}`}
                                disabled={isCreating}
                                size={"icon"}
                                type="button"
                                variant={"ghost"}
                                onClick={() => remove(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </div>
                          <Separator className="dark:bg-black" />
                          <div className="p-6 flex flex-row justify-between items-center space-x-5 w-full">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`flashcards.${index}.japaneseDefinition`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <input
                                        className="w-full dark:bg-secondary font-medium text-lg py-2 border-b-[1px] border-black dark:border-white focus:outline-none focus:border-primary"
                                        disabled={isCreating}
                                        placeholder="Nhập từ vựng"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="font-medium text-lg dark:text-red-500" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`flashcards.${index}.vietEngTranslation`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <input
                                        className="w-full dark:bg-secondary font-medium text-lg py-2 border-b-[1px] border-black dark:border-white focus:outline-none focus:border-primary"
                                        disabled={isCreating}
                                        placeholder="Nhập định nghĩa"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="font-medium text-lg dark:text-red-500" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-shrink-0">
                              {!field.imageUrl ? (
                                <CldUploadWidget
                                  options={{
                                    sources: ["local", "camera", "url"],
                                    resourceType: "auto",
                                  }}
                                  uploadPreset={
                                    process.env
                                      .NEXT_PUBLIC_CLOUD_IMAGE_UPLOAD_PRESET
                                  }
                                  onSuccess={(result) => {
                                    if (
                                      typeof result.info === "object" &&
                                      result.info !== null
                                    ) {
                                      const uploadInfo = result.info;
                                      const imageUrl = uploadInfo.secure_url;

                                      handleImageUpload(index, imageUrl);
                                    }
                                  }}
                                >
                                  {({ open }) => (
                                    <button
                                      className={`border-dashed border-[2px] rounded-lg h-[80px] w-[100px] flex items-center justify-center text-slate-500 ${isCreating ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"}`}
                                      disabled={isCreating}
                                      type="button"
                                      onClick={() => open()}
                                    >
                                      <ImagePlus />
                                    </button>
                                  )}
                                </CldUploadWidget>
                              ) : (
                                <div
                                  className={`border-dashed border-[2px] rounded-lg h-[60px] w-[80px] flex justify-end text-slate-500`}
                                  style={{
                                    backgroundImage: `url(${field.imageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }}
                                >
                                  <button
                                    className="bg-slate-700 text-white hover:bg-red-500 p-1 h-fit"
                                    disabled={isCreating}
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            className="w-full hover:scale-95 transition-all duration-200 h-12 text-lg"
            type="button"
            onClick={() => {
              append({
                flashcardId: null,
                japaneseDefinition: "",
                vietEngTranslation: "",
                imageUrl: null,
                cardOrder: null,
              });
            }}
          >
            <Plus /> Thêm flashcard
          </Button>
        </form>
      </Form>
    </div>
  );
}
