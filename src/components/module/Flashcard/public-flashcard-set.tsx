import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPublicFlashcardSets } from "@/app/api/studentfolder/stufolder.api";
import { FlashcardSet } from "@/types/stuflashcardset";

export default function PublicFlashcardSetList() {
  const { data: session, status } = useSession();
  const token = session?.user?.token;
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      if (status === "loading") {
        // Nếu session đang loading, không làm gì
        return;
      }

      if (!token) {
        console.error("Token is undefined");

        return;
      }

      try {
        const data = await getPublicFlashcardSets(token);

        setSets(data);
      } catch (err) {
        console.error("Failed to fetch public flashcard sets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [token, status]);

  return (
    <div className="flex flex-col justify-center p-5 border-[1px] rounded-2xl bg-white bg-opacity-50 dark:bg-secondary dark:bg-opacity-50 relative">
      {/* Tiêu đề */}
      <div className="flex justify-between items-start">
        <div
          className="absolute top-[-20px] left-0 px-6 py-3 
          bg-green-500 text-white rounded-t-2xl 
          shadow-lg border border-green-700"
        >
          <span className="text-2xl font-semibold">Public Flashcard Set</span>
        </div>
      </div>

      {/* Nội dung */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mr-2" />
          Loading...
        </div>
      ) : (
        <div className="mt-5 relative">
          {sets.length === 0 ? (
            <div className="text-gray-500 text-center w-full py-5 bg-gray-50 bg-opacity-50 dark:bg-gray-700 rounded-lg border border-dashed flex flex-col items-center justify-center">
              <img
                alt="Empty public sets"
                className="w-24 h-24 object-contain mb-3 opacity-70"
                src="https://i.imgur.com/H82IgpA.jpeg"
              />
              <p>Không có bộ flashcard công khai nào</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden">
                <div
                  className="flex space-x-4 overflow-hidden scroll-smooth py-2 px-1"
                  id="public-sets-carousel"
                >
                  {sets.map((set) => (
                    <div
                      key={set.studentSetId}
                      className="flex-shrink-0 w-64 h-40 p-4 border rounded-lg bg-gray-100 bg-opacity-50 dark:bg-gray-700 hover:shadow-md transition-shadow flex flex-col"
                    >
                      <Link
                        className="flex-grow"
                        href={`/flashcard/${set.studentSetId}`}
                      >
                        <h3 className="text-lg font-semibold text-green-600 truncate">
                          {set.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {set.flashcards?.length || 0} thuật ngữ
                        </p>
                        {set.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {set.description}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {sets.length > 4 && (
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const carousel = document.getElementById(
                        "public-sets-carousel",
                      );

                      if (carousel) carousel.scrollLeft -= 300;
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const carousel = document.getElementById(
                        "public-sets-carousel",
                      );

                      if (carousel) carousel.scrollLeft += 300;
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
