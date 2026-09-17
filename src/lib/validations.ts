import { z } from "zod";

export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);
export const paymentMethodEnum = z.enum(["CASH", "BANK", "EWALLET"]);

export const transactionSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  type: transactionTypeEnum,
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  description: z.string().max(500).optional().nullable(),
  paymentMethod: paymentMethodEnum,
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
});
export type TransactionInput = z.infer<typeof transactionSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(50),
  type: transactionTypeEnum,
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  amount: z.coerce.number().positive("Nominal budget harus lebih dari 0"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
});
export type BudgetInput = z.infer<typeof budgetSchema>;

export const savingGoalSchema = z.object({
  name: z.string().min(1, "Nama target wajib diisi").max(100),
  targetAmount: z.coerce.number().positive("Nominal target harus lebih dari 0"),
  currentAmount: z.coerce.number().min(0).optional().default(0),
  deadline: z.string().optional().nullable(),
});
export type SavingGoalInput = z.infer<typeof savingGoalSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  image: z.string().url().optional().nullable().or(z.literal("")),
  currency: z.string().default("IDR"),
});
export type ProfileInput = z.infer<typeof profileSchema>;
