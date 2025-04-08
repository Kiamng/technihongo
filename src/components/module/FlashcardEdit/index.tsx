"use client";

import { ArrowUpDown, Loader2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { DropResult } from "@hello-pangea/dnd";

import { handleFlashcardFileUpload } from "../FlashcardCreate/spreadsheet-import";
import QuickAddPopup from "../FlashcardCreate/quick-import";
import ImportCSVPopup from "../FlashcardCreate/import-csv";

import FlashcardInForm from "./flashcard-in-form";
import FlashcardUpdateOrder from "./flashcard-update-order";
import SetPublicStatusUpdate from "./flashcard-update-public";

import { Button } from "@/components/ui/button";
import {
    FlashcardSchema,
    FlashcardSetCreateSchema,
} from "@/schema/Flashcard/flashcard";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    createFlashcards,
    deleteFlashcard,
    getStudentFlashcardSetById,
    updateFlashard,
    updateFlashardOrder,
    updateStudentSet,
} from "@/app/api/studentflashcardset/stuflashcard.api";
import { FlashcardSet } from "@/types/stuflashcardset";

type FlashcardInForm = z.infer<typeof FlashcardSchema>;

export default function FlashcardEditModule() {
    const params = useParams();
    const { studentSetId } = params;
    const { data: session } = useSession();
    const [isSaving, startTransition] = useTransition();
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isSavingNewOrder, startSavingNewOrderTransition] = useTransition();
    const [initialData, setInitialData] = useState<FlashcardSet>();
    const [initialOrder, setInitialOrder] = useState<FlashcardInForm[]>([]);
    const [newFlashcardOrder, setNewFlashcardOrder] = useState<FlashcardInForm[]>(
        [],
    );
    const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
    const [changedFlashcards, setChangedFlashcards] = useState<FlashcardInForm[]>(
        [],
    );

    const handleUpdateOrderToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const hasUnSavedFlashcards =
            form.getValues().flashcards.some((flashcard) => !flashcard.flashcardId) ||
            changedFlashcards.length > 0;

        if (hasUnSavedFlashcards) {
            toast.error(
                "Bạn cần lưu tất cả các flashcard trước khi cập nhật thứ tự.",
            );

            return;
        }

        setIsEditingOrder(!isEditingOrder);
        if (!isEditingOrder) {
            setNewFlashcardOrder([...initialOrder]);
        }
    };

    const handleCancelUpdateOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditingOrder(false);
        form.setValue("flashcards", initialOrder);
    };

    const handleSaveNewOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startSavingNewOrderTransition(async () => {
            try {
                const newOrder = newFlashcardOrder.map(
                    (flashcard) => flashcard.cardOrder,
                );

                await updateFlashardOrder(
                    session?.user.token as string,
                    initialData?.studentSetId as number,
                    newOrder as number[],
                );

                toast.success("Order saved successfully!");
                setInitialOrder([...newFlashcardOrder]);
                setIsEditingOrder(false);
            } catch (error) {
                console.error("Error while updating new order:", error);
                toast.error("Failed to save new order");
            }
        });
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const newFlashcards = Array.from(form.getValues().flashcards);
        const [removed] = newFlashcards.splice(source.index, 1);

        newFlashcards.splice(destination.index, 0, removed);

        form.setValue("flashcards", newFlashcards);

        setNewFlashcardOrder([...newFlashcards]);
    };

    const getBorderClass = (field: FlashcardInForm) => {
        if (!field.flashcardId) {
            return "border-green-500";
        }

        return changedFlashcards.some((q) => q.flashcardId === field.flashcardId)
            ? "border-yellow-500"
            : "";
    };

    const addChangedFlashcard = (index: number) => {
        const updatedFlashcards = [...form.getValues().flashcards];
        const flashcard = updatedFlashcards[index];

        if (!flashcard.flashcardId) {
            return;
        }

        const existingIndex = changedFlashcards.findIndex(
            (q) => q.flashcardId === flashcard.flashcardId,
        );

        if (existingIndex > -1) {
            const updatedChangedQuestions = [...changedFlashcards];

            updatedChangedQuestions[existingIndex] = { ...flashcard };
            setChangedFlashcards(updatedChangedQuestions);
        } else {
            setChangedFlashcards((prev) => [...prev, { ...flashcard }]);
        }
    };

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

    const handleDelete = (index: number) => {
        const selectedQuestion = form.getValues().flashcards[index];

        remove(index);

        if (selectedQuestion.flashcardId) {
            deleteFlashcard(
                session?.user.token as string,
                selectedQuestion.flashcardId,
            )
                .then(() => {
                    toast.success("Flashcard deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting flashcard: ", error);
                    toast.error("Failed to delete flashcard");
                });
        } else {
            toast.success("Flashcard deleted successfully!");
        }
    };

    const handleImageUpload = (index: number, imageUrl: string) => {
        const updatedImageUrls = [...imageUrls];

        updatedImageUrls[index] = imageUrl;
        setImageUrls(updatedImageUrls);
        const updatedFlashcard = [...form.getValues().flashcards];

        updatedFlashcard[index].imageUrl = imageUrl;
        form.setValue("flashcards", updatedFlashcard);

        const updatedChangedFlashcards = [...changedFlashcards];
        const existingIndex = updatedChangedFlashcards.findIndex(
            (q) => q.flashcardId === updatedFlashcard[index].flashcardId,
        );

        if (existingIndex > -1) {
            updatedChangedFlashcards[existingIndex] = { ...updatedFlashcard[index] };
        } else {
            updatedChangedFlashcards.push({ ...updatedFlashcard[index] });
        }
        setChangedFlashcards(updatedChangedFlashcards);
    };

    const handleDeleteImage = (index: number) => {
        const updatedImageUrls = [...imageUrls];

        updatedImageUrls[index] = null;
        setImageUrls(updatedImageUrls);
        const updatedFlashcard = [...form.getValues().flashcards];

        updatedFlashcard[index].imageUrl = "";
        form.setValue("flashcards", updatedFlashcard);
        const updatedChangedFlashcards = [...changedFlashcards];
        const existingIndex = updatedChangedFlashcards.findIndex(
            (q) => q.flashcardId === updatedFlashcard[index].flashcardId,
        );

        if (existingIndex > -1) {
            updatedChangedFlashcards[existingIndex] = { ...updatedFlashcard[index] };
        } else {
            updatedChangedFlashcards.push({ ...updatedFlashcard[index] });
        }
        setChangedFlashcards(updatedChangedFlashcards);
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

        const updatedFlashcards = data.flashcards;
        const oldFlashcard = updatedFlashcards.filter(
            (flashcard) => flashcard.flashcardId,
        );
        const newFlashcards = updatedFlashcards.filter(
            (flashcard) => !flashcard.flashcardId,
        );
        const formattedNewFlashcards = newFlashcards.map((flashcard) => ({
            japaneseDefinition: flashcard.japaneseDefinition,
            vietEngTranslation: flashcard.vietEngTranslation,
            imageUrl: flashcard.imageUrl,
        }));

        startTransition(async () => {
            const isSetChanged =
                initialData?.title !== data.StudentFlashcardSetSchema.title ||
                initialData?.description !== data.StudentFlashcardSetSchema.description;

            if (isSetChanged) {
                try {
                    const updateResponse = await updateStudentSet(
                        session?.user.token as string,
                        initialData?.studentSetId as number,
                        data.StudentFlashcardSetSchema,
                    );

                    if (updateResponse.success === false) {
                        toast.error("Cập nhật bộ flashcard thất bại");
                    } else {
                        toast.success("Cập nhật bộ flashcard thành công");
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật bộ flashcard:", error);
                    toast.error("Có lỗi xảy ra khi cập nhật bộ flashcard");
                }
            }

            if (newFlashcards.length > 0) {
                try {
                    const repsonse = await createFlashcards(
                        session?.user.token as string,
                        initialData?.studentSetId as number,
                        formattedNewFlashcards,
                    );

                    console.log(repsonse);
                } catch (error) {
                    console.error("Có lỗi xảy ra trong quá trình tạo flashcard:", error);
                }
            }

            if (changedFlashcards.length > 0) {
                try {
                    for (const flashcard of changedFlashcards) {
                        if (flashcard?.flashcardId) {
                            const updateResponse = await updateFlashard(
                                session?.user.token as string,
                                flashcard,
                            );

                            if (updateResponse.success === false) {
                                toast.error(
                                    `Cập nhật flashcard thất bại: "${flashcard?.japaneseDefinition}"`,
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật flashcard:", error);
                }
            }
            setChangedFlashcards([]);
            await fetchFlashcardSet();
        });
    };

    const fetchFlashcardSet = async () => {
        try {
            setIsLoading(true);
            const data = await getStudentFlashcardSetById(
                Number(studentSetId),
                session?.user.token as string,
            );

            setInitialData(data);
            form.setValue("StudentFlashcardSetSchema", {
                title: data.title,
                description: data.description,
                isPublic: data.isPublic,
            });

            form.setValue(
                "flashcards",
                data.flashcards.map((card) => ({
                    flashcardId: card.flashcardId,
                    japaneseDefinition: card.japaneseDefinition,
                    vietEngTranslation: card.vietEngTranslation,
                    imageUrl: card.imageUrl,
                    cardOrder: card.cardOrder,
                })),
            );
            setInitialOrder(data.flashcards);
            setNewFlashcardOrder(data.flashcards);
        } catch (error) {
            console.error("Error fetching flashcard set:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!session?.user.token || !studentSetId) {
            setIsLoading(false);

            return;
        }
        fetchFlashcardSet();
    }, [studentSetId, session?.user.token]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen space-y-8 bg-white dark:bg-black p-10">
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="w-full flex flex-col space-y-6">
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-3xl font-extrabold">
                                CHỈNH SỬA BỘ FLASHCARD
                            </h1>
                            <div className="flex flex-row space-x-4 items-center">
                                <SetPublicStatusUpdate
                                    flashcardSet={initialData as FlashcardSet}
                                    flashcardSetId={Number(studentSetId)}
                                    setInitialData={setInitialData}
                                    token={session?.user.token as string}
                                />
                                <Button
                                    className="hover:scale-105 transition-all duration-100 text-lg"
                                    disabled={isSaving}
                                    type="submit"
                                >
                                    {isSaving ? "Đang lưu..." : "Lưu"}
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
                                            disabled={isSaving || isEditingOrder}
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
                                            disabled={isSaving || isEditingOrder}
                                            placeholder="Thêm một mô tả ... "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-medium text-lg dark:text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="flex flex-row space-x-4">
                            <Button
                                className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                disabled={isSaving || isEditingOrder}
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
                            <ImportCSVPopup
                                isCreating={isSaving}
                                isEditingOrder={isEditingOrder}
                                type="flashcard"
                            />
                            <input
                                accept=".csv"
                                className="hidden"
                                type="file"
                                onChange={handleFileImport}
                            />
                        </div>

                        <div className="flex flex-row space-x-4">
                            {isEditingOrder ? (
                                <>
                                    <Button
                                        className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                        disabled={isSavingNewOrder}
                                        type="button"
                                        variant={"outline"}
                                        onClick={handleCancelUpdateOrder}
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                        disabled={isSavingNewOrder}
                                        type="button"
                                        variant={"outline"}
                                        onClick={handleSaveNewOrder}
                                    >
                                        Lưu thứ tự
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="hover:scale-105 transition-all duration-100 font-medium text-lg"
                                    disabled={isSaving}
                                    type="button"
                                    variant={"outline"}
                                    onClick={handleUpdateOrderToggle}
                                >
                                    Thay đổi thứ tự <ArrowUpDown />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isEditingOrder ? (
                            <FlashcardUpdateOrder
                                fields={fields}
                                handleDragEnd={handleDragEnd}
                            />
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className={`w-full flex flex-col bg-white dark:bg-secondary rounded-xl border-[1px] dark:border-none shadow-lg ${getBorderClass(field)}`}
                                    >
                                        <FlashcardInForm
                                            addChangedFlashcard={addChangedFlashcard}
                                            field={field}
                                            handleDelete={handleDelete}
                                            handleDeleteImage={handleDeleteImage}
                                            handleImageUpload={handleImageUpload}
                                            index={index}
                                            isSaving={isSaving}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full hover:scale-95 transition-all duration-200 h-12 text-lg"
                        disabled={isSaving || isEditingOrder}
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
