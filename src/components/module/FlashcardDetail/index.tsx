import FlashcardList from "@/components/module/FlashcardDetail/flashcard-list";
import TermList from "@/components/module/FlashcardDetail/term-list";

interface FlashcardDetailModuleProps {
  flashcardId: string;
}

export default function FlashcardDetailModule({
  flashcardId,
}: FlashcardDetailModuleProps) {
  const flashcards = [
    { question: "会見", answer: "かいけん: hội họp" },
    { question: "国会", answer: "こっかい: quốc hội" },
    {
      question: "会社",
      answer: "かいしゃ: công ty",
    },
  ];

  return (
    <div className="w-full space-y-20">
      <div>
        <div className="px-8 py-4 text-white dark:text-inherit bg-primary text-2xl font-bold w-fit mx-auto rounded-tl-3xl rounded-tr-3xl min-w-[765px]">
          Flashcard set name
        </div>
        <div className="w-full flex justify-center">
          <div className="flashcard-app flex flex-col space-y-6 bg-secondary p-10 w-fit rounded-2xl shadow-md dark:shadow-none bg-white dark:bg-secondary">
            {/*creator and created time*/}
            <div>
              <div className="flex gap-x-2 items-center">
                <div className=" avatar w-10 h-10 bg-primary rounded-full" />
                <div>
                  <div className="text-primary text-xl font-bold">
                    Creator name
                  </div>
                  <div className="italic text-base text-slate-400 ">
                    dd/mm/yyyy
                  </div>
                </div>
              </div>
            </div>
            {/*flashcard list and slide button*/}
            <FlashcardList FlashcardList={flashcards} />
          </div>
        </div>
      </div>

      <TermList FlashcardList={flashcards} />
    </div>
  );
}
