// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import { Clock, Check, AlertCircle, CreditCard } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import {
//   getCurrentSubscription,
//   getSubscriptionPlanDetail,
//   initiateMomoPayment,
//   initiateVNPayPayment,
//   renewVNPayPayment,
// } from "@/app/api/subscription-plan/subscription-plan.api";

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

// const SubscriptionPlanDetail: React.FC = () => {
//   const params = useParams();
//   const router = useRouter();
//   const subPlanId = Number(params.subPlanId);
//   const { data: session, status } = useSession();
//   const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
//   const [currentSubscription, setCurrentSubscription] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [renewalError, setRenewalError] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState<boolean>(false);
//   const [paymentMethod, setPaymentMethod] = useState<
//     "momo" | "vnpay" | "vnpay-renew" | null
//   >(null);
//   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

//   const primaryColor = "#57D061";
//   const backendBaseUrl = "http://localhost:8080";

//   useEffect(() => {
//     const fetchPlanDetail = async () => {
//       if (!subPlanId || isNaN(subPlanId)) {
//         setError("ID gói đăng ký không hợp lệ");
//         setLoading(false);

//         return;
//       }

//       try {
//         setLoading(true);
//         const planDetail = await getSubscriptionPlanDetail(subPlanId);

//         setPlan(planDetail);

//         if (session?.user?.token) {
//           const currentSub = await getCurrentSubscription(session.user.token);

//           setCurrentSubscription(currentSub);
//         }
//       } catch (err: any) {
//         console.error("Failed to fetch plan detail:", err);
//         if (err.response?.status === 500) {
//           setError("Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.");
//         } else {
//           setError(err.message || "Không thể tải chi tiết gói đăng ký");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlanDetail();
//   }, [subPlanId, session]);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("vi-VN");
//   };

//   const handlePaymentSelection = async () => {
//     if (!paymentMethod) {
//       setError("Vui lòng chọn phương thức thanh toán");

//       return;
//     }

//     if (
//       !subPlanId ||
//       !plan?.active ||
//       status !== "authenticated" ||
//       !session?.user?.token
//     ) {
//       setError("Vui lòng đăng nhập để thực hiện thanh toán");

//       return;
//     }

//     setProcessingPayment(true);
//     setRenewalError(null);

//     try {
//       const successUrl = `${backendBaseUrl}/api/v1/payment/success`;
//       const failedUrl = `${backendBaseUrl}/api/v1/payment/failed`;
//       let paymentResult;

//       if (currentSubscription?.isActive && paymentMethod === "vnpay-renew") {
//         // VNPay renewal
//         console.log("Initiating VNPay renewal payment...");
//         paymentResult = await renewVNPayPayment(
//           subPlanId,
//           session.user.token,
//           successUrl,
//           failedUrl,
//         );
//         console.log("VNPay renewal payment result:", paymentResult);
//       } else if (!currentSubscription?.isActive) {
//         // New payment
//         if (paymentMethod === "momo") {
//           console.log("Initiating MoMo payment...");
//           paymentResult = await initiateMomoPayment(
//             subPlanId,
//             session.user.token,
//             successUrl,
//             failedUrl,
//           );
//           console.log("MoMo payment result:", paymentResult);
//         } else if (paymentMethod === "vnpay") {
//           console.log("Initiating VNPay payment...");
//           paymentResult = await initiateVNPayPayment(
//             subPlanId,
//             session.user.token,
//             successUrl,
//             failedUrl,
//           );
//           console.log("VNPay payment result:", paymentResult);
//         }
//       }

//       if (!paymentResult || !paymentResult.payUrl) {
//         throw new Error("Không nhận được URL thanh toán hợp lệ");
//       }

//       console.log("Redirecting to payment URL:", paymentResult.payUrl);

//       // Lưu orderId nếu có
//       if (paymentResult.orderId) {
//         localStorage.setItem("lastOrderId", paymentResult.orderId);
//       }

//       // Chuyển hướng người dùng đến trang thanh toán
//       window.location.href = paymentResult.payUrl;
//     } catch (err: any) {
//       console.error("Payment processing failed:", err);
//       setError(err.message || "Không thể khởi tạo thanh toán");
//       setProcessingPayment(false);
//       setIsPaymentDialogOpen(false);

//       // Thông báo lỗi nhưng không chuyển hướng đến trang failed
//       // Nếu muốn chuyển hướng khi có lỗi, bỏ comment dòng dưới
//       // router.push("/payment/failed");
//     } finally {
//       // Đảm bảo trạng thái processing được reset nếu có lỗi xảy ra
//       if (processingPayment) {
//         setProcessingPayment(false);
//       }
//     }
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingAnimation />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
//         <p className="text-lg text-red-500 font-medium">{error}</p>
//         <Button
//           className="mt-4"
//           variant="outline"
//           onClick={() => {
//             setError(null);
//             window.location.reload();
//           }}
//         >
//           Thử lại
//         </Button>
//       </div>
//     );
//   }

//   if (!plan) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
//         <p className="text-lg text-amber-500 font-medium">
//           Không tìm thấy thông tin gói đăng ký
//         </p>
//         <Button
//           className="mt-4"
//           variant="outline"
//           onClick={() => window.history.back()}
//         >
//           Quay lại
//         </Button>
//       </div>
//     );
//   }

//   const benefitsList = plan.benefits.split(". ").filter((b) => b.trim() !== "");

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Chi tiết gói đăng ký
//       </h1>
//       <Card className="bg-white shadow-lg border-2 border-green-100 overflow-hidden">
//         <div
//           className="flex justify-between items-center"
//           style={{
//             background: `linear-gradient(to right, ${primaryColor}, #3BB344)`,
//           }}
//         >
//           <h2 className="text-2xl font-bold text-white px-4 py-2">
//             {plan.name}
//           </h2>
//           <Badge
//             className="px-3 py-1 text-xs font-medium text-white mr-4"
//             style={{
//               backgroundColor: plan.active ? "#2EA835" : "#A8A8A8",
//             }}
//           >
//             {plan.active ? "Hoạt động" : "Không hoạt động"}
//           </Badge>
//         </div>

//         <CardHeader className="bg-green-50 pb-0">
//           <div className="flex justify-center">
//             <div className="text-center">
//               <p className="text-sm text-gray-500 mb-1">Giá gói đăng ký</p>
//               <p className="text-4xl font-bold" style={{ color: primaryColor }}>
//                 {formatPrice(plan.price)}
//               </p>
//               <div className="flex items-center justify-center mt-2 text-gray-600">
//                 <Clock className="w-4 h-4 mr-1" />
//                 <span>{plan.durationDays} ngày</span>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="pt-6">
//           {currentSubscription?.isActive && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//               <h3 className="font-semibold text-lg mb-2">
//                 Gói hiện tại của bạn
//               </h3>
//               <p>Tên gói: {currentSubscription.planName}</p>
//               <p>Ngày bắt đầu: {formatDate(currentSubscription.startDate)}</p>
//               <p>Ngày kết thúc: {formatDate(currentSubscription.endDate)}</p>
//               <p>Trạng thái: Đang hoạt động</p>
//             </div>
//           )}
//           {renewalError && (
//             <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
//               <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
//               <p className="text-red-500">{renewalError}</p>
//             </div>
//           )}
//           <div className="space-y-6">
//             <div>
//               <h3 className="font-semibold text-lg mb-3 text-gray-700">
//                 Quyền lợi của bạn:
//               </h3>
//               <ul className="space-y-2">
//                 {benefitsList.map((benefit, index) => (
//                   <li key={index} className="flex items-start">
//                     <Check
//                       className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
//                       style={{ color: primaryColor }}
//                     />
//                     <span>{benefit}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </CardContent>

//         <CardFooter className="bg-gray-50 flex justify-center py-6">
//           <Dialog
//             open={isPaymentDialogOpen}
//             onOpenChange={setIsPaymentDialogOpen}
//           >
//             <DialogTrigger asChild>
//               <Button
//                 className="text-white font-medium px-8 py-6 rounded-lg shadow-md transition-all flex items-center hover:bg-green-600"
//                 disabled={
//                   processingPayment ||
//                   !plan.active ||
//                   status !== "authenticated"
//                 }
//                 style={{
//                   backgroundColor: primaryColor,
//                 }}
//               >
//                 <CreditCard className="mr-2" />
//                 <span>
//                   {currentSubscription?.isActive
//                     ? "Gia hạn ngay"
//                     : "Thanh toán ngay"}
//                 </span>
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
//               </DialogHeader>
//               <RadioGroup
//                 className="space-y-4"
//                 value={paymentMethod || ""}
//                 onValueChange={(value: "momo" | "vnpay" | "vnpay-renew") =>
//                   setPaymentMethod(value)
//                 }
//               >
//                 {!currentSubscription?.isActive && (
//                   <>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem id="momo" value="momo" />
//                       <Label htmlFor="momo">Thanh toán bằng MoMo</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem id="vnpay" value="vnpay" />
//                       <Label htmlFor="vnpay">Thanh toán bằng VNPay</Label>
//                     </div>
//                   </>
//                 )}
//                 {currentSubscription?.isActive && (
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem id="vnpay-renew" value="vnpay-renew" />
//                     <Label htmlFor="vnpay-renew">Gia hạn bằng VNPay</Label>
//                   </div>
//                 )}
//               </RadioGroup>
//               <div className="flex justify-end space-x-2 mt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsPaymentDialogOpen(false)}
//                 >
//                   Hủy
//                 </Button>
//                 <Button
//                   disabled={!paymentMethod || processingPayment}
//                   onClick={handlePaymentSelection}
//                 >
//                   {processingPayment ? "Đang xử lý..." : "Xác nhận"}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>

//       <div className="mt-6 text-center">
//         <Button
//           className="text-gray-600 border-green-200 hover:bg-green-50"
//           variant="outline"
//           onClick={() => window.history.back()}
//         >
//           Quay lại danh sách
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlanDetail;

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Clock, Check, AlertCircle, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  getCurrentSubscription,
  getSubscriptionPlanDetail,
  initiateMomoPayment,
  initiateVNPayPayment,
  renewVNPayPayment,
  renewSubscription,
} from "@/app/api/subscription-plan/subscription-plan.api";

interface SubscriptionPlan {
  subPlanId: number;
  name: string;
  price: number;
  benefits: string;
  durationDays: number;
  createdAt: string;
  active: boolean;
}

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

const SubscriptionPlanDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const subPlanId = Number(params.subPlanId);
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [renewalError, setRenewalError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "momo" | "vnpay" | "momo-renew" | "vnpay-renew" | null
  >(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const primaryColor = "#57D061";
  const backendBaseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchPlanDetail = async () => {
      if (!subPlanId || isNaN(subPlanId)) {
        setError("ID gói đăng ký không hợp lệ");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        const planDetail = await getSubscriptionPlanDetail(subPlanId);

        setPlan(planDetail);

        if (session?.user?.token) {
          const currentSub = await getCurrentSubscription(session.user.token);

          setCurrentSubscription(currentSub);
        }
      } catch (err: any) {
        console.error("Failed to fetch plan detail:", err);
        if (err.response?.status === 500) {
          setError("Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.");
        } else {
          setError(err.message || "Không thể tải chi tiết gói đăng ký");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetail();
  }, [subPlanId, session?.user.token]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handlePaymentSelection = async () => {
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");

      return;
    }

    if (
      !subPlanId ||
      !plan?.active ||
      status !== "authenticated" ||
      !session?.user?.token
    ) {
      setError("Vui lòng đăng nhập để thực hiện thanh toán");

      return;
    }

    setProcessingPayment(true);
    setRenewalError(null);

    try {
      const successUrl = `${backendBaseUrl}/api/v1/payment/success`;
      const failedUrl = `${backendBaseUrl}/api/v1/payment/failed`;
      let paymentResult: any;

      if (currentSubscription?.isActive) {
        // Handle renewal payments
        if (paymentMethod === "vnpay-renew") {
          console.log("Initiating VNPay renewal payment...");
          paymentResult = await renewVNPayPayment(
            subPlanId,
            session.user.token,
            successUrl,
            failedUrl,
          );
          console.log("VNPay renewal payment result:", paymentResult);
        } else if (paymentMethod === "momo-renew") {
          console.log("Initiating MoMo renewal payment...");
          paymentResult = await renewSubscription(
            subPlanId,
            session.user.token,
            "momo",
            successUrl,
            failedUrl,
          );
          console.log("MoMo renewal payment result:", paymentResult);
        }
      } else {
        // Handle new payments
        if (paymentMethod === "momo") {
          console.log("Initiating MoMo payment...");
          paymentResult = await initiateMomoPayment(
            subPlanId,
            session.user.token,
            successUrl,
            failedUrl,
          );
          console.log("MoMo payment result:", paymentResult);
        } else if (paymentMethod === "vnpay") {
          console.log("Initiating VNPay payment...");
          paymentResult = await initiateVNPayPayment(
            subPlanId,
            session.user.token,
            successUrl,
            failedUrl,
          );
          console.log("VNPay payment result:", paymentResult);
        }
      }

      if (
        !paymentResult ||
        (!paymentResult.payUrl && !paymentResult.externalOrderId)
      ) {
        throw new Error("Không nhận được thông tin thanh toán hợp lệ");
      }

      // Handle cases where we get a payment URL (redirect flow)
      if (paymentResult.payUrl) {
        console.log("Redirecting to payment URL:", paymentResult.payUrl);

        // Lưu orderId nếu có
        if (paymentResult.orderId) {
          localStorage.setItem("lastOrderId", paymentResult.orderId);
        }

        // Chuyển hướng người dùng đến trang thanh toán
        window.location.href = paymentResult.payUrl;

        return;
      }

      // Handle direct renewal success (no redirect needed)
      if (paymentResult.externalOrderId) {
        console.log(
          "Renewal completed with order ID:",
          paymentResult.externalOrderId,
        );
        localStorage.setItem("lastOrderId", paymentResult.externalOrderId);

        // Redirect to success page or handle in-place
        router.push(
          "/payment/success?orderId=" + paymentResult.externalOrderId,
        );

        return;
      }
    } catch (err: any) {
      console.error("Payment processing failed:", err);
      setError(err.message || "Không thể khởi tạo thanh toán");
      setProcessingPayment(false);
      setIsPaymentDialogOpen(false);

      // Thông báo lỗi nhưng không chuyển hướng đến trang failed
      // Nếu muốn chuyển hướng khi có lỗi, bỏ comment dòng dưới
      // router.push("/payment/failed");
    } finally {
      // Đảm bảo trạng thái processing được reset nếu có lỗi xảy ra
      if (processingPayment) {
        setProcessingPayment(false);
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg text-red-500 font-medium">{error}</p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <p className="text-lg text-amber-500 font-medium">
          Không tìm thấy thông tin gói đăng ký
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const benefitsList = plan.benefits.split(". ").filter((b) => b.trim() !== "");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Chi tiết gói đăng ký
      </h1>
      <Card className="bg-white shadow-lg border-2 border-green-100 overflow-hidden">
        <div
          className="flex justify-between items-center"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, #3BB344)`,
          }}
        >
          <h2 className="text-2xl font-bold text-white px-4 py-2">
            {plan.name}
          </h2>
          <Badge
            className="px-3 py-1 text-xs font-medium text-white mr-4"
            style={{
              backgroundColor: plan.active ? "#2EA835" : "#A8A8A8",
            }}
          >
            {plan.active ? "Hoạt động" : "Không hoạt động"}
          </Badge>
        </div>

        <CardHeader className="bg-green-50 pb-0">
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Giá gói đăng ký</p>
              <p className="text-4xl font-bold" style={{ color: primaryColor }}>
                {formatPrice(plan.price)}
              </p>
              <div className="flex items-center justify-center mt-2 text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{plan.durationDays} ngày</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {currentSubscription?.isActive && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Gói hiện tại của bạn
              </h3>
              <p>Tên gói: {currentSubscription.planName}</p>
              <p>Ngày bắt đầu: {formatDate(currentSubscription.startDate)}</p>
              <p>Ngày kết thúc: {formatDate(currentSubscription.endDate)}</p>
              <p>Trạng thái: Đang hoạt động</p>
            </div>
          )}
          {renewalError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-500">{renewalError}</p>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700">
                Quyền lợi của bạn:
              </h3>
              <ul className="space-y-2">
                {benefitsList.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: primaryColor }}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 flex justify-center py-6">
          <Dialog
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="text-white font-medium px-8 py-6 rounded-lg shadow-md transition-all flex items-center hover:bg-green-600"
                disabled={
                  processingPayment ||
                  !plan.active ||
                  status !== "authenticated"
                }
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <CreditCard className="mr-2" />
                <span>
                  {currentSubscription?.isActive
                    ? "Gia hạn ngay"
                    : "Thanh toán ngay"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
              </DialogHeader>
              <RadioGroup
                className="space-y-4"
                value={paymentMethod || ""}
                onValueChange={(
                  value: "momo" | "vnpay" | "vnpay-renew" | "momo-renew",
                ) => setPaymentMethod(value)}
              >
                {!currentSubscription?.isActive && (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="momo" value="momo" />
                      <Label htmlFor="momo">Thanh toán bằng MoMo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="vnpay" value="vnpay" />
                      <Label htmlFor="vnpay">Thanh toán bằng VNPay</Label>
                    </div>
                  </>
                )}
                {currentSubscription?.isActive && (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="vnpay-renew" value="vnpay-renew" />
                      <Label htmlFor="vnpay-renew">Gia hạn bằng VNPay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="momo-renew" value="momo-renew" />
                      <Label htmlFor="momo-renew">Gia hạn bằng MoMo</Label>
                    </div>
                  </>
                )}
              </RadioGroup>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  disabled={!paymentMethod || processingPayment}
                  onClick={handlePaymentSelection}
                >
                  {processingPayment ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <Button
          className="text-gray-600 border-green-200 hover:bg-green-50"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Quay lại danh sách
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlanDetail;
