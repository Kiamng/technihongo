import { ImagePlus, Trash } from "lucide-react";
import { FieldValues } from "react-hook-form";

interface FlashcardImageUploadProps {
  field: FieldValues;
  index: number;
  isSaving: boolean;
  handleImageSelect: (index: number, file: File) => void;
  handleDeleteImage: (index: number) => void;
}

const FlashcardImageUpload = ({
  field,
  index,
  isSaving,
  handleImageSelect,
  handleDeleteImage,
}: FlashcardImageUploadProps) => {
  return (
    <div className="flex-shrink-0">
      {!field.imageUrl ? (
        <>
          <input
            accept="image/*"
            className="hidden"
            id={`upload-${index}`}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                handleImageSelect(index, file);
              }
            }}
          />
          <label htmlFor={`upload-${index}`}>
            <div className="border-dashed border-[2px] rounded-lg h-[92px] w-32 flex items-center justify-center text-slate-500 hover:text-green-500 hover:scale-105 duration-100 cursor-pointer">
              <ImagePlus />
            </div>
          </label>
        </>
      ) : (
        <div
          className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500`}
          style={{
            backgroundImage: `url(${field.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            className="bg-slate-700 text-white hover:bg-red-500 p-1 h-fit"
            disabled={isSaving}
            type="button"
            onClick={() => handleDeleteImage(index)}
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardImageUpload;
