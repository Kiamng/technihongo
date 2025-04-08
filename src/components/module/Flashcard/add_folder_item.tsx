"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/types/stuflashcardset";
import { getAllFlashcardSets } from "@/app/api/studentflashcardset/stuflashcard.api";
import { addFolderItem } from "@/app/api/folderitem/folderitem.api";
import { getPublicFlashcardSets } from "@/app/api/studentfolder/stufolder.api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
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
      const [ownSets, publicSets] = await Promise.all([
        getAllFlashcardSets(token),
        getPublicFlashcardSets(token),
      ]);

      const currentSetIdsSet = new Set(currentSetIds);

      const mergedSets = [...ownSets.data, ...publicSets].filter(
        (set, index, self) =>
          index === self.findIndex((s) => s.studentSetId === set.studentSetId),
      );

      const filtered = mergedSets.filter(
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
      console.log("Gửi yêu cầu thêm:", { folderId, studentSetId });
      await addFolderItem(token, { folderId, studentSetId });
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm flashcard set vào folder:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Flashcard Set vào Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm flashcard sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <p>Đang tải flashcard sets...</p>
            </div>
          ) : filteredSets.length === 0 ? (
            <div className="text-center py-8">
              <p>Không tìm thấy flashcard sets nào</p>
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
