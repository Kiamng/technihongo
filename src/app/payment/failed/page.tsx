"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Create a component that uses useSearchParams
function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");
  const [subPlanId, setSubPlanId] = useState<string | null>(null);

  useEffect(() => {
    const storedSubPlanId = localStorage.getItem("lastSubPlanId");

    setSubPlanId(storedSubPlanId);
    localStorage.removeItem("lastOrderId");
    localStorage.removeItem("lastSubPlanId");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-lg text-red-500 font-medium">Thanh toán thất bại</p>
      {orderId && (
        <p className="text-sm text-gray-600 mt-2">Order ID: {orderId}</p>
      )}
      {message && (
        <p className="text-sm text-gray-600 mt-2">Lý do: {message}</p>
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

// Create a loading fallback
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg">Đang tải...</p>
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFailedContent />
    </Suspense>
  );
}
