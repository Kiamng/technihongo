import { Eye } from "lucide-react";
import Link from "next/link";

interface FlaschardProps {
  flashcardId: string;
}

const Flaschard = ({ flashcardId }: FlaschardProps) => {
  return (
    <div className="w-full p-3 flex flex-col justify-between border-[1px] border-primary rounded-lg gap-y-3 hover:-translate-y-1 hover:opacity-90 transition-all duration-300 hover:shadow-lg">
      <Link href={`/flashcard/${flashcardId}`}>
        <div className="text-base font-bold text-primary">Card Title</div>
        <div className="flex flex-row gap-x-1 mt-1">
          <div className="flex px-2 py-1 bg-secondary dark:bg-slate-700 items-center rounded-lg text-xs">
            100 <Eye size={16} strokeWidth={1.5} />
          </div>
          <div className="px-2 py-1 flex bg-secondary dark:bg-slate-700 items-center rounded-lg text-xs">
            100 Thuật ngữ
          </div>
        </div>
        <div className="mt-3">rating</div>
      </Link>
      <Link className="hover:text-primary" href={"/"}>
        Creator
      </Link>
    </div>
  );
};

export default Flaschard;
