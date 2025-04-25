import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { searchFlashcardSets } from "@/app/api/studentfolder/stufolder.api";
import { FlashcardSet } from "@/types/stuflashcardset";

interface SearchFlashcardSetsProps {
  token: string;
  userName: string;
  onSearchResults: (results: FlashcardSet[]) => void;
  onLoading?: (isLoading: boolean) => void;
  onSearchStart?: (isSearching: boolean) => void;
}

export default function SearchFlashcardSets({
  token,
  userName,
  onSearchResults,
  onLoading,
  onSearchStart,
}: SearchFlashcardSetsProps) {
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [noResults, setNoResults] = useState<boolean>(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;

    setKeyword(newKeyword);
    onSearchStart?.(newKeyword.trim().length > 0);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setDebouncedKeyword(newKeyword);
    }, 500);
  };

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (!debouncedKeyword.trim()) {
        onSearchResults([]);
        setNoResults(false);

        return;
      }

      try {
        onLoading?.(true);
        const data = await searchFlashcardSets(token, debouncedKeyword);

        if (data.length === 0) {
          onSearchResults([]);
          setNoResults(true);
        } else {
          onSearchResults(data);
          setNoResults(false);
        }
      } catch (err) {
        console.error("Error searching flashcard sets:", err);
        onSearchResults([]);
        setNoResults(true);
      } finally {
        onLoading?.(false);
      }
    };

    fetchFlashcardSets();
  }, [debouncedKeyword, token, onSearchResults, onLoading]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Phần bên trái: Ảnh */}
        <div className="relative flex-shrink-0 w-48 h-48 transform transition-transform duration-300 hover:scale-105">
          <img
            alt="Mascot character"
            className="w-full h-full object-contain"
            src="https://i.imgur.com/Pqan0w4.png"
          />
        </div>

        {/* Phần bên phải: Text và Search */}
        <div className="flex-1 flex flex-col items-start">
          {/* Text */}
          <div className="text-teal-800">
            <div className="flex items-center justify-start">
              <p className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Xin chào {userName} 👋
              </p>
            </div>
            <div className="flex items-center justify-start mt-3">
              <p className="text-lg font-medium">
                Cấp độ hiện tại của bạn: N3{" "}
              </p>
              <span className="ml-2 text-xl">📝</span>
            </div>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="relative w-full max-w-xl mt-6">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-teal-500" />
            </div>
            <Input
              className="pl-10 bg-white border-2 border-teal-100 rounded-full h-14 w-full 
                focus:border-teal-300 focus:ring-2 focus:ring-teal-200 transition-all duration-300
                placeholder:text-teal-400 text-teal-800"
              placeholder="Tìm kiếm bài học, thư mục..."
              type="text"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
