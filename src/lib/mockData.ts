// Mock data for MoneyFlow

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  type: "bank" | "credit";
  balance: number;
  description: string;
  status: "active" | "inactive";
}

export const mockAccounts: Account[] = [
  { id: "1", name: "HDFC Savings", type: "bank", balance: 45000.5, description: "Primary savings account", status: "active" },
  { id: "2", name: "ICICI Current", type: "bank", balance: 125000, description: "Business and utility account", status: "active" },
  { id: "3", name: "SBI Salary", type: "bank", balance: 85000, description: "Main salary deposit", status: "active" },
  { id: "4", name: "Axis Digital", type: "bank", balance: 12000.75, description: "Online transactions and UPI", status: "active" },
  { id: "5", name: "Amex Platinum", type: "credit", balance: -12500, description: "Premium credit card", status: "active" },
  { id: "6", name: "HDFC Regalia", type: "credit", balance: -8400.2, description: "Travel rewards card", status: "active" },
  { id: "7", name: "ICICI Amazon Pay", type: "credit", balance: -3200.5, description: "Shopping rewards card", status: "active" },
];

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2024-03-01", description: "Monthly Salary", category: "Salary", amount: 95000, type: "income", accountId: "3" },
  { id: "2", date: "2024-03-02", description: "Rent Payment", category: "Rent", amount: 25000, type: "expense", accountId: "1" },
  { id: "3", date: "2024-03-05", description: "Zomato Order", category: "Food & Dining", amount: 450.75, type: "expense", accountId: "4" },
  { id: "4", date: "2024-03-08", description: "Electricity Bill", category: "Utilities", amount: 1800.20, type: "expense", accountId: "2" },
  { id: "5", date: "2024-03-10", description: "Amazon.in Shopping", category: "Shopping", amount: 5499, type: "expense", accountId: "5" },
  { id: "6", date: "2024-03-12", description: "Freelance Project", category: "Freelance", amount: 15000, type: "income", accountId: "1" },
  { id: "7", date: "2024-03-15", description: "Netflix Subscription", category: "Entertainment", amount: 649, type: "expense", accountId: "6" },
  { id: "8", date: "2024-03-18", description: "Grocery Shopping", category: "Groceries", amount: 3200, type: "expense", accountId: "4" },
];

export const summaryData = {
  totalBalance: 250000.75,
  monthlyIncome: 54500,
  monthlyExpenses: 18322.34,
  savingsRate: 66.4,
};

export const formatCurrency = (amount: number): string => {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-IN", { minimumFractionDigits: abs % 1 !== 0 ? 2 : 0 });
  return amount < 0 ? `₹-${formatted}` : `₹${formatted}`;
};
