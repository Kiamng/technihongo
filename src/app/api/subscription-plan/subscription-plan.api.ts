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

// interface CurrentSubscriptionResponse {
//   success: boolean;
//   message: string;
//   data: {
//     planName: string;
//     startDate: string;
//     endDate: string;
//     isActive: boolean;
//   } | null;
// }

// interface RenewResponse {
//   success: boolean;
//   message: string;
//   data: {
//     external_order_id: string;
//   } | null;
// }

// interface RenewResult {
//   success: boolean;
//   externalOrderId?: string;
//   errorMessage?: string;
// }

// const ENDPOINT = {
//   GET_ALL_PLANS: "/subscription/all",
//   GET_PLAN_DETAIL: "/subscription/detail",
//   INITIATE_MOMO_PAYMENT: "/v1/payment/initiateMomo",
//   GET_CURRENT_PLAN: "/v1/subscription/current-plan",
//   RENEW_SUBSCRIPTION: "/v1/subscription/renew",
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

//     const orderInfo = `Thanh toán SubscriptionPlan: ${subPlanId}`;
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
//         orderInfo,
//         extraData,
//         customOrderId: `${subPlanId}-${Date.now()}`,
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

// export const getCurrentSubscription = async (
//   token: string,
// ): Promise<CurrentSubscriptionResponse["data"]> => {
//   try {
//     console.log(
//       "Fetching current subscription from URL:",
//       `${axiosClient.defaults.baseURL}${ENDPOINT.GET_CURRENT_PLAN}`,
//     );
//     const response = await axiosClient.get(ENDPOINT.GET_CURRENT_PLAN, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const responseData = response.data as CurrentSubscriptionResponse;

//     console.log("API Response (Current Subscription):", responseData);

//     if (responseData.success) {
//       return responseData.data;
//     }
//     throw new Error(
//       responseData.message || "Không thể lấy thông tin gói hiện tại",
//     );
//   } catch (error: any) {
//     console.error("Error fetching current subscription:", error);
//     if (error.response?.status === 404) return null;
//     throw error;
//   }
// };

// export const renewSubscription = async (
//   subPlanId: number,
//   token: string,
// ): Promise<RenewResult> => {
//   try {
//     const url = ENDPOINT.RENEW_SUBSCRIPTION;

//     const orderInfo = `Gia hạn SubscriptionPlan: ${subPlanId}`;
//     const extraData = JSON.stringify({ subPlanId });
//     const customOrderId = `${subPlanId}-${Date.now()}`;

//     console.log(
//       "Renewing subscription from URL:",
//       `${axiosClient.defaults.baseURL}${url}`,
//     );
//     console.log("Request body:", {
//       subPlanId,
//       orderInfo,
//       extraData,
//       customOrderId,
//     });

//     const response = await axiosClient.post(
//       url,
//       {
//         subPlanId,
//         orderInfo,
//         extraData,
//         customOrderId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     const responseData = response.data as RenewResponse;

//     console.log("Renew Subscription Response:", responseData);

//     if (responseData.success && responseData.data?.external_order_id) {
//       return {
//         success: true,
//         externalOrderId: responseData.data.external_order_id,
//       };
//     }

//     return {
//       success: false,
//       errorMessage: responseData.message || "Không thể gia hạn gói đăng ký",
//     };
//   } catch (error: any) {
//     console.error("Error renewing subscription:", error);
//     console.error("Response data (if available):", error.response?.data);
//     const responseData = error.response?.data as RenewResponse;

//     return {
//       success: false,
//       errorMessage:
//         responseData?.message || "Lỗi hệ thống khi gia hạn. Vui lòng thử lại.",
//     };
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
    orderId?: string;
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
    external_order_id?: string;
    payUrl?: string;
    transactionId?: number;
    orderId?: string;
  } | null;
}

interface RenewResult {
  success: boolean;
  externalOrderId?: string;
  payUrl?: string;
  orderId?: string;
  errorMessage?: string;
}

const ENDPOINT = {
  GET_ALL_PLANS: "/subscription/all",
  GET_PLAN_DETAIL: "/subscription/detail",
  INITIATE_MOMO_PAYMENT: "/v1/payment/initiateMomo",
  INITIATE_VNPAY_PAYMENT: "/v1/payment/initiateVNPay",
  RENEW_VNPAY_PAYMENT: "/v1/payment/renewVNPay",
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

export const initiateVNPayPayment = async (
  subPlanId: number,
  token: string,
  successUrl: string,
  failedUrl: string,
): Promise<{ payUrl: string; orderId: string }> => {
  try {
    const url = ENDPOINT.INITIATE_VNPAY_PAYMENT;
    const orderInfo = `Thanh toán SubscriptionPlan: ${subPlanId}`;
    const extraData = JSON.stringify({ subPlanId });

    console.log(
      "Initiating VNPay payment from URL:",
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

    console.log("VNPay Payment Response:", responseData);

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
      responseData.message || "Không thể khởi tạo thanh toán VNPay",
    );
  } catch (error: any) {
    console.error("Error initiating VNPay payment:", error);
    throw error;
  }
};

export const renewVNPayPayment = async (
  subPlanId: number,
  token: string,
  successUrl: string,
  failedUrl: string,
): Promise<{ payUrl: string; orderId: string }> => {
  try {
    const url = ENDPOINT.RENEW_VNPAY_PAYMENT;
    const orderInfo = `Gia hạn SubscriptionPlan: ${subPlanId}`;
    const extraData = JSON.stringify({ subPlanId });

    console.log(
      "Initiating VNPay renewal from URL:",
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
        customOrderId: `RENEW-${subPlanId}-${Date.now()}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = response.data as PaymentResponse;

    console.log("VNPay Renewal Response:", responseData);

    // Chi tiết response để debug
    console.log("Response structure:", {
      payUrl: responseData.data.payUrl,
      orderId: responseData.data.orderId || `RENEW-${Date.now()}`,
      transactionId: responseData.data.transactionId,
    });

    // Xử lý trường orderId, dựa vào phản hồi thực tế của API
    const orderId =
      responseData.data.orderId ||
      (responseData.data.transactionId
        ? `RENEW-${responseData.data.transactionId}`
        : `RENEW-${Date.now()}`);

    if (responseData.success && responseData.data.payUrl) {
      return {
        payUrl: responseData.data.payUrl,
        orderId: orderId,
      };
    }

    throw new Error(responseData.message || "Không thể khởi tạo gia hạn VNPay");
  } catch (error: any) {
    console.error("Error initiating VNPay renewal:", error);
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
    // If it's a 404, silently handle it without console.error
    if (error.response?.status === 404) {
      console.log(
        "No active subscription found - this is expected for new users",
      );

      return null;
    }

    // Only log errors that aren't 404
    console.error("Error fetching current subscription:", error);
    throw error;
  }
};
export const renewSubscription = async (
  subPlanId: number,
  token: string,
  paymentMethod: string = "momo",
  successUrl?: string,
  failedUrl?: string,
): Promise<RenewResult> => {
  try {
    const url = ENDPOINT.RENEW_SUBSCRIPTION;
    const orderInfo = `Gia hạn SubscriptionPlan: ${subPlanId}`;
    const extraData = JSON.stringify({ subPlanId });
    const customOrderId = `RENEW-${subPlanId}-${Date.now()}`;

    console.log(
      "Renewing subscription from URL:",
      `${axiosClient.defaults.baseURL}${url}`,
    );

    const requestBody: any = {
      subPlanId,
      orderInfo,
      extraData,
      customOrderId,
    };

    // Add payment method to the request
    requestBody.paymentMethod = paymentMethod;

    // Add success and failed URLs if provided
    if (successUrl) requestBody.successUrl = successUrl;
    if (failedUrl) requestBody.failedUrl = failedUrl;

    console.log("Request body:", requestBody);

    const response = await axiosClient.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data as RenewResponse;

    console.log("Renew Subscription Response:", responseData);

    // Handle MoMo payment URL response
    if (responseData.success && responseData.data?.payUrl) {
      return {
        success: true,
        payUrl: responseData.data.payUrl,
        orderId: responseData.data.orderId || `RENEW-${Date.now()}`,
      };
    }

    // Handle existing response format (likely for direct renewal)
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
