import { useState, useRef } from "react";
import { Sparkles, FileText, AlertCircle, Upload, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { formatCurrency } from "@/lib/mockData";
import { useAccounts } from "@/hooks/useFinance";
import { importService, ImportTransaction } from "@/lib/api/importService";
import { toast } from "sonner";

const categories = ["Salary", "Rent", "Food & Dining", "Utilities", "Shopping", "Freelance", "Entertainment", "Groceries", "Transport", "Other"];

export default function ImportStatement() {
  const { data: accounts = [] } = useAccounts();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ImportTransaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await importService.parseStatement(file);
      // Map ParsedTransaction to ImportTransaction with a default category
      setResults(data.map(t => ({ ...t, category: "Other" })));
      toast.success("Statement parsed successfully");
    } catch (error) {
      toast.error("Failed to parse statement. Please ensure it's a valid PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results || !selectedAccountId) {
      toast.error("Please select an account first");
      return;
    }

    setSaving(true);
    try {
      await importService.confirmImport(selectedAccountId, results);
      toast.success(`${results.length} transactions imported successfully`);
      setResults(null);
      setFile(null);
    } catch (error) {
      toast.error("Failed to save transactions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bank Statement Import</h1>
        <p className="text-sm text-muted-foreground">
          Upload your PDF statement to automatically extract and categorize transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upload & Options */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Upload Statement</h2>
            </div>
            
            <div 
              className="mb-4 cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 p-10 text-center transition-colors hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : "Click to browse or drag PDF here"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Supported format: PDF</p>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="application/pdf"
              />
            </div>

            <div className="mb-6 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Target Account</label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger><SelectValue placeholder="Select destination account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleExtract}
              disabled={loading || !file}
              className="w-full gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Parsing Statement..." : "Process Statement"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Extracted Transactions</h2>
              {results && (
                <Badge variant="secondary" className="px-2 py-1">
                  {results.length} entries found
                </Badge>
              )}
            </div>

            {results ? (
              <div className="space-y-4">
                <div className="max-h-[500px] overflow-y-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(r.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm" title={r.description}>
                            {r.description}
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={r.category} 
                              onValueChange={(v) => {
                                const newResults = [...results];
                                newResults[i].category = v;
                                setResults(newResults);
                              }}
                            >
                              <SelectTrigger className="h-8 w-[140px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell
                            className={`text-right text-sm font-medium ${r.type === "income" ? "text-income" : "text-foreground"}`}
                          >
                            {r.type === "income" ? "+" : ""}
                            {formatCurrency(r.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setResults(null)}>Cancel</Button>
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={handleSave} 
                    disabled={saving || !selectedAccountId}
                  >
                    <Check className="h-4 w-4" />
                    {saving ? "Saving..." : "Confirm & Import"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <AlertCircle className="mb-2 h-10 w-10 opacity-20" />
                <p className="text-sm">Upload and process a statement to see results here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
