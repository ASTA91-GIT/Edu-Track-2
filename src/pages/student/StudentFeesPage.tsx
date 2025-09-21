import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentFeesPage() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with Supabase queries
  const feesSummary = {
    totalDue: 15000,
    totalPaid: 85000,
    pending: 15000,
    overdue: 0
  };

  const feeRecords = [
    {
      id: '1',
      feeType: 'Tuition Fee',
      amount: 50000,
      dueDate: '2024-02-15',
      status: 'paid',
      paidDate: '2024-02-10',
      semester: 'Spring 2024',
      transactionId: 'TXN001'
    },
    {
      id: '2',
      feeType: 'Library Fee',
      amount: 5000,
      dueDate: '2024-02-15',
      status: 'paid',
      paidDate: '2024-02-12',
      semester: 'Spring 2024',
      transactionId: 'TXN002'
    },
    {
      id: '3',
      feeType: 'Lab Fee',
      amount: 15000,
      dueDate: '2024-03-15',
      status: 'pending',
      semester: 'Spring 2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRecords = feeRecords.filter(record =>
    record.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fee Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your fee payments and dues
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              ₹{feesSummary.totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              This academic year
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pending
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              ₹{feesSummary.pending.toLocaleString()}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Due soon
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Payment History
            </CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {feeRecords.filter(f => f.status === 'paid').length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Payments made
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Due
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              Mar 15
            </div>
            <p className="text-xs text-muted-foreground">
              Lab Fee due
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Fee Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Fee Breakdown</CardTitle>
              </div>
              <CardDescription>
                Your fee structure for the current academic year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.feeType}</h3>
                        <p className="text-sm text-muted-foreground">{record.semester}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{record.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Search and Filter */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Payment History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredRecords
                  .filter(record => record.status === 'paid')
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.feeType}</h3>
                          <p className="text-sm text-muted-foreground">
                            Paid on {record.paidDate} • TXN: {record.transactionId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{record.amount.toLocaleString()}</div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Pending Payments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle>Pending Payments</CardTitle>
              </div>
              <CardDescription>
                Outstanding fees that need to be paid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeRecords
                  .filter(record => record.status === 'pending')
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.feeType}</h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {record.dueDate} • {record.semester}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-semibold">₹{record.amount.toLocaleString()}</div>
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}