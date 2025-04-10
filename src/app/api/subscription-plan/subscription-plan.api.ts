// import axiosClient from "@/lib/axiosClient";

// interface SubscriptionPlan {
//   subPlanId: number;
//   name: string;
//   price: number;
//   benefits: string;
//   durationDays: number;
//   createdAt: string;
//   active: boolean;
// }

// interface PaymentResponse {
//   success: boolean;
//   message: string;
//   data: {
//     payUrl?: string;
//     transactionId?: number;
//     orderId: string;
//     qrCodeUrl?: string;
//   };
// }

// interface SubscriptionPlanResponse {
//   success: boolean;
//   message: string;
//   data: SubscriptionPlan[] | SubscriptionPlan;
// }

// const ENDPOINT = {
//   GET_ALL_PLANS: "/subscription/all",
//   GET_PLAN_DETAIL: "/subscription/detail",
//   INITIATE_MOMO_PAYMENT: "/v1/payment/initiateMomo",
// };

// export const getAllSubscriptionPlans = async (): Promise<
//   SubscriptionPlan[]
// > => {
//   try {
//     console.log(
//       "Fetching from URL:",
//       `${axiosClient.defaults.baseURL}${ENDPOINT.GET_ALL_PLANS}`,
//     );
//     const response = await axiosClient.get(ENDPOINT.GET_ALL_PLANS, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const responseData = response.data as SubscriptionPlanResponse;

//     console.log("API Response (All Plans):", responseData);

//     if (responseData.success && Array.isArray(responseData.data)) {
//       return responseData.data;
//     }
//     throw new Error(responseData.message || "No subscription plans returned");
//   } catch (error: any) {
//     console.error("Error fetching subscription plans:", error);
//     throw error;
//   }
// };

// export const getSubscriptionPlanDetail = async (
//   subPlanId: number,
// ): Promise<SubscriptionPlan> => {
//   try {
//     const url = `${ENDPOINT.GET_PLAN_DETAIL}/${subPlanId}`;

//     console.log(
//       "Fetching plan detail from URL:",
//       `${axiosClient.defaults.baseURL}${url}`,
//     );
//     const response = await axiosClient.get(url, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const responseData = response.data as SubscriptionPlanResponse;

//     console.log("API Response (Plan Detail):", responseData);

//     if (responseData.success && !Array.isArray(responseData.data)) {
//       return responseData.data as SubscriptionPlan;
//     }
//     throw new Error(
//       responseData.message || "No subscription plan detail returned",
//     );
//   } catch (error: any) {
//     console.error("Error fetching subscription plan detail:", error);
//     throw error;
//   }
// };

// export const initiateMomoPayment = async (
//   subPlanId: number,
//   token: string,
//   successUrl: string,
//   failedUrl: string,
// ): Promise<{ payUrl: string; orderId: string }> => {
//   try {
//     const url = ENDPOINT.INITIATE_MOMO_PAYMENT;

//     // Tạo thông tin đơn hàng với subPlanId rõ ràng
//     const orderInfo = `Thanh toán SubscriptionPlan: ${subPlanId}`;

//     // Tạo extraData để lưu subPlanId làm dữ liệu phụ
//     const extraData = JSON.stringify({ subPlanId });

//     console.log(
//       "Initiating MoMo payment from URL:",
//       `${axiosClient.defaults.baseURL}${url}`,
//     );

//     const response = await axiosClient.post(
//       url,
//       {
//         subPlanId,
//         successUrl,
//         failedUrl,
//         orderInfo, // Thêm orderInfo rõ ràng
//         extraData, // Thêm extraData với subPlanId
//         customOrderId: `${subPlanId}-${Date.now()}`, // Đề xuất sử dụng customOrderId nếu API hỗ trợ
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     const responseData = response.data as PaymentResponse;

//     console.log("MoMo Payment Response:", responseData);

//     if (
//       responseData.success &&
//       responseData.data.payUrl &&
//       responseData.data.orderId
//     ) {
//       return {
//         payUrl: responseData.data.payUrl,
//         orderId: responseData.data.orderId,
//       };
//     }
//     throw new Error(
//       responseData.message || "Không thể khởi tạo thanh toán MoMo",
//     );
//   } catch (error: any) {
//     console.error("Error initiating MoMo payment:", error);
//     throw error;
//   }
// };

import axiosClient from "@/lib/axiosClient";

interface SubscriptionPlan {
  subPlanId: number;
  name: string;
  price: number;
  benefits: string;
  durationDays: number;
  createdAt: string;
  active: boolean;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payUrl?: string;
    transactionId?: number;
    orderId: string;
    qrCodeUrl?: string;
  };
}

interface SubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[] | SubscriptionPlan;
}

interface CurrentSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    planName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
}

interface RenewResponse {
  success: boolean;
  message: string;
  data: {
    external_order_id: string;
  } | null;
}

interface RenewResult {
  success: boolean;
  externalOrderId?: string;
  errorMessage?: string;
}

const ENDPOINT = {
  GET_ALL_PLANS: "/subscription/all",
  GET_PLAN_DETAIL: "/subscription/detail",
  INITIATE_MOMO_PAYMENT: "/v1/payment/initiateMomo",
  GET_CURRENT_PLAN: "/v1/subscription/current-plan",
  RENEW_SUBSCRIPTION: "/v1/subscription/renew",
};

export const getAllSubscriptionPlans = async (): Promise<
  SubscriptionPlan[]
> => {
  try {
    console.log(
      "Fetching from URL:",
      `${axiosClient.defaults.baseURL}${ENDPOINT.GET_ALL_PLANS}`,
    );
    const response = await axiosClient.get(ENDPOINT.GET_ALL_PLANS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data as SubscriptionPlanResponse;

    console.log("API Response (All Plans):", responseData);

    if (responseData.success && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    throw new Error(responseData.message || "No subscription plans returned");
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

export const getSubscriptionPlanDetail = async (
  subPlanId: number,
): Promise<SubscriptionPlan> => {
  try {
    const url = `${ENDPOINT.GET_PLAN_DETAIL}/${subPlanId}`;

    console.log(
      "Fetching plan detail from URL:",
      `${axiosClient.defaults.baseURL}${url}`,
    );
    const response = await axiosClient.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data as SubscriptionPlanResponse;

    console.log("API Response (Plan Detail):", responseData);

    if (responseData.success && !Array.isArray(responseData.data)) {
      return responseData.data as SubscriptionPlan;
    }
    throw new Error(
      responseData.message || "No subscription plan detail returned",
    );
  } catch (error: any) {
    console.error("Error fetching subscription plan detail:", error);
    throw error;
  }
};

export const initiateMomoPayment = async (
  subPlanId: number,
  token: string,
  successUrl: string,
  failedUrl: string,
): Promise<{ payUrl: string; orderId: string }> => {
  try {
    const url = ENDPOINT.INITIATE_MOMO_PAYMENT;

    const orderInfo = `Thanh toán SubscriptionPlan: ${subPlanId}`;
    const extraData = JSON.stringify({ subPlanId });

    console.log(
      "Initiating MoMo payment from URL:",
      `${axiosClient.defaults.baseURL}${url}`,
    );

    const response = await axiosClient.post(
      url,
      {
        subPlanId,
        successUrl,
        failedUrl,
        orderInfo,
        extraData,
        customOrderId: `${subPlanId}-${Date.now()}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = response.data as PaymentResponse;

    console.log("MoMo Payment Response:", responseData);

    if (
      responseData.success &&
      responseData.data.payUrl &&
      responseData.data.orderId
    ) {
      return {
        payUrl: responseData.data.payUrl,
        orderId: responseData.data.orderId,
      };
    }
    throw new Error(
      responseData.message || "Không thể khởi tạo thanh toán MoMo",
    );
  } catch (error: any) {
    console.error("Error initiating MoMo payment:", error);
    throw error;
  }
};

export const getCurrentSubscription = async (
  token: string,
): Promise<CurrentSubscriptionResponse["data"]> => {
  try {
    console.log(
      "Fetching current subscription from URL:",
      `${axiosClient.defaults.baseURL}${ENDPOINT.GET_CURRENT_PLAN}`,
    );
    const response = await axiosClient.get(ENDPOINT.GET_CURRENT_PLAN, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data as CurrentSubscriptionResponse;

    console.log("API Response (Current Subscription):", responseData);

    if (responseData.success) {
      return responseData.data;
    }
    throw new Error(
      responseData.message || "Không thể lấy thông tin gói hiện tại",
    );
  } catch (error: any) {
    console.error("Error fetching current subscription:", error);
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const renewSubscription = async (
  subPlanId: number,
  token: string,
): Promise<RenewResult> => {
  try {
    const url = ENDPOINT.RENEW_SUBSCRIPTION;

    const orderInfo = `Gia hạn SubscriptionPlan: ${subPlanId}`;
    const extraData = JSON.stringify({ subPlanId });
    const customOrderId = `${subPlanId}-${Date.now()}`;

    console.log(
      "Renewing subscription from URL:",
      `${axiosClient.defaults.baseURL}${url}`,
    );
    console.log("Request body:", {
      subPlanId,
      orderInfo,
      extraData,
      customOrderId,
    });

    const response = await axiosClient.post(
      url,
      {
        subPlanId,
        orderInfo,
        extraData,
        customOrderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = response.data as RenewResponse;

    console.log("Renew Subscription Response:", responseData);

    if (responseData.success && responseData.data?.external_order_id) {
      return {
        success: true,
        externalOrderId: responseData.data.external_order_id,
      };
    }

    return {
      success: false,
      errorMessage: responseData.message || "Không thể gia hạn gói đăng ký",
    };
  } catch (error: any) {
    console.error("Error renewing subscription:", error);
    console.error("Response data (if available):", error.response?.data);
    const responseData = error.response?.data as RenewResponse;

    return {
      success: false,
      errorMessage:
        responseData?.message || "Lỗi hệ thống khi gia hạn. Vui lòng thử lại.",
    };
  }
};
