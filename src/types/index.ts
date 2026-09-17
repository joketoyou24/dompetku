export type TransactionType = "INCOME" | "EXPENSE";
export type PaymentMethod = "CASH" | "BANK" | "EWALLET";

export interface CategoryDTO {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  userId: string | null;
}

export interface TransactionDTO {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  paymentMethod: PaymentMethod;
  categoryId: string;
  category: CategoryDTO;
  userId: string;
}

export interface BudgetDTO {
  id: string;
  categoryId: string;
  category: CategoryDTO;
  amount: number;
  month: number;
  year: number;
  spent: number;
}

export interface SavingGoalDTO {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  BANK: "Transfer Bank",
  EWALLET: "E-Wallet",
};

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  INCOME: "Pemasukan",
  EXPENSE: "Pengeluaran",
};
