import { useState, useEffect } from "react";
import { Plus, PiggyBank, Target, ArrowUpRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { useBudgets, useUpsertBudget, useSpendingByCategory } from "@/hooks/useFinance";
import { formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import api from "@/lib/api/client";

export default function Budgets() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const { data: budgets = [], isLoading } = useBudgets(currentMonth, currentYear);
  const { data: spending = [] } = useSpendingByCategory(currentMonth, currentYear);
  const upsertBudget = useUpsertBudget();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState({ category: "Other", amount: "" });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
        setCategories(["Salary", "Rent", "Food & Dining", "Utilities", "Shopping", "Freelance", "Entertainment", "Groceries", "Transport", "Other"]);
      }
    };
    fetchCategories();
  }, []);

  // Check for budget alerts when budgets or spending changes
  useEffect(() => {
    budgets.forEach(budget => {
      const percentage = budget.limit > 0 ? (budget.actual / budget.limit) * 100 : 0;
      if (percentage >= 100) {
        // Budget exceeded
        toast.error(`⚠️ Budget exceeded for ${budget.category}: ${formatCurrency(budget.actual)} of ${formatCurrency(budget.limit)}`, {
          duration: 5000,
        });
      } else if (percentage >= 80) {
        // Warning: approaching limit
        toast.warning(`⚠️ ${budget.category} budget at ${Math.round(percentage)}%: ${formatCurrency(budget.actual)} of ${formatCurrency(budget.limit)}`, {
          duration: 5000,
        });
      }
    });
  }, [budgets]);

  const handleUpsert = async () => {
    if (!form.amount) return;

    try {
      await upsertBudget.mutateAsync({
        category: form.category,
        amount: parseFloat(form.amount),
        month: currentMonth,
        year: currentYear
      });
      toast.success("Budget updated successfully");
      setOpen(false);
      setForm({ category: "Other", amount: "" });
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleAutoBudget = async () => {
    if (spending.length === 0) {
      toast.error("No spending data available to generate budgets.");
      return;
    }

    try {
      for (const item of spending) {
        // Set budget to spending + 20% buffer
        const suggestedAmount = Math.ceil(item.amount * 1.2 / 100) * 100;
        await upsertBudget.mutateAsync({
          category: item.category,
          amount: suggestedAmount,
          month: currentMonth,
          year: currentYear
        });
      }
      toast.success("Smart budgets generated successfully!");
    } catch (error) {
      toast.error("Failed to generate some budgets.");
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-sm text-muted-foreground">Set limits and track your spending efficiency.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5" onClick={handleAutoBudget}>
            <Sparkles className="h-4 w-4" /> Smart Auto-Budget
          </Button>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Set Budget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const percentage = budget.limit > 0 ? Math.min((budget.actual / budget.limit) * 100, 100) : 100;
          const isOver = budget.actual > budget.limit && budget.limit > 0;
          
          return (
            <Card key={budget.category} className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant={isOver ? "destructive" : "secondary"}>{budget.category}</Badge>
                  <Target className={`h-4 w-4 ${isOver ? "text-destructive" : "text-primary"}`} />
                </div>
                <CardTitle className="mt-2 text-xl font-bold">
                  {formatCurrency(budget.actual)} <span className="text-sm font-normal text-muted-foreground">/ {formatCurrency(budget.limit)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={percentage} className={`h-2 ${isOver ? "bg-destructive/20" : ""}`} indicatorClassName={isOver ? "bg-destructive" : "bg-primary"} />
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{percentage.toFixed(0)}% used</span>
                    <span className={isOver ? "text-destructive" : "text-income"}>
                      {isOver ? `Over by ${formatCurrency(budget.actual - budget.limit)}` : `Remaining: ${formatCurrency(budget.limit - budget.actual)}`}
                    </span>
                  </div>
                  {percentage >= 80 && (
                    <div className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium ${isOver ? "bg-destructive/10 text-destructive" : "bg-yellow-50 text-yellow-700"}`}>
                      <AlertCircle className="h-3 w-3" />
                      {isOver ? "Budget exceeded!" : "Approaching budget limit"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && budgets.length === 0 && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading budgets...</p>
        </div>
      )}

      {!isLoading && budgets.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
          <PiggyBank className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-bold">No budgets set</h3>
          <p className="mb-4 text-sm text-muted-foreground">You haven't set any spending limits for this month yet.</p>
          <Button onClick={() => setOpen(true)}>Get Started</Button>
        </div>
      )}

      {/* Set Budget Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Category Budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Limit Amount (₹)</Label>
              <Input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpsert} disabled={!form.amount}>Save Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Badge({ children, variant = "secondary" }: { children: React.ReactNode, variant?: "secondary" | "destructive" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === "destructive" 
        ? "bg-destructive text-destructive-foreground hover:bg-destructive/80" 
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    }`}>
      {children}
    </span>
  );
}
