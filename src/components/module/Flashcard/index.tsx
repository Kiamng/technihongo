import Flaschard from "./flashcard-items";

export default function FlashcardModule() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white dark:bg-black">
      <div className="text-2xl font-semibold text-primary">
        TechNihongo gợi ý
      </div>
      <div className="flex flex-row w-full justify-between gap-x-4 mt-5">
        <Flaschard flashcardId="123" />
        <Flaschard flashcardId="456" />
        <Flaschard flashcardId="789" />
      </div>
    </div>
  );
}
