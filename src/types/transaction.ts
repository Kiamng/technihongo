export interface Transaction {
  transactionId: number;
  subscriptionPlanName: string; // Tương ứng với description
  paymentMethod: string; // Tương ứng với bank
  transactionAmount: number; // Tương ứng với amount
  currency: string;
  transactionStatus: string; // Tương ứng với status
  paymentDate: string; // Tương ứng với date
  createdAt: string;
}

export interface StudentTransactionList {
  content: Transaction[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Định nghĩa kiểu dữ liệu cho chi tiết giao dịch
export interface Student {
  studentId: number;
  bio: string | null;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: string | null;
  updatedAt: string;
}

export interface SubscriptionPlan {
  subPlanId: number;
  name: string;
  price: number;
  benefits: string;
  durationDays: number;
  createdAt: string;
  active: boolean;
}

export interface Subscription {
  subscriptionId: number;
  student: Student;
  subscriptionPlan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PaymentMethod {
  methodId: number;
  name: string;
  code: string;
  createdAt: string;
  active: boolean;
}

export interface TransactionDetail {
  transactionId: number;
  subscription: Subscription;
  paymentMethod: PaymentMethod;
  externalOrderId: string;
  transactionAmount: number;
  currency: string;
  transactionStatus: string;
  paymentDate: string;
  expiresAt: string;
  createdAt: string;
}
