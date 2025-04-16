// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Bell, DollarSign, MessageSquareQuote } from "lucide-react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { getAllSubscriptionPlans } from "@/app/api/subscription-plan/subscription-plan.api";

// interface SubscriptionPlan {
//   subPlanId: number;
//   name: string;
//   price: number;
//   benefits: string;
//   durationDays: number;
//   createdAt: string;
//   active: boolean;
// }

// const LoadingAnimation = () => {
//   return (
//     <div className="flex flex-col items-center">
//       <DotLottieReact
//         autoplay
//         loop
//         className="w-40 h-40"
//         src="https://lottie.host/97ffb958-051a-433c-a566-93823aa8e607/M01cGPZdd3.lottie"
//       />
//       <p className="text-gray-500 mt-2 animate-pulse">Đang tải dữ liệu...</p>
//     </div>
//   );
// };

// export const SubcriptionPlanModule = () => {
//   const router = useRouter();
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setLoading(true);
//         const subscriptionPlans = await getAllSubscriptionPlans();

//         console.log("Fetched subscription plans:", subscriptionPlans);
//         setPlans(subscriptionPlans);
//       } catch (err: any) {
//         console.error("Failed to fetch plans:", err);
//         setError(err.message || "Không thể tải danh sách gói đăng ký");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   const activePlans = plans.filter((plan) => plan.active);

//   const getFormattedDate = (daysToAdd: number): string => {
//     const date = new Date();

//     date.setDate(date.getDate() + daysToAdd);

//     return `${date.getDate()} thg ${date.getMonth() + 1}`;
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const handleSubscribe = (subPlanId: number) => {
//     const lastOrderId = localStorage.getItem("lastOrderId"); // Lấy orderId từ localStorage nếu có
//     const redirectPath = lastOrderId
//       ? `/subscription-plan/${subPlanId}?orderId=${lastOrderId}`
//       : `/subscription-plan/${subPlanId}`;

//     console.log("Navigating to:", redirectPath); // Debug
//     router.push(redirectPath);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 bg-[#0b0b23] text-white">
//         <LoadingAnimation />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 bg-[#0b0b23] text-white">
//         <svg
//           className="w-16 h-16 text-red-400 mb-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//           />
//         </svg>
//         <p className="text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#0b0b23] text-white py-16 px-4 text-center rounded-lg min-h-screen">
//       <h2 className="text-3xl font-bold">TECHNIHONGO</h2>
//       <p className="text-lg mt-2">
//         Đạt điểm cao hơn với nền tảng học tiếng Nhật chuyên ngành số 1 FPT
//       </p>
//       <div className="flex flex-wrap justify-center gap-6 mt-10">
//         {activePlans.map((plan) => (
//           <Card key={plan.subPlanId} className="bg-white text-black p-6 w-72">
//             <h3 className="text-xl font-bold">{plan.name}</h3>
//             <p className="text-gray-600 mt-2">
//               Duration: {plan.durationDays} days
//             </p>
//             <p className="text-2xl font-bold mt-2">{formatPrice(plan.price)}</p>
//             <Button
//               className="bg-blue-500 text-white mt-4 w-full"
//               onClick={() => handleSubscribe(plan.subPlanId)}
//             >
//               Subscribe
//             </Button>
//           </Card>
//         ))}
//       </div>
//       <div className="mt-16" />
//       <div className="text-center mb-4">
//         <h3 className="text-2xl font-bold mb-2">
//           Cách hoạt động của các gói Premium TechNihongo*
//         </h3>
//         <p className="text-sm text-gray-400">
//           *Gói dịch vụ hàng tháng không có dùng thử miễn phí
//         </p>
//       </div>
//       <div className="relative mt-12">
//         <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700" />
//         <div className="flex justify-between relative">
//           <div className="relative flex flex-col items-center w-1/3">
//             <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
//               <MessageSquareQuote className="w-8 h-8 text-yellow-400" />
//             </div>
//             <h4 className="text-sm font-bold mb-2">
//               Hôm nay: Truy cập tức thì
//             </h4>
//             <p className="text-xs text-gray-400 text-center">
//               Truy cập những nội dung dùng thử Premium khi bạn đăng ký sử dụng
//               một gói dịch vụ hàng năm.
//             </p>
//           </div>
//           <div className="relative flex flex-col items-center w-1/3">
//             <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
//               <Bell className="w-8 h-8 text-yellow-400" />
//             </div>
//             <h4 className="text-sm font-bold mb-2">
//               {getFormattedDate(7)}: Lời nhắc – thời gian dùng thử của bạn sắp
//               kết thúc
//             </h4>
//             <p className="text-xs text-gray-400 text-center">
//               Bạn sẽ nhận được một email. Hủy bất cứ lúc nào trước ngày gia hạn
//               để tránh bị tính phí.
//             </p>
//           </div>
//           <div className="relative flex flex-col items-center w-1/3">
//             <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
//               <DollarSign className="w-8 h-8 text-yellow-400" />
//             </div>
//             <h4 className="text-sm font-bold mb-2">
//               {getFormattedDate(10)}: Thời gian dùng thử kết thúc và gói dịch vụ
//               hàng năm bắt đầu
//             </h4>
//             <p className="text-xs text-gray-400 text-center">
//               Bạn sẽ được tự động tính phí cho một năm dịch vụ và những năm tiếp
//               theo trừ khi bạn hủy.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, DollarSign, MessageSquareQuote } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllSubscriptionPlans,
  getCurrentSubscription,
} from "@/app/api/subscription-plan/subscription-plan.api";

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
          const currentSub = await getCurrentSubscription(session.user.token);

          setCurrentSubscription(currentSub);
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

  const getFormattedDate = (daysToAdd: number): string => {
    const date = new Date();

    date.setDate(date.getDate() + daysToAdd);

    return `${date.getDate()} thg ${date.getMonth() + 1}`;
  };

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
    return (
      <div className="flex justify-center items-center h-64 bg-[#0b0b23] text-white">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-[#0b0b23] text-white">
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
          className="mt-4"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b23] text-white py-16 px-4 text-center rounded-lg min-h-screen">
      <h2 className="text-3xl font-bold">TECHNIHONGO</h2>
      <p className="text-lg mt-2">
        Đạt điểm cao hơn với nền tảng học tiếng Nhật chuyên ngành số 1 FPT
      </p>
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {activePlans.map((plan) => (
          <Card key={plan.subPlanId} className="bg-white text-black p-6 w-72">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-gray-600 mt-2">
              Duration: {plan.durationDays} days
            </p>
            <p className="text-2xl font-bold mt-2">{formatPrice(plan.price)}</p>
            <Button
              className="bg-blue-500 text-white mt-4 w-full"
              onClick={() => handleSubscribe(plan.subPlanId)}
            >
              {currentSubscription?.isActive ? "Gia hạn" : "Subscribe"}
            </Button>
          </Card>
        ))}
      </div>
      <div className="mt-16" />
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-2">
          Cách hoạt động của các gói Premium TechNihongo*
        </h3>
        <p className="text-sm text-gray-400">
          *Gói dịch vụ hàng tháng không có dùng thử miễn phí
        </p>
      </div>
      <div className="relative mt-12">
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700" />
        <div className="flex justify-between relative">
          <div className="relative flex flex-col items-center w-1/3">
            <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
              <MessageSquareQuote className="w-8 h-8 text-yellow-400" />
            </div>
            <h4 className="text-sm font-bold mb-2">
              Hôm nay: Truy cập tức thì
            </h4>
            <p className="text-xs text-gray-400 text-center">
              Truy cập những nội dung dùng thử Premium khi bạn đăng ký sử dụng
              một gói dịch vụ hàng năm.
            </p>
          </div>
          <div className="relative flex flex-col items-center w-1/3">
            <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
              <Bell className="w-8 h-8 text-yellow-400" />
            </div>
            <h4 className="text-sm font-bold mb-2">
              {getFormattedDate(7)}: Lời nhắc – thời gian dùng thử của bạn sắp
              kết thúc
            </h4>
            <p className="text-xs text-gray-400 text-center">
              Bạn sẽ nhận được một email. Hủy bất cứ lúc nào trước ngày gia hạn
              để tránh bị tính phí.
            </p>
          </div>
          <div className="relative flex flex-col items-center w-1/3">
            <div className="bg-gray-800 p-3 rounded-full z-10 mb-4">
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <h4 className="text-sm font-bold mb-2">
              {getFormattedDate(10)}: Thời gian dùng thử kết thúc và gói dịch vụ
              hàng năm bắt đầu
            </h4>
            <p className="text-xs text-gray-400 text-center">
              Bạn sẽ được tự động tính phí cho một năm dịch vụ và những năm tiếp
              theo trừ khi bạn hủy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
