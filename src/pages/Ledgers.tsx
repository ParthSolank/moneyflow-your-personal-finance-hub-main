import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Landmark, CreditCard, Coins, MoreVertical, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppLayout from "@/components/AppLayout";
import { formatCurrency } from "@/lib/mockData";
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/hooks/useFinance";
import { toast } from "sonner";

export default function Ledgers() {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  // New ledger
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", type: "bank" as "bank" | "credit" | "cash", balance: "" });

  // Rename
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newForm.name.trim()) return;
    
    try {
      await createAccount.mutateAsync({
        name: newForm.name,
        type: newForm.type,
        initialBalance: parseFloat(newForm.balance) || 0
      });
      toast.success("Ledger created successfully");
      setNewForm({ name: "", type: "bank", balance: "" });
      setNewOpen(false);
    } catch (error) {
      toast.error("Failed to create ledger");
    }
  };

  const handleRename = async () => {
    if (!renameId || !renameName.trim()) return;
    try {
      await updateAccount.mutateAsync({ id: renameId, name: renameName });
      toast.success("Ledger renamed successfully");
      setRenameOpen(false);
    } catch (error) {
      toast.error("Failed to rename ledger");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAccount.mutateAsync(deleteId);
      toast.success("Ledger deleted successfully");
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete ledger");
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accounts & Ledgers</h1>
          <p className="text-sm text-muted-foreground">Manage your banking and credit accounts in ₹.</p>
        </div>
        <Button className="gap-2" onClick={() => setNewOpen(true)}>
          <Plus className="h-4 w-4" /> New Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {account.type === "bank" ? (
                    <Landmark className="h-5 w-5 text-primary" />
                  ) : account.type === "credit" ? (
                    <CreditCard className="h-5 w-5 text-primary" />
                  ) : (
                    <Coins className="h-5 w-5 text-primary" />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setRenameId(account.id); setRenameName(account.name); setRenameOpen(true); }}>
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-expense" onClick={() => { setDeleteId(account.id); setDeleteOpen(true); }}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="text-base font-bold text-foreground">{account.name}</h3>
              <p className={`mt-1 text-xl font-bold ${account.currentBalance < 0 ? "text-expense" : "text-foreground"}`}>
                {formatCurrency(account.currentBalance)}
              </p>
              <Link 
                to={`/transactions?accountId=${account.id}`}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Ledger Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Ledger</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Account Name</Label>
              <Input placeholder="e.g. Wallet / Cash" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={newForm.type} onValueChange={(v) => setNewForm({ ...newForm, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash / Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Opening Balance (₹)</Label>
                <Input type="number" placeholder="0" value={newForm.balance} onChange={(e) => setNewForm({ ...newForm, balance: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newForm.name.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Ledger</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>New Name</Label>
            <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename} disabled={!renameName.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ledger?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The account and its history will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
