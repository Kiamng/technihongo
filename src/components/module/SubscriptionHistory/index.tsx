/* eslint-disable no-console */
/* eslint-disable unused-imports/no-unused-imports */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowUpDown } from "lucide-react";

import { getSubscriptionHistory } from "@/app/api/subscription/subscription.api";
import { Subscription } from "@/types/supbscription";
import { Button } from "@/components/ui/button";

// Animations
const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center">
      <DotLottieReact
        autoplay
        loop
        className="w-40 h-40"
        src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
      />
      <p className="text-gray-500 mt-2 animate-pulse">Đang tải dữ liệu...</p>
    </div>
  );
};

export function SubscriptionHistoryPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [inactiveLimit, setInactiveLimit] = useState<number>(3); // Giới hạn ban đầu cho "Không hoạt động/Hết hạn"

  const fetchSubscriptionHistory = async (page: number) => {
    try {
      setIsLoading(true);
      if (!session?.user?.token) {
        throw new Error("Không có token hợp lệ");
      }

      console.log("Session Token:", session.user.token);
      const studentId = session.user.studentId;

      console.log("Student ID from Session:", studentId);
      if (!studentId || typeof studentId !== "number") {
        throw new Error("Không tìm thấy studentId hợp lệ trong session");
      }

      const response = await getSubscriptionHistory({
        token: session.user.token as string,
        studentId,
        pageNo: page,
        pageSize: 10,
      });

      console.log("API Response:", response);
      const content = Array.isArray(response.content) ? response.content : [];

      setSubscriptions((prev) =>
        page === 0 ? content : [...prev, ...content],
      );
      setIsLastPage(response.last ?? false);
      setTotalElements(response.totalElements ?? 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";

      console.error("Lỗi khi lấy lịch sử gói đăng ký:", err);
      setError("Không thể tải lịch sử gói đăng ký: " + errorMessage);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    console.log("Full Session:", session);
    if (!session?.user?.token) {
      setError("Vui lòng đăng nhập để xem lịch sử gói đăng ký");

      return;
    }

    setError(null);
    fetchSubscriptionHistory(0);
  }, [status, session?.user?.token]);

  const handleLoadMore = () => {
    const nextPage = pageNo + 1;

    setPageNo(nextPage);
    fetchSubscriptionHistory(nextPage);
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleShowMoreInactive = () => {
    setInactiveLimit((prev) => prev + 3); // Tăng giới hạn thêm 3 mỗi lần bấm
  };

  // Định dạng ngày tháng với kiểm tra lỗi
  const formatDate = (date: string | null) => {
    if (!date) return "Không có thông tin";
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.warn(`Ngày không hợp lệ: ${date}`);

      return "Ngày không hợp lệ";
    }

    return format(parsedDate, "dd/MM/yyyy HH:mm");
  };

  // Định dạng số tiền
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm sắp xếp subscriptions local
  const sortSubscriptions = (subs: Subscription[]) => {
    return [...subs].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;

      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  // Xác định trạng thái hiển thị và màu dựa trên groupStatus
  const getStatusDetails = (groupStatus: string) => {
    switch (groupStatus) {
      case "Đang hoạt động":
        return {
          label: "Đang hoạt động",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
          cardBg: "bg-gradient-to-br from-green-50 to-teal-50",
          dateBg: "bg-green-100",
          dateText: "text-green-800",
          border: "border-l-4 border-green-500",
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
          iconBg: "bg-gradient-to-br from-green-500 to-teal-600",
        };
      case "Không hoạt động/Hết hạn":
        return {
          label: "Không hoạt động/Hết hạn",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          dotColor: "bg-red-500",
          cardBg: "bg-gradient-to-br from-gray-50 to-red-50",
          dateBg: "bg-gray-100",
          dateText: "text-gray-700",
          border: "border-l-4 border-red-400",
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ),
          iconBg: "bg-gradient-to-br from-red-500 to-red-600",
        };
      case "Sắp mở":
        return {
          label: "Sắp mở",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          dotColor: "bg-yellow-500",
          cardBg: "bg-gradient-to-br from-yellow-50 to-orange-50",
          dateBg: "bg-yellow-100",
          dateText: "text-yellow-800",
          border: "border-l-4 border-yellow-500",
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
          iconBg: "bg-gradient-to-br from-yellow-500 to-orange-600",
        };
      default:
        return {
          label: groupStatus,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
          cardBg: "bg-gray-50",
          dateBg: "bg-gray-100",
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

  // Xác định icon dựa trên phương thức thanh toán
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

  if (status === "loading" || (isLoading && pageNo === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500 p-6">
        <svg
          className="w-16 h-16 text-red-400 mb-4"
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
        {error.includes("đăng nhập") ? (
          <div className="text-center">
            <p className="text-lg mb-3">{error}</p>
            <a
              className="inline-block px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              href="/login"
            >
              Đăng nhập
            </a>
          </div>
        ) : (
          <p className="text-lg text-center">{`Lỗi: ${error}`}</p>
        )}
      </div>
    );
  }

  // Nhóm các gói đăng ký theo groupStatus và sắp xếp local
  const sortedActiveSubscriptions = sortSubscriptions(
    subscriptions.filter((sub) => sub.groupStatus === "Đang hoạt động"),
  );
  const sortedInactiveSubscriptions = sortSubscriptions(
    subscriptions.filter(
      (sub) => sub.groupStatus === "Không hoạt động/Hết hạn",
    ),
  );
  const sortedUpcomingSubscriptions = sortSubscriptions(
    subscriptions.filter((sub) => sub.groupStatus === "Sắp mở"),
  );

  // Giới hạn hiển thị cho "Không hoạt động/Hết hạn"
  const displayedInactiveSubscriptions = sortedInactiveSubscriptions.slice(
    0,
    inactiveLimit,
  );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 md:p-8 rounded-t-xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 rounded-full scale-150 blur-3xl -translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
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
            Lịch sử gói đăng ký
          </h1>
          <p className="text-teal-100 text-sm md:text-base">
            Tổng cộng: {totalElements} gói đăng ký
          </p>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
        {/* Nút toggle sắp xếp */}
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg flex items-center gap-2 transition-all duration-200"
            onClick={toggleSortDir}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sắp xếp: {sortDir === "desc" ? "Mới nhất" : "Cũ nhất"}
          </button>
        </div>

        {/* Gói đang hoạt động */}
        {sortedActiveSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-green-500 pb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
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
            <div className="space-y-4">
              {sortedActiveSubscriptions.map((subscription) => {
                const statusDetails = getStatusDetails(
                  subscription.groupStatus,
                );

                return (
                  <div
                    key={subscription.subscriptionId}
                    className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${statusDetails.cardBg} ${statusDetails.border}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 flex items-center mb-3 md:mb-0">
                        <div
                          className={`w-12 h-12 ${statusDetails.iconBg} rounded-full flex items-center justify-center shadow-md`}
                        >
                          {statusDetails.icon}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-lg text-gray-800">
                            {subscription.planName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bgColor} ${statusDetails.textColor} flex items-center`}
                            >
                              <span
                                className={`inline-block w-2 h-2 mr-1 rounded-full ${statusDetails.dotColor}`}
                              />
                              {statusDetails.label}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 gap-1 bg-white/80 px-2 py-1 rounded-full">
                              {getPaymentIcon(subscription.paymentMethod)}
                              {subscription.paymentMethod}
                            </span>
                            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                              {formatAmount(subscription.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
                          <div
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-green-200`}
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
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-green-200`}
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gói không hoạt động/hết hạn */}
        {sortedInactiveSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-red-500 pb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Không hoạt động/Hết hạn ({sortedInactiveSubscriptions.length})
            </h2>
            <div className="space-y-4">
              {displayedInactiveSubscriptions.map((subscription) => {
                const statusDetails = getStatusDetails(
                  subscription.groupStatus,
                );

                return (
                  <div
                    key={subscription.subscriptionId}
                    className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${statusDetails.cardBg} ${statusDetails.border}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 flex items-center mb-3 md:mb-0">
                        <div
                          className={`w-12 h-12 ${statusDetails.iconBg} rounded-full flex items-center justify-center shadow-md`}
                        >
                          {statusDetails.icon}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-lg text-gray-800">
                            {subscription.planName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bgColor} ${statusDetails.textColor} flex items-center`}
                            >
                              <span
                                className={`inline-block w-2 h-2 mr-1 rounded-full ${statusDetails.dotColor}`}
                              />
                              {statusDetails.label}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 gap-1 bg-white/80 px-2 py-1 rounded-full">
                              {getPaymentIcon(subscription.paymentMethod)}
                              {subscription.paymentMethod}
                            </span>
                            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                              {formatAmount(subscription.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
                          <div
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-red-100`}
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
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-red-100`}
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
                  </div>
                );
              })}
            </div>
            {/* Nút "Xem thêm" cho "Không hoạt động/Hết hạn" */}
            {sortedInactiveSubscriptions.length > inactiveLimit && (
              <div className="mt-4 text-center">
                <Button
                  className="hover:scale-105 duration-100"
                  onClick={handleShowMoreInactive}
                >
                  Xem thêm
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Gói sắp mở (dự phòng) */}
        {sortedUpcomingSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-500"
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
            <div className="space-y-4">
              {sortedUpcomingSubscriptions.map((subscription) => {
                const statusDetails = getStatusDetails(
                  subscription.groupStatus,
                );

                return (
                  <div
                    key={subscription.subscriptionId}
                    className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${statusDetails.cardBg} ${statusDetails.border}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 flex items-center mb-3 md:mb-0">
                        <div
                          className={`w-12 h-12 ${statusDetails.iconBg} rounded-full flex items-center justify-center shadow-md`}
                        >
                          {statusDetails.icon}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-lg text-gray-800">
                            {subscription.planName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bgColor} ${statusDetails.textColor} flex items-center`}
                            >
                              <span
                                className={`inline-block w-2 h-2 mr-1 rounded-full ${statusDetails.dotColor}`}
                              />
                              {statusDetails.label}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 gap-1 bg-white/80 px-2 py-1 rounded-full">
                              {getPaymentIcon(subscription.paymentMethod)}
                              {subscription.paymentMethod}
                            </span>
                            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                              {formatAmount(subscription.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
                          <div
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-yellow-200`}
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
                            className={`${statusDetails.dateBg} px-3 py-2 rounded-lg shadow-sm flex flex-col items-center md:min-w-32 border border-yellow-200`}
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nếu không có gói nào */}
        {subscriptions.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <p className="text-gray-500 mb-4 text-lg">
              Không tìm thấy gói đăng ký nào.
            </p>
            <button
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 px-6 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
              onClick={() => fetchSubscriptionHistory(0)}
            >
              Làm mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
