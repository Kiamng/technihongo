import { axiosClientUpload } from "@/lib/axiosClient";
import { SubscriptionHistoryResponse } from "@/types/supbscription";

const ENDPOINT = {
  SUBSCRIPTION_HISTORY: "/v1/subscription/history",
};

export const getSubscriptionHistory = async ({
  token,
  studentId,
  pageNo = 0,
  pageSize = 10,
}: {
  token: string;
  studentId: number;
  pageNo?: number;
  pageSize?: number;
}): Promise<SubscriptionHistoryResponse> => {
  const params = new URLSearchParams();

  params.append("studentId", studentId.toString());
  params.append("pageNo", pageNo.toString());
  params.append("pageSize", pageSize.toString());

  try {
    const response = await axiosClientUpload.get(
      `${ENDPOINT.SUBSCRIPTION_HISTORY}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data as SubscriptionHistoryResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";

    throw new Error("Không thể lấy lịch sử gói đăng ký: " + errorMessage);
  }
};
