import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  ClipboardList,
  Landmark,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import AppLayout from "@/components/AppLayout";
import { formatCurrency } from "@/lib/mockData";
import { 
  useDashboardSummary, 
  useCashflow, 
  useSpendingByCategory, 
  useTransactions, 
  useAccounts 
} from "@/hooks/useFinance";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

/**
 * Dashboard Component
 * 
 * The main landing page for authenticated users.
 * Displays:
 * - High-level financial summary (Total balance, Income, Expenses).
 * - Account distribution and recent transactions.
 * - Quick actions for managing finance.
 */
export default function Dashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fetch financial data using specialized hooks
  const { data: summary } = useDashboardSummary();
  const { data: cashflow = [] } = useCashflow();
  const { data: spending = [] } = useSpendingByCategory(currentMonth, currentYear);
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions({ accountId: undefined });
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();

  const primaryAccounts = accounts.filter((a) => a.type === "bank");

  const summaryCards = [
    {
      label: "Total Balance",
      value: formatCurrency(summary?.totalBalance || 0),
      sub: "Across all accounts",
      icon: Wallet,
      iconColor: "text-primary",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(summary?.monthlyIncome || 0),
      sub: "This month",
      icon: TrendingUp,
      iconColor: "text-income",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(summary?.monthlyExpense || 0),
      sub: "This month",
      icon: TrendingDown,
      iconColor: "text-expense",
    },
    {
      label: "Savings Rate",
      value: `${summary?.savingsRate || 0}%`,
      sub: "Income minus expenses",
      icon: Percent,
      iconColor: "text-info",
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Financial Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time insights into your financial health.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-none shadow-md transition-all hover:shadow-lg">
            <CardContent className="flex flex-col gap-1 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
              <span className="text-2xl font-bold text-foreground">{card.value}</span>
              <span className="text-xs text-muted-foreground">{card.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cashflow Trend */}
        <Card className="shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Cashflow Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflow}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spending Distribution */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <CardTitle>Spending</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full pb-0">
            {spending.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spending}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {spending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No spending data this month.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Primary Accounts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="shadow-md lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-primary">Date</TableHead>
                  <TableHead className="text-primary">Description</TableHead>
                  <TableHead className="text-primary">Category</TableHead>
                  <TableHead className="text-right text-primary">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 6).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">{t.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-[10px] uppercase tracking-wider text-foreground">
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right text-sm font-bold ${t.type === "income" ? "text-income" : "text-foreground"}`}>
                      {t.type === "income" ? "+" : ""}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                      No recent transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Primary Accounts */}
        <Card className="shadow-md">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Accounts & Wallets</h2>
            </div>
            <div className="space-y-4">
              {accounts.filter(a => a.type === "bank" || a.type === "cash").map((account) => (
                <div key={account.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{account.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{account.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${account.currentBalance < 0 ? "text-expense" : "text-foreground"}`}>
                      {formatCurrency(account.currentBalance)}
                    </p>
                    <p className="text-[10px] font-medium uppercase text-income">Online</p>
                  </div>
                </div>
              ))}
              {primaryAccounts.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No bank accounts linked.</p>
              )}
            </div>

            {/* Health card */}
            <div className="mt-5 rounded-xl bg-primary/10 p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">System Active</p>
                  <p className="text-xs text-muted-foreground">All systems are reporting healthy data.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
