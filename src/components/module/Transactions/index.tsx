/* eslint-disable unused-imports/no-unused-imports */

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
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentTransactionList, Transaction } from "@/types/transaction";
import { getStudentTransactions } from "@/app/api/transactions/transactions.api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types/supbscription";
import { getSubscriptionHistory } from "@/app/api/subscription/subscription.api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";

export function TransactionHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"transactions" | "subscriptions">(
    "subscriptions",
  );

  // Transaction History State
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(
    null,
  );
  const [pageNoTransactions, setPageNoTransactions] = useState<number>(0);
  const [isLastPageTransactions, setIsLastPageTransactions] =
    useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortDirTransactions, setSortDirTransactions] = useState<
    "asc" | "desc"
  >("desc");

  // Subscription History State
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] =
    useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [errorSubscriptions, setErrorSubscriptions] = useState<string | null>(
    null,
  );
  const [pageNoSubscriptions, setPageNoSubscriptions] = useState<number>(0);
  const [isLastPageSubscriptions, setIsLastPageSubscriptions] =
    useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortDirSubscriptions, setSortDirSubscriptions] = useState<
    "asc" | "desc"
  >("desc");

  // Transaction History Logic
  const fetchTransactions = async (page: number, reset = false) => {
    try {
      setIsLoadingTransactions(true);
      if (!session?.user.token) {
        throw new Error("Không có token hợp lệ");
      }
      const response: StudentTransactionList = await getStudentTransactions({
        token: session?.user.token as string,
        pageNo: page,
        pageSize: 100,
        sortBy: "paymentDate",
        sortDir: "desc",
      });

      setTransactions((prev) =>
        reset || page === 0 ? response.content : [...prev, ...response.content],
      );
      setIsLastPageTransactions(response.last);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";

      console.error("Lỗi khi lấy dữ liệu:", err);
      setErrorTransactions(
        "Không thể tải danh sách giao dịch: " + errorMessage,
      );
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Subscription History Logic
  // Subscription History Logic
  const fetchSubscriptionHistory = async (page: number, reset = false) => {
    try {
      setIsLoadingSubscriptions(true);
      if (!session?.user?.token) {
        throw new Error("Không có token hợp lệ");
      }

      const studentId = session.user.studentId;

      if (!studentId || typeof studentId !== "number") {
        throw new Error("Không tìm thấy studentId hợp lệ trong session");
      }

      const response = await getSubscriptionHistory({
        token: session.user.token as string,
        studentId,
        pageNo: page,
        pageSize: 10,
      });

      const content = Array.isArray(response.content) ? response.content : [];

      setSubscriptions((prev) =>
        reset || page === 0 ? content : [...prev, ...content],
      );
      setIsLastPageSubscriptions(response.last ?? false);
      setTotalElements(response.totalElements ?? 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";

      console.error("Lỗi khi lấy lịch sử gói đăng ký:", err);
      setErrorSubscriptions(
        "Không thể tải lịch sử gói đăng ký: " + errorMessage,
      );
      setSubscriptions([]);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // Fetch both transactions and subscriptions on mount
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.token) {
      setErrorTransactions("Vui lòng đăng nhập để xem danh sách giao dịch");
      setErrorSubscriptions("Vui lòng đăng nhập để xem lịch sử gói đăng ký");

      return;
    }

    // Fetch transactions and subscriptions only if not already fetched
    if (transactions.length === 0 && !errorTransactions) {
      fetchTransactions(0);
    }
    if (subscriptions.length === 0 && !errorSubscriptions) {
      fetchSubscriptionHistory(0);
    }
  }, [status, session?.user?.token]);

  // Transaction Handlers
  const handleLoadMoreTransactions = () => {
    const nextPage = pageNoTransactions + 1;

    setPageNoTransactions(nextPage);
    fetchTransactions(nextPage);
  };

  const handleViewDetail = (transactionId: number) => {
    router.push(`/transactions/${transactionId}`);
  };

  const toggleSortDirTransactions = () => {
    setSortDirTransactions((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Subscription Handlers
  const handleLoadMoreSubscriptions = () => {
    const nextPage = pageNoSubscriptions + 1;

    setPageNoSubscriptions(nextPage);
    fetchSubscriptionHistory(nextPage);
  };

  const toggleSortDirSubscriptions = () => {
    setSortDirSubscriptions((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Shared Formatting Functions
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

  // Transaction Formatting
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

  // Subscription Formatting
  const getSubscriptionStatusDetails = (groupStatus: string) => {
    switch (groupStatus) {
      case "Đang hoạt động":
        return {
          label: "Đang hoạt động",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-500",
          cardBg: "bg-gradient-to-br from-green-50 to-teal-100",
          dateBg: "bg-green-50",
          dateText: "text-green-900",
          border: "border-l-4 border-green-600",
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ),
          iconBg: "bg-gradient-to-br from-green-600 to-teal-700",
        };
      case "Sắp mở":
        return {
          label: "Sắp mở",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-500",
          cardBg: "bg-gradient-to-br from-yellow-50 to-orange-100",
          dateBg: "bg-yellow-50",
          dateText: "text-yellow-900",
          border: "border-l-4 border-yellow-600",
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ),
          iconBg: "bg-gradient-to-br from-yellow-600 to-orange-700",
        };
      default:
        return {
          label: groupStatus,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
          cardBg: "bg-gradient-to-br from-gray-50 to-gray-100",
          dateBg: "bg-gray-50",
          dateText: "text-gray-700",
          border: "border-l-4 border-gray-400",
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ),
          iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
        };
    }
  };

  const getPaymentIcon = (paymentMethod: string) => {
    switch (paymentMethod.toLowerCase()) {
      case "momopay":
      case "momo":
        return (
          <svg className="w-5 h-5" fill="#ae2070" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        );
      case "vnpay":
        return (
          <svg className="w-5 h-5" fill="#0066ff" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        );
      case "paypal":
        return (
          <svg className="w-5 h-5" fill="#0070ba" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        );
    }
  };

  // Transaction Sorting and Filtering
  const sortTransactions = (txs: Transaction[]) => {
    return [...txs].sort((a, b) => {
      const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
      const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;

      return sortDirTransactions === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const filterTransactions = (transactions: Transaction[]) => {
    if (!filterStatus) return transactions;

    return transactions.filter((tx) => tx.transactionStatus === filterStatus);
  };

  const filteredAndSortedTransactions = sortTransactions(
    filterTransactions(transactions),
  );

  // Subscription Sorting
  const sortSubscriptions = (subs: Subscription[]) => {
    return [...subs].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;

      return sortDirSubscriptions === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const sortedActiveSubscriptions = sortSubscriptions(
    subscriptions.filter((sub) => sub.groupStatus === "Đang hoạt động"),
  );
  const sortedUpcomingSubscriptions = sortSubscriptions(
    subscriptions.filter((sub) => sub.groupStatus === "Sắp mở"),
  );

  if (
    status === "loading" ||
    (isLoadingTransactions && transactions.length === 0) ||
    (isLoadingSubscriptions && subscriptions.length === 0)
  ) {
    return <LoadingAnimation />;
  }

  if (errorTransactions || errorSubscriptions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <svg
            className="w-20 h-20 text-red-400 mx-auto mb-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          {(errorTransactions || errorSubscriptions)?.includes("đăng nhập") ? (
            <>
              <p className="text-xl font-semibold text-gray-800 mb-4">
                {errorTransactions || errorSubscriptions}
              </p>
              <a
                className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                href="/login"
              >
                Đăng nhập
              </a>
            </>
          ) : (
            <p className="text-xl font-semibold text-gray-800">
              {`Lỗi: ${errorTransactions || errorSubscriptions}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white shadow-md border-0 overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-[#57D061] to-[#A3E4A7] text-white p-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              {activeTab === "transactions"
                ? "Lịch sử giao dịch"
                : "Gói đang hoạt động"}
            </CardTitle>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "transactions" | "subscriptions")
            }
          >
            <TabsList className="bg-transparent w-full justify-start p-0 h-auto mb-2 border-b">
              <TabsTrigger
                className="rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#57D061] data-[state=active]:shadow-none bg-transparent data-[state=active]:text-[#57D061] transition-all"
                value="subscriptions"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Gói đang hoạt động
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#57D061] data-[state=active]:shadow-none bg-transparent data-[state=active]:text-[#57D061] transition-all"
                value="transactions"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Lịch sử giao dịch
              </TabsTrigger>
            </TabsList>

            <TabsContent className="mt-6" value="transactions">
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
                <Button
                  className="ml-auto text-sm border-teal-500 text-teal-600 hover:bg-teal-50"
                  size="sm"
                  variant="outline"
                  onClick={toggleSortDirTransactions}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sắp xếp:{" "}
                  {sortDirTransactions === "desc" ? "Mới nhất" : "Cũ nhất"}
                </Button>
              </div>

              <div className="p-0">
                {filteredAndSortedTransactions.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredAndSortedTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.transactionAmount >= 0
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
                        <div className="flex flex-col items-end gap-2">
                          <p
                            className={`text-lg font-bold ${transaction.transactionAmount < 0
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

                {!isLastPageTransactions &&
                  filteredAndSortedTransactions.length > 0 && (
                    <div className="flex justify-center p-6">
                      <Button
                        className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                        disabled={isLoadingTransactions}
                        onClick={handleLoadMoreTransactions}
                      >
                        {isLoadingTransactions ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          <>Tải thêm giao dịch</>
                        )}
                      </Button>
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent className="mt-6" value="subscriptions">
              {sortedActiveSubscriptions.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center border-b-2 border-green-600 pb-3">
                    <svg
                      className="w-6 h-6 mr-3 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Đang hoạt động ({sortedActiveSubscriptions.length})
                  </h2>
                  <div className="space-y-6">
                    {sortedActiveSubscriptions.map((subscription) => {
                      const statusDetails = getSubscriptionStatusDetails(
                        subscription.groupStatus,
                      );

                      return (
                        <div
                          key={subscription.subscriptionId}
                          className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${statusDetails.cardBg} ${statusDetails.border}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center">
                              <div
                                className={`w-14 h-14 ${statusDetails.iconBg} rounded-full flex items-center justify-center shadow-md`}
                              >
                                {statusDetails.icon}
                              </div>
                              <div className="ml-4">
                                <p className="text-xl font-semibold text-gray-900">
                                  {subscription.planName}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusDetails.bgColor} ${statusDetails.textColor} flex items-center`}
                                  >
                                    <span
                                      className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${statusDetails.dotColor}`}
                                    />
                                    {statusDetails.label}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-600 gap-2 bg-white/90 px-3 py-1 rounded-full">
                                    {getPaymentIcon(subscription.paymentMethod)}
                                    {subscription.paymentMethod}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600 bg-white/90 px-3 py-1 rounded-full">
                                    {formatAmount(subscription.amount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-auto flex flex-col sm:flex-row gap-3">
                              <div
                                className={`${statusDetails.dateBg} px-4 py-3 rounded-lg shadow-sm flex flex-col items-center min-w-[140px] border border-green-300`}
                              >
                                <span className="text-xs uppercase font-semibold text-gray-500">
                                  Bắt đầu
                                </span>
                                <span
                                  className={`font-bold ${statusDetails.dateText} text-sm`}
                                >
                                  {formatDate(subscription.startDate)}
                                </span>
                              </div>
                              <div
                                className={`${statusDetails.dateBg} px-4 py-3 rounded-lg shadow-sm flex flex-col items-center min-w-[140px] border border-green-300`}
                              >
                                <span className="text-xs uppercase font-semibold text-gray-500">
                                  Kết thúc
                                </span>
                                <span
                                  className={`font-bold ${statusDetails.dateText} text-sm`}
                                >
                                  {formatDate(subscription.endDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {sortedUpcomingSubscriptions.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center border-b-2 border-yellow-600 pb-3">
                    <svg
                      className="w-6 h-6 mr-3 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Sắp mở ({sortedUpcomingSubscriptions.length})
                  </h2>
                  <div className="space-y-6">
                    {sortedUpcomingSubscriptions.map((subscription) => {
                      const statusDetails = getSubscriptionStatusDetails(
                        subscription.groupStatus,
                      );

                      return (
                        <div
                          key={subscription.subscriptionId}
                          className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${statusDetails.cardBg} ${statusDetails.border}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center">
                              <div
                                className={`w-14 h-14 ${statusDetails.iconBg} rounded-full flex items-center justify-center shadow-md`}
                              >
                                {statusDetails.icon}
                              </div>
                              <div className="ml-4">
                                <p className="text-xl font-semibold text-gray-900">
                                  {subscription.planName}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusDetails.bgColor} ${statusDetails.textColor} flex items-center`}
                                  >
                                    <span
                                      className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${statusDetails.dotColor}`}
                                    />
                                    {statusDetails.label}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-600 gap-2 bg-white/90 px-3 py-1 rounded-full">
                                    {getPaymentIcon(subscription.paymentMethod)}
                                    {subscription.paymentMethod}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600 bg-white/90 px-3 py-1 rounded-full">
                                    {formatAmount(subscription.amount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-auto flex flex-col sm:flex-row gap-3">
                              <div
                                className={`${statusDetails.dateBg} px-4 py-3 rounded-lg shadow-sm flex flex-col items-center min-w-[140px] border border-yellow-300`}
                              >
                                <span className="text-xs uppercase font-semibold text-gray-500">
                                  Bắt đầu
                                </span>
                                <span
                                  className={`font-bold ${statusDetails.dateText} text-sm`}
                                >
                                  {formatDate(subscription.startDate)}
                                </span>
                              </div>
                              <div
                                className={`${statusDetails.dateBg} px-4 py-3 rounded-lg shadow-sm flex flex-col items-center min-w-[140px] border border-yellow-300`}
                              >
                                <span className="text-xs uppercase font-semibold text-gray-500">
                                  Kết thúc
                                </span>
                                <span
                                  className={`font-bold ${statusDetails.dateText} text-sm`}
                                >
                                  {formatDate(subscription.endDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isLastPageSubscriptions && subscriptions.length > 0 && (
                <div className="flex justify-center p-6">
                  <Button
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                    disabled={isLoadingSubscriptions}
                    onClick={handleLoadMoreSubscriptions}
                  >
                    {isLoadingSubscriptions ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>Tải thêm gói đăng ký</>
                    )}
                  </Button>
                </div>
              )}

              {subscriptions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">
                    Không tìm thấy gói đăng ký nào.
                  </p>
                  <Button
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                    onClick={() => fetchSubscriptionHistory(0, true)}
                  >
                    <RefreshCw className="w-5 h-5" />
                    Làm mới
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
