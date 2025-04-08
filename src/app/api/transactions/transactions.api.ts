// import axiosClient from "@/lib/axiosClient";

// // Define the endpoint
// const ENDPOINT = {
//   STUDENT_TRANSACTIONS: "/api/v1/payment/studentTransaction",
// };

// // Define the type for the transaction data (based on the API response)
// export interface Transaction {
//   date: string;
//   description: string;
//   amount: number;
//   status: string;
//   bank: string;
// }

// export interface StudentTransactionList {
//   content: Transaction[];
//   pageNo: number;
//   pageSize: number;
//   totalElements: number;
//   totalPages: number;
//   last: boolean;
// }

// // Function to fetch student transactions
// export const getStudentTransactions = async ({
//   token,
//   pageNo = 0,
//   pageSize = 100,
//   sortBy = "date",
//   sortDir = "desc",
//   transactionStatus = "COMPLETED",
// }: {
//   token: string;
//   pageNo?: number;
//   pageSize?: number;
//   sortBy?: string;
//   sortDir?: string;
//   transactionStatus?: string;
// }): Promise<StudentTransactionList> => {
//   const params = new URLSearchParams();

//   params.append("pageNo", pageNo.toString());
//   params.append("pageSize", pageSize.toString());
//   params.append("sortBy", sortBy);
//   params.append("sortDir", sortDir);
//   params.append("transactionStatus", transactionStatus);

//   const response = await axiosClient.get(
//     `${ENDPOINT.STUDENT_TRANSACTIONS}?${params.toString()}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data.data as StudentTransactionList;
// };

import { AxiosError } from "axios";

import axiosClient from "@/lib/axiosClient";
import { StudentTransactionList, TransactionDetail } from "@/types/transaction";

// Định nghĩa endpoint
const ENDPOINT = {
  STUDENT_TRANSACTIONS: "/v1/payment/studentTransaction",
  TRANSACTION_DETAIL: "/v1/payment/detail",
};

export const getStudentTransactions = async ({
  token,
  pageNo = 0,
  pageSize = 100,
  sortBy = "paymentDate",
  sortDir = "desc",
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<StudentTransactionList> => {
  const params = new URLSearchParams();

  params.append("pageNo", pageNo.toString());
  params.append("pageSize", pageSize.toString());
  params.append("sortBy", sortBy);
  params.append("sortDir", sortDir);
  // Xóa tham số transactionStatus để lấy tất cả giao dịch

  try {
    const response = await axiosClient.get(
      `${ENDPOINT.STUDENT_TRANSACTIONS}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data as StudentTransactionList;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error("Máy chủ trả về lỗi:", error.response.data);
        throw new Error(
          error.response.data.message ||
            `Lỗi máy chủ: ${error.response.status}`,
        );
      }
      if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        throw new Error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.",
        );
      }
    }
    console.error("Lỗi thiết lập yêu cầu:", error);
    throw new Error(`Yêu cầu thất bại: ${String(error)}`);
  }
};

export const getTransactionDetail = async ({
  token,
  transactionId,
}: {
  token: string;
  transactionId: number;
}): Promise<TransactionDetail> => {
  const params = new URLSearchParams();

  params.append("transactionId", transactionId.toString());

  try {
    const response = await axiosClient.get(
      `${ENDPOINT.TRANSACTION_DETAIL}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data as TransactionDetail;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error("Máy chủ trả về lỗi:", error.response.data);
        throw new Error(
          error.response.data.message ||
            `Lỗi máy chủ: ${error.response.status}`,
        );
      }
      if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        throw new Error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.",
        );
      }
    }
    console.error("Lỗi thiết lập yêu cầu:", error);
    throw new Error(`Yêu cầu thất bại: ${String(error)}`);
  }
};
