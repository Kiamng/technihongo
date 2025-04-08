"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

import { TransactionDetail } from "@/types/transaction";
import { getTransactionDetail } from "@/app/api/transactions/transactions.api";
import { Button } from "@/components/ui/button";

// Component Loading Animation
const LoadingAnimation = () => {
  return (
    <DotLottieReact
      autoplay
      loop
      className="w-64 h-64"
      src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
    />
  );
};

interface TransactionDetailPageProps {
  transactionId: number;
}

export function TransactionDetailPage({
  transactionId,
}: TransactionDetailPageProps) {
  const { data: session, status } = useSession();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionDetail = async () => {
    try {
      setIsLoading(true);
      if (!session?.user.token) {
        throw new Error("Không có token hợp lệ");
      }
      const response = await getTransactionDetail({
        token: session.user.token as string,
        transactionId,
      });

      setTransaction(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";

      console.error("Lỗi khi lấy chi tiết giao dịch:", err);
      setError("Không thể tải chi tiết giao dịch: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user?.token) {
      setError("Vui lòng đăng nhập để xem chi tiết giao dịch");

      return;
    }

    setError(null);
    fetchTransactionDetail();
  }, [status, session?.user?.token, transactionId]);

  // Định dạng số tiền (VND)
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Định dạng ngày tháng với kiểm tra lỗi
  const formatDate = (date: string | null) => {
    if (!date) {
      return "Chưa thanh toán";
    }
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.warn(`Ngày không hợp lệ: ${date}`);

      return "Ngày không hợp lệ";
    }

    return format(parsedDate, "dd/MM/yyyy HH:mm");
  };

  // Xác định màu sắc và văn bản cho trạng thái giao dịch
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: "✓",
          text: "Hoàn thành",
        };
      case "FAILED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: "✗",
          text: "Thất bại",
        };
      case "PENDING":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: "⌛",
          text: "Đang xử lý",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: "?",
          text: status,
        };
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white/80 backdrop-blur-sm rounded-xl">
        Container
        <LoadingAnimation />
        <p className="text-gray-600 font-medium mt-4">
          Đang tải thông tin giao dịch...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-red-50 rounded-xl border border-red-200 p-8">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-4">
          Có lỗi xảy ra
        </h3>
        {error.includes("đăng nhập") ? (
          <div className="text-center">
            <p className="text-gray-700 mb-4">{error}</p>
            <Link
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors inline-flex items-center gap-2"
              href="/login"
            >
              <span>Đi đến trang đăng nhập</span>
              <span className="text-sm">→</span>
            </Link>
          </div>
        ) : (
          <p className="text-gray-700">{error}</p>
        )}
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Không tìm thấy giao dịch
        </h3>
        <p className="text-gray-500 mb-6">
          Giao dịch này có thể đã bị xóa hoặc không tồn tại
        </p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transaction.transactionStatus);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Chi tiết giao dịch #{transaction.transactionId}
          </h1>
        </div>
      </div>

      {/* Số tiền và thông tin thanh toán */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-teal-100 text-sm font-medium mb-1">
              Tổng số tiền
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {transaction.transactionAmount < 0
                ? formatAmount(transaction.transactionAmount)
                : `+${formatAmount(transaction.transactionAmount)}`}
            </h2>
            <p className="text-teal-100 mt-2">
              {transaction.paymentMethod.name} ({transaction.paymentMethod.code}
              )
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full md:w-auto">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-teal-100">Ngày thanh toán</p>
                <p className="font-medium">
                  {formatDate(transaction.paymentDate)}
                </p>
              </div>
              <div>
                <p className="text-teal-100">Ngày tạo</p>
                <p className="font-medium">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-teal-100">Hết hạn</p>
                <p className="font-medium">
                  {formatDate(transaction.expiresAt)}
                </p>
              </div>
              <div>
                <p className="text-teal-100">Mã đơn hàng</p>
                <p className="font-medium">{transaction.externalOrderId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chính */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Gói đăng ký */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500 mr-2">📦</span>
              Thông tin gói đăng ký
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {transaction.subscription.subscriptionPlan.name}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {transaction.subscription.subscriptionPlan.durationDays} ngày
                </span>
              </div>
              <p className="text-gray-700 text-lg font-medium mb-2">
                {formatAmount(transaction.subscription.subscriptionPlan.price)}{" "}
                VND
              </p>
              <p className="text-gray-600 text-sm">
                {transaction.subscription.subscriptionPlan.benefits}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Ngày bắt đầu</p>
                  <p className="font-medium">
                    {formatDate(transaction.subscription.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ngày kết thúc</p>
                  <p className="font-medium">
                    {formatDate(transaction.subscription.endDate)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  <span>{statusInfo.icon}</span>
                  <span className="ml-1">{statusInfo.text}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-4 mb-8">
        <Link className="hover:scale-105 duration-100" href="/transactions">
          <Button>Quay lại</Button>
        </Link>
      </div>
    </div>
  );
}
