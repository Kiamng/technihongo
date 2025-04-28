"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, DollarSign, MessageSquareQuote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllSubscriptionPlans,
  getCurrentSubscription,
} from "@/app/api/subscription-plan/subscription-plan.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";

export const SubscriptionPlanModule = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const subscriptionPlans = await getAllSubscriptionPlans();

        console.log("Fetched subscription plans:", subscriptionPlans);
        setPlans(subscriptionPlans);

        if (session?.user?.token) {
          // Don't wrap this in try/catch as we're handling 404 inside getCurrentSubscription
          const currentSub = await getCurrentSubscription(session.user.token);

          setCurrentSubscription(currentSub); // This can be null, which is fine
        }
      } catch (err: any) {
        console.error("Failed to fetch plans:", err);
        if (err.response?.status === 500) {
          setError("Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.");
        } else {
          setError(err.message || "Không thể tải danh sách gói đăng ký");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [session?.user.token]);
  const activePlans = plans.filter((plan) => plan.active);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubscribe = (subPlanId: number) => {
    const lastOrderId = localStorage.getItem("lastOrderId");
    const redirectPath = lastOrderId
      ? `/subscription-plan/${subPlanId}?orderId=${lastOrderId}`
      : `/subscription-plan/${subPlanId}`;

    console.log("Navigating to:", redirectPath);
    router.push(redirectPath);
  };

  if (loading || status === "loading") {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
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
        <p className="text-lg">{error}</p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all text-white"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 py-16 px-4 text-center min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-green-700">
            TECHNIHONGO
          </h2>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            Đạt điểm cao hơn với nền tảng học tiếng Nhật chuyên ngành số 1 FPT
          </p>
        </div>

        {/* Plans section */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 mb-20">
          {activePlans.map((plan) => (
            <Card
              key={plan.subPlanId}
              className="relative p-0 w-80 rounded-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="p-6 bg-white text-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600">
                  Thời hạn:{" "}
                  <span className="font-semibold">
                    {plan.durationDays} ngày
                  </span>
                </p>

                <div className="mt-4 mb-6">
                  <p className="text-3xl font-bold text-gray-800">
                    {formatPrice(plan.price)}
                  </p>
                </div>

                <Button
                  className="w-full py-6 font-bold text-white transition-all bg-[#56D071] hover:bg-[#4ab861]"
                  onClick={() => handleSubscribe(plan.subPlanId)}
                >
                  {currentSubscription?.isActive
                    ? "Gia hạn ngay"
                    : "Đăng ký ngay"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits section */}
        <div className="max-w-4xl mx-auto mt-20 mb-16">
          <h3 className="text-2xl font-bold mb-8 text-gray-800">
            Quy trình đăng ký Premium TechNihongo
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl text-center transition-transform hover:scale-105 border border-gray-100 shadow-sm">
              <div className="bg-[#56D071] h-14 w-14 flex items-center justify-center rounded-full mx-auto mb-4">
                <MessageSquareQuote className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-gray-800">
                Đăng ký tài khoản
              </h4>
              <p className="text-sm text-gray-600">
                Tạo tài khoản TechNihongo và khám phá các tính năng cơ bản hoàn
                toàn miễn phí.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center transition-transform hover:scale-105 border border-gray-100 shadow-sm">
              <div className="bg-[#56D071] h-14 w-14 flex items-center justify-center rounded-full mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-gray-800">
                Chọn gói phù hợp
              </h4>
              <p className="text-sm text-gray-600">
                Lựa chọn gói premium phù hợp với nhu cầu học tập và phát triển
                của bạn.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center transition-transform hover:scale-105 border border-gray-100 shadow-sm">
              <div className="bg-[#56D071] h-14 w-14 flex items-center justify-center rounded-full mx-auto mb-4">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-gray-800">
                Trải nghiệm cao cấp
              </h4>
              <p className="text-sm text-gray-600">
                Truy cập tức thì vào tất cả các tính năng premium và bắt đầu
                hành trình học tiếng Nhật.
              </p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="max-w-4xl mx-auto mt-16 mb-10">
          <div className="bg-[#56D071] rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Sẵn sàng để nâng cao kỹ năng tiếng Nhật của bạn?
            </h3>
            <p className="mb-6 text-white">
              Đăng ký ngay hôm nay và bắt đầu hành trình chinh phục tiếng Nhật
              chuyên ngành cùng TechNihongo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
