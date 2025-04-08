// src/types/subscription.ts
export interface Subscription {
  subscriptionId: number;
  planName: string;
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: string;
  status: boolean;
  groupStatus: string;
}

export interface SubscriptionHistoryResponse {
  content: Subscription[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
