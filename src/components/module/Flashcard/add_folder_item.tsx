"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/types/stuflashcardset";
import { getAllFlashcardSets } from "@/app/api/studentflashcardset/stuflashcard.api";
import { addFolderItem } from "@/app/api/folderitem/folderitem.api";

interface AddFlashcardSetModalProps {
  folderId: number;
  currentSetIds: number[];
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  token: string;
}

export const AddFlashcardSetModal = ({
  folderId,
  currentSetIds,
  isOpen,
  onClose,
  onAddSuccess,
  token,
}: AddFlashcardSetModalProps) => {
  const [loading, setLoading] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSets, setFilteredSets] = useState<FlashcardSet[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFlashcardSets();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = flashcardSets.filter((set) =>
      set.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredSets(filtered);
  }, [searchTerm, flashcardSets]);

  const fetchFlashcardSets = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getAllFlashcardSets(token);
      const sets = response.data as FlashcardSet[];
      const currentSetIdsSet = new Set(currentSetIds);

      const filtered = sets.filter(
        (set) =>
          set.studentSetId != null && !currentSetIdsSet.has(set.studentSetId),
      );

      setFlashcardSets(filtered);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách flashcard sets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFolder = async (studentSetId: number) => {
    if (!folderId || !studentSetId) {
      console.error("Dữ liệu không hợp lệ:", { folderId, studentSetId });

      return;
    }

    try {
      await addFolderItem(token, { folderId, studentSetId });
      setFlashcardSets((prev) =>
        prev.filter((set) => set.studentSetId !== studentSetId),
      );
      toast.success("Đã thêm flashcard set vào thư mục thành công!");
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm flashcard set vào folder:", error);
      toast.error("Có lỗi xảy ra khi thêm flashcard set [error]");
    }
  };

  const noSetAvailable = !loading && flashcardSets.length === 0;
  const noSearchResult =
    !loading && flashcardSets.length > 0 && filteredSets.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Flashcard Set vào Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search input */}
          <input
            className="w-full p-2 border rounded"
            placeholder="Tìm kiếm flashcard set..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Đang tải flashcard sets...</p>
            </div>
          ) : noSetAvailable ? (
            <div className="text-center py-8">
              <p>Hiện tại không còn flashcard set nào để thêm</p>
            </div>
          ) : noSearchResult ? (
            <div className="text-center py-8">
              <p>Không tìm thấy flashcard set nào phù hợp với từ khóa</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSets.map((set) => (
                <div
                  key={set.studentSetId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{set.title}</h4>
                    <p className="text-sm text-gray-600">{set.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToFolder(set.studentSetId)}
                  >
                    Thêm
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
