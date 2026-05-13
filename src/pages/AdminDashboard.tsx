import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  BarChart3,
  Activity,
  TrendingUp,
  AlertCircle,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAccounts, useTransactions } from "@/hooks/useFinance";
import { formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";

interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  role: "admin" | "user";
}

export default function AdminDashboard() {
  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useTransactions({ accountId: undefined });

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Mock system users data
  useEffect(() => {
    const mockUsers: SystemUser[] = [
      {
        id: "1",
        email: "admin@moneyflow.com",
        fullName: "Admin User",
        createdAt: "2026-01-15",
        lastLogin: new Date().toISOString().slice(0, 10),
        isActive: true,
        role: "admin",
      },
      {
        id: "2",
        email: "user@example.com",
        fullName: "John Doe",
        createdAt: "2026-02-20",
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isActive: true,
        role: "user",
      },
      {
        id: "3",
        email: "jane@example.com",
        fullName: "Jane Smith",
        createdAt: "2026-03-10",
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isActive: true,
        role: "user",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(
      `${user?.fullName} has been ${user?.isActive ? "deactivated" : "activated"}`
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    }
  };

  // Calculate statistics
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System overview, user management, and analytics
        </p>
      </div>

      {/* System Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.filter((u) => u.isActive).length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {users.length} total registered
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Total Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{accounts.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Total balance: {formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{transactions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              System-wide activity
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{savingsRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Income vs expenses ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Full Name</TableHead>
                      <TableHead className="font-bold">Role</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Joined</TableHead>
                      <TableHead className="font-bold">Last Login</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "admin" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "outline" : "secondary"}
                            className={user.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your search
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Income</span>
                  <span className="font-bold text-green-600">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Expenses</span>
                  <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-muted-foreground">Net Savings</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(totalIncome - totalExpenses)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Accounts</span>
                  <span className="font-bold">{accounts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Balance</span>
                  <span className="font-bold text-primary">{formatCurrency(totalBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg. Balance</span>
                  <span className="font-bold">
                    {formatCurrency(accounts.length > 0 ? totalBalance / accounts.length : 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>System activity and security logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Activity className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">System initialized</p>
                    <p className="text-blue-700/70">{new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <Activity className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Admin user created</p>
                    <p className="text-green-700/70">2026-01-15 10:30 AM</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900">User registration spike detected</p>
                    <p className="text-yellow-700/70">3 new users in the last 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-muted/30 border">
                  <Activity className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Database backup completed</p>
                    <p className="text-muted-foreground">2026-05-12 02:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
