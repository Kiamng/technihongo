"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Calendar,
  CreditCard,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentTransactionList, Transaction } from "@/types/transaction";
import { getStudentTransactions } from "@/app/api/transactions/transactions.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Component Loading Animation
const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <DotLottieReact
        autoplay
        loop
        className="w-64 h-64"
        src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
      />
      <p className="text-gray-500 animate-pulse">Đang tải giao dịch...</p>
    </div>
  );
};

export function TransactionHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Sắp xếp local

  const fetchTransactions = async (page: number) => {
    try {
      setIsLoading(true);
      if (!session?.user.token) {
        throw new Error("Không có token hợp lệ");
      }
      const response: StudentTransactionList = await getStudentTransactions({
        token: session?.user.token as string,
        pageNo: page,
        pageSize: 100,
        sortBy: "paymentDate",
        sortDir: "desc", // Giữ sortDir mặc định từ API
      });

      setTransactions((prev) =>
        page === 0 ? response.content : [...prev, ...response.content],
      );
      setIsLastPage(response.last);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";

      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải danh sách giao dịch: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user?.token) {
      setError("Vui lòng đăng nhập để xem danh sách giao dịch");

      return;
    }

    setError(null);
    fetchTransactions(0); // Chỉ fetch khi khởi tạo
  }, [status, session?.user?.token]); // Không phụ thuộc sortDir

  const handleLoadMore = () => {
    const nextPage = pageNo + 1;

    setPageNo(nextPage);
    fetchTransactions(nextPage);
  };

  const handleViewDetail = (transactionId: number) => {
    router.push(`/transactions/${transactionId}`);
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === "desc" ? "asc" : "desc")); // Chỉ thay đổi sortDir
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Chưa thanh toán";
    }
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Ngày không hợp lệ";
    }

    return format(parsedDate, "dd/MM/yyyy HH:mm");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Hoàn thành
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Thất bại
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Đang xử lý
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const getTransactionIcon = (paymentMethod: string) => {
    switch (paymentMethod.toLowerCase()) {
      case "card":
      case "credit card":
      case "visa":
      case "mastercard":
        return <CreditCard className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  // Hàm sắp xếp transactions local
  const sortTransactions = (txs: Transaction[]) => {
    return [...txs].sort((a, b) => {
      const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
      const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;

      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const filterTransactions = (transactions: Transaction[]) => {
    if (!filterStatus) return transactions;

    return transactions.filter((tx) => tx.transactionStatus === filterStatus);
  };

  // Lọc và sắp xếp local
  const filteredAndSortedTransactions = sortTransactions(
    filterTransactions(transactions),
  );

  if (status === "loading" || (isLoading && pageNo === 0)) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 shadow-md">
        <CardContent className="flex flex-col items-center justify-center h-64 text-red-600 p-6">
          {error.includes("đăng nhập") ? (
            <div className="text-center">
              <p className="mb-4">{error}</p>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => router.push("/login")}
              >
                Đi đến trang đăng nhập
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-medium text-lg mb-2">Lỗi</p>
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="bg-white shadow-md border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Lịch sử giao dịch
          </CardTitle>
        </CardHeader>

        <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-2 items-center">
          <Button
            className="text-sm"
            size="sm"
            variant={filterStatus === null ? "default" : "outline"}
            onClick={() => setFilterStatus(null)}
          >
            Tất cả
          </Button>
          <Button
            className="text-sm bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
            size="sm"
            variant={filterStatus === "COMPLETED" ? "default" : "outline"}
            onClick={() => setFilterStatus("COMPLETED")}
          >
            Hoàn thành
          </Button>
          <Button
            className="text-sm bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
            size="sm"
            variant={filterStatus === "PENDING" ? "default" : "outline"}
            onClick={() => setFilterStatus("PENDING")}
          >
            Đang xử lý
          </Button>
          <Button
            className="text-sm bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
            size="sm"
            variant={filterStatus === "FAILED" ? "default" : "outline"}
            onClick={() => setFilterStatus("FAILED")}
          >
            Thất bại
          </Button>
          {/* Nút chuyển đổi sắp xếp */}
          <Button
            className="ml-auto text-sm border-teal-500 text-teal-600 hover:bg-teal-50"
            size="sm"
            variant="outline"
            onClick={toggleSortDir}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sắp xếp: {sortDir === "desc" ? "Mới nhất" : "Cũ nhất"}
          </Button>
        </div>

        <CardContent className="p-0">
          {filteredAndSortedTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredAndSortedTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.transactionAmount >= 0
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.transactionAmount >= 0 ? (
                        <ArrowDown className="w-6 h-6" />
                      ) : (
                        <ArrowUp className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Chi tiết giao dịch */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-medium text-gray-900 line-clamp-1">
                        {transaction.subscriptionPlanName}
                      </p>
                      {getStatusBadge(transaction.transactionStatus)}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(transaction.paymentDate)}
                      </div>

                      <div className="flex items-center gap-1">
                        {getTransactionIcon(transaction.paymentMethod)}
                        {transaction.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Số tiền và nút Xem chi tiết */}
                  <div className="flex flex-col items-end gap-2">
                    <p
                      className={`text-lg font-bold ${
                        transaction.transactionAmount < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.transactionAmount < 0 ? "" : "+"}
                      {formatAmount(transaction.transactionAmount)}
                    </p>

                    <Button
                      className="flex items-center gap-1 border-teal-500 text-teal-600 hover:bg-teal-50"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleViewDetail(transaction.transactionId)
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">
                Không tìm thấy giao dịch nào.
              </p>
              {filterStatus && (
                <Button
                  className="hover:scale-105 duration-100"
                  variant="link"
                  onClick={() => setFilterStatus(null)}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Hiển thị nút "Tải thêm" */}
          {!isLastPage && filteredAndSortedTransactions.length > 0 && (
            <div className="flex justify-center p-6">
              <Button
                className="border-teal-500 text-teal-600 hover:bg-teal-50 flex items-center gap-2"
                disabled={isLoading}
                variant="outline"
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>Tải thêm giao dịch</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
