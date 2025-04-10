import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { FieldValues } from "react-hook-form";

interface FlashcardImageUploadProps {
  field: FieldValues;
  index: number;
  isSaving: boolean;
  handleImageUpload: (index: number, imageUrl: string) => void;
  handleDeleteImage: (index: number) => void;
}

const FlashcardImageUpload = ({
  field,
  index,
  isSaving,
  handleImageUpload,
  handleDeleteImage,
}: FlashcardImageUploadProps) => {
  return (
    <div className="flex-shrink-0">
      {!field.imageUrl ? (
        <CldUploadWidget
          options={{
            sources: ["local", "camera", "url"],
            resourceType: "auto",
          }}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUD_IMAGE_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (typeof result.info === "object" && result.info !== null) {
              const uploadInfo = result.info;
              const imageUrl = uploadInfo.secure_url;

              handleImageUpload(index, imageUrl);
            }
          }}
        >
          {({ open }) => (
            <button
              className={`border-dashed border-[2px] rounded-lg h-[80px] w-[100px] flex items-center justify-center text-slate-500 ${isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"}`}
              disabled={isSaving}
              type="button"
              onClick={() => open()}
            >
              <ImagePlus />
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <div
          className={`border-dashed border-[2px] rounded-lg h-[80px] w-[100px] flex justify-end text-slate-500`}
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
