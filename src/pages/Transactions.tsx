import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus, Trash2, TrendingUp, TrendingDown, Coins, MoreHorizontal, Banknote, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { formatCurrency } from "@/lib/mockData";
import { useAccounts, useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useFinance";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api/client";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function Transactions() {
  const [searchParams] = useSearchParams();
  const accountIdFilter = searchParams.get("accountId");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const { data: transactions = [], isLoading: txLoading } = useTransactions({ accountId: accountIdFilter || undefined });
  const { data: accounts = [] } = useAccounts();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ description: "", amount: "", category: "Other", type: "expense" as "income" | "expense", date: new Date().toISOString().slice(0, 10), accountId: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
        // Fallback to default categories
        setCategories(["Salary", "Rent", "Food", "Food & Dining", "Utilities", "Shopping", "Freelance", "Entertainment", "Groceries", "Transport", "Other"]);
      }
    };
    fetchCategories();
  }, []);

  // CSV Export function
  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Account"];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('en-GB'),
      t.description,
      t.category,
      t.type,
      formatCurrency(t.amount),
      accounts.find(a => a.id === t.accountId)?.name || "-"
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully");
  };

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.amount || !form.accountId) return;
    
    try {
      const data = {
        description: form.description,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
        category: form.category,
        type: form.type,
        accountId: form.accountId
      };

      if (editingId) {
        await updateTransaction.mutateAsync({ id: editingId, transaction: data });
        toast.success("Transaction updated successfully");
      } else {
        await createTransaction.mutateAsync(data);
        toast.success("Transaction added successfully");
      }
      
      handleClose();
    } catch (error) {
      toast.error(editingId ? "Failed to update transaction" : "Failed to add transaction");
    }
  };

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      description: t.description,
      amount: t.amount.toString(),
      category: t.category,
      type: t.type,
      date: new Date(t.date).toISOString().slice(0, 10),
      accountId: t.accountId
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction.mutateAsync(id);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ description: "", amount: "", category: "Other", type: "expense", date: new Date().toISOString().slice(0, 10), accountId: "" });
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Manage and track your detailed spending history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={exportToCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
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
              {(() => {
                let currentBal = 0;
                const txWithBalance = [...filtered].reverse().map(t => {
                  if (t.type === 'income') currentBal += t.amount;
                  else currentBal -= t.amount;
                  return { ...t, runningBalance: currentBal };
                }).reverse();

                // Calculate pagination
                const totalPages = Math.ceil(txWithBalance.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedTx = txWithBalance.slice(startIndex, startIndex + itemsPerPage);

                return paginatedTx.map((t, index) => {
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
                          <Banknote className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs">Cash</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-center">
                        {accounts.find(a => a.id === t.accountId)?.name || "-"}
                      </TableCell>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(t)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                });
              })()}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to{" "}
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} transactions
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.ceil(filtered.length / itemsPerPage) },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filtered.length / itemsPerPage),
                      currentPage + 1
                    )
                  )
                }
                disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input placeholder="e.g. Grocery Shopping" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount (₹)</Label>
                <Input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "income" | "expense" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Account</Label>
              <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.description.trim() || !form.amount}>{editingId ? "Save Changes" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
