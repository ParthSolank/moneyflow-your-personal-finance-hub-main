import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Landmark, 
  CreditCard, 
  Coins,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { formatCurrency } from "@/lib/mockData";
import { useAccount, useTransactions } from "@/hooks/useFinance";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function LedgerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: account, isLoading: accountLoading } = useAccount(id || null);
  const { data: transactions = [], isLoading: txLoading } = useTransactions({ 
    accountId: id,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // First sort all transactions newest to oldest
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Compute accurate running balance walking backward from the current account balance
  let currentBal = account?.currentBalance || 0;
  const allTxWithBalance = sortedTransactions.map(t => {
    const balForThisRow = currentBal;
    if (t.type === 'income') currentBal -= t.amount;
    else currentBal += t.amount;
    return { ...t, runningBalance: balForThisRow };
  });

  // Then filter by selected month and year
  const filteredTransactions = allTxWithBalance.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const monthlyIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (accountLoading) return <AppLayout><div>Loading account...</div></AppLayout>;
  if (!account) return <AppLayout><div>Account not found.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ledgers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{account.name}</h1>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{account.type} Account</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-none bg-primary/5 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
            <h2 className={`text-2xl font-bold ${account.currentBalance < 0 ? "text-expense" : "text-foreground"}`}>
              {formatCurrency(account.currentBalance)}
            </h2>
          </CardContent>
        </Card>
        <Card className="border-none bg-income/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Income ({months[month-1]})</p>
              <TrendingUp className="h-4 w-4 text-income" />
            </div>
            <h2 className="text-2xl font-bold text-income">{formatCurrency(monthlyIncome)}</h2>
          </CardContent>
        </Card>
        <Card className="border-none bg-expense/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Expenses ({months[month-1]})</p>
              <TrendingDown className="h-4 w-4 text-expense" />
            </div>
            <h2 className="text-2xl font-bold text-expense">{formatCurrency(monthlyExpense)}</h2>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold text-foreground">Date</TableHead>
                <TableHead className="font-bold text-foreground">Description</TableHead>
                <TableHead className="font-bold text-foreground">Category</TableHead>
                <TableHead className="font-bold text-foreground">Method</TableHead>
                <TableHead className="font-bold text-foreground">Account</TableHead>
                <TableHead className="font-bold text-center text-foreground">Debit (Dr)</TableHead>
                <TableHead className="font-bold text-center text-foreground">Credit (Cr)</TableHead>
                <TableHead className="font-bold text-right text-foreground">Balance</TableHead>
                <TableHead className="font-bold text-right text-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((t, index) => {
                  return (
                    <TableRow key={t.id} className="hover:bg-muted/20 border-b">
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDate(t.date)}
                      </TableCell>
                      <TableCell className="font-bold text-foreground">
                        {t.description.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-muted-foreground bg-blue-50/50 border-blue-100 text-[11px] rounded-full px-3">
                          {t.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Coins className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs">Cash</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-center">-</TableCell>
                      <TableCell className="text-center">
                        {t.type === "expense" ? (
                          <Badge variant="secondary" className="bg-red-50 text-expense border-none font-bold py-1 px-3 gap-1 rounded-lg">
                            <TrendingDown className="h-3 w-3" /> {formatCurrency(t.amount)}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.type === "income" ? (
                          <Badge variant="secondary" className="bg-green-50 text-income border-none font-bold py-1 px-3 gap-1 rounded-lg">
                            <TrendingUp className="h-3 w-3" /> {formatCurrency(t.amount)}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        {formatCurrency(t.runningBalance)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* Grand Total Row */}
              <TableRow className="bg-muted/5 font-bold">
                <TableCell colSpan={5} className="text-right py-6 text-foreground uppercase tracking-wider text-xs">Grand Total</TableCell>
                <TableCell className="text-center text-expense text-lg">
                  {formatCurrency(monthlyExpense)}
                </TableCell>
                <TableCell className="text-center text-income text-lg">
                  {formatCurrency(monthlyIncome)}
                </TableCell>
                <TableCell className="text-right text-primary text-lg">
                  {formatCurrency(monthlyIncome - monthlyExpense)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>

              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No transactions found for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
