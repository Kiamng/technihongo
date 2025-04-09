"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Component con chứa logic chính và sử dụng useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [subPlanId, setSubPlanId] = useState<string | null>(null);

  useEffect(() => {
    const storedSubPlanId = localStorage.getItem("lastSubPlanId");

    setSubPlanId(storedSubPlanId);
    localStorage.removeItem("lastOrderId");
    localStorage.removeItem("lastSubPlanId");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <p className="text-lg text-green-500 font-medium">
        Thanh toán thành công!
      </p>
      {orderId && (
        <p className="text-sm text-gray-600 mt-2">Order ID: {orderId}</p>
      )}
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/home">Về trang chủ</Link>
        </Button>
        {subPlanId && (
          <Button asChild variant="outline">
            <Link href={`/subscription-plan/${subPlanId}`}>
              Quay lại chi tiết gói
            </Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/transactions">Xem lịch sử giao dịch</Link>
        </Button>
      </div>
    </div>
  );
}

// Component hiển thị khi đang tải
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg">Đang tải...</p>
    </div>
  );
}

// Component chính với Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
