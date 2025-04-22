import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onDelete?: () => void;
    rating: number;
    review: string;
    onRatingChange: (rating: number) => void;
    onReviewChange: (review: string) => void;
    isSubmitting: boolean;
    hasRated: boolean;
    title?: string;
}

export default function RatingModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    rating,
    review,
    onRatingChange,
    onReviewChange,
    isSubmitting,
    hasRated,
    title = "Đánh giá khóa học",
}: RatingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold text-center mb-4 text-[#2B5F54]">
                    {hasRated ? "Chỉnh sửa đánh giá" : title}
                </h3>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="rating-input"
                    >
                        Số sao
                    </label>
                    <input readOnly id="rating-input" type="hidden" value={rating} />
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                aria-label={`Chọn ${star} sao`}
                                className={`text-2xl ${star <= rating ? "text-orange-400" : "text-gray-300"
                                    } hover:text-orange-300 transition-colors`}
                                onClick={() => onRatingChange(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="review-input"
                    >
                        Nhận xét
                    </label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="review-input"
                        placeholder="Viết nhận xét của bạn..."
                        rows={4}
                        value={review}
                        onChange={(e) => onReviewChange(e.target.value)}
                    />
                </div>
                <div className="flex justify-center gap-4">
                    <Button
                        className="hover:scale-105 duration-100"
                        disabled={isSubmitting}
                        onClick={onSubmit}
                    >
                        {isSubmitting
                            ? "Đang xử lý..."
                            : hasRated
                                ? "Cập nhật đánh giá"
                                : "Gửi đánh giá"}
                    </Button>
                    {hasRated && onDelete && (
                        <Button
                            className=" hover:scale-105 duration-100"
                            disabled={isSubmitting}
                            variant="destructive"
                            onClick={onDelete}
                        >
                            Xóa đánh giá
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
