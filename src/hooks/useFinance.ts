import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/lib/api/accountService";
import { transactionService, TransactionFilters } from "@/lib/api/transactionService";
import { budgetService } from "@/lib/api/budgetService";
import { analyticsService } from "@/lib/api/analyticsService";
import { userService } from "@/lib/api/userService";

/**
 * Finance Hooks
 * 
 * A collection of custom hooks for interacting with the financial backend.
 * Uses TanStack Query (React Query) for:
 * - Efficient data fetching and caching.
 * - Automatic background refetching.
 * - Loading and error state management.
 */

/**
 * Hook to fetch all user accounts/ledgers.
 */
export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountService.getAccounts(),
  });
};

export const useAccount = (id: string | null) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => id ? accountService.getAccountById(id) : Promise.reject("No ID"),
    enabled: !!id,
  });
};

export const useTransactions = (filters: TransactionFilters = {}) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getTransactions(filters),
  });
};

export const useBudgets = (month: number, year: number) => {
  return useQuery({
    queryKey: ["budgets", month, year],
    queryFn: () => budgetService.getBudgets(month, year),
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => analyticsService.getSummary(),
  });
};

export const useSpendingByCategory = (month: number, year: number) => {
  return useQuery({
    queryKey: ["spending-by-category", month, year],
    queryFn: () => analyticsService.getSpendingByCategory(month, year),
  });
};

export const useCashflow = () => {
  return useQuery({
    queryKey: ["cashflow"],
    queryFn: () => analyticsService.getCashflow(),
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); 
      queryClient.invalidateQueries({ queryKey: ["budgets"] }); 
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["spending-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["cashflow"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, transaction }: { id: string; transaction: any }) => 
      transactionService.updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); 
      queryClient.invalidateQueries({ queryKey: ["budgets"] }); 
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["spending-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["cashflow"] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); 
      queryClient.invalidateQueries({ queryKey: ["budgets"] }); 
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["spending-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["cashflow"] });
    },
  });
};

export const useUpsertBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetService.upsertBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => accountService.updateAccount(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userService.changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUserPermissions = (userId: string | null) => {
  return useQuery({
    queryKey: ["user-permissions", userId],
    queryFn: () => (userId ? userService.getUserPermissions(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: any[] }) =>
      userService.updateUserPermissions(id, permissions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-permissions", variables.id] });
    },
  });
};
