import { Trash } from "lucide-react";
import { FieldValues } from "react-hook-form";

import FlashcardImageUpload from "./flashcard-image-upload";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface FlashcardInFormProps {
  field: FieldValues;
  index: number;
  isSaving: boolean;
  addChangedFlashcard: (index: number) => void;
  handleDelete: (index: number) => void;
  handleImageUpload: (index: number, imageUrl: string) => void;
  handleDeleteImage: (index: number) => void;
}
const FlashcardInForm = ({
  field,
  index,
  isSaving,
  addChangedFlashcard,
  handleDelete,
  handleImageUpload,
  handleDeleteImage,
}: FlashcardInFormProps) => {
  return (
    <>
      <div className="p-3 flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">{index + 1}</span>
        <div className="flex items-center space-x-2">
          <Button
            className={`${isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-red-500 hover:scale-105 duration-100"}`}
            disabled={isSaving}
            size={"icon"}
            type="button"
            variant={"ghost"}
            onClick={() => handleDelete(index)}
          >
            <Trash />
          </Button>
        </div>
      </div>
      <Separator className="dark:bg-black" />
      <div className="p-6 flex flex-row justify-between items-center space-x-5 w-full">
        <div className="flex-1">
          <FormField
            control={field.control}
            name={`flashcards.${index}.japaneseDefinition`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    {...field}
                    className="w-full dark:bg-secondary font-medium text-lg py-2 border-b-[1px] border-black dark:border-white focus:outline-none focus:border-primary"
                    disabled={isSaving}
                    placeholder="Nhập từ vựng"
                    onChange={(e) => {
                      field.onChange(e);
                      addChangedFlashcard(index);
                    }}
                  />
                </FormControl>
                <FormMessage className="font-medium text-lg dark:text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1">
          <FormField
            control={field.control}
            name={`flashcards.${index}.vietEngTranslation`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    {...field}
                    className="w-full dark:bg-secondary font-medium text-lg py-2 border-b-[1px] border-black dark:border-white focus:outline-none focus:border-primary"
                    disabled={isSaving}
                    placeholder="Nhập định nghĩa"
                    onChange={(e) => {
                      field.onChange(e);
                      addChangedFlashcard(index);
                    }}
                  />
                </FormControl>
                <FormMessage className="font-medium text-lg dark:text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <FlashcardImageUpload
          field={field}
          handleDeleteImage={handleDeleteImage}
          handleImageUpload={handleImageUpload}
          index={index}
          isSaving={isSaving}
        />
      </div>
    </>
  );
};

export default FlashcardInForm;
