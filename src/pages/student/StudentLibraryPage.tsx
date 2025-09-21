import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLibraryPage() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with Supabase queries
  const libraryStats = {
    booksIssued: 3,
    booksReturned: 12,
    overdueBooks: 1,
    totalFine: 25
  };

  const availableBooks = [
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Computer Science',
      publisher: 'Prentice Hall',
      year: 2008,
      copies: 5,
      available: 3,
      shelf: 'CS-A-101'
    },
    {
      id: '2',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Computer Science',
      publisher: 'MIT Press',
      year: 2009,
      copies: 8,
      available: 2,
      shelf: 'CS-A-205'
    },
    {
      id: '3',
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      isbn: '978-1285741550',
      category: 'Mathematics',
      publisher: 'Cengage Learning',
      year: 2015,
      copies: 10,
      available: 6,
      shelf: 'MATH-B-301'
    }
  ];

  const issuedBooks = [
    {
      id: '1',
      title: 'Data Structures and Algorithms in Java',
      author: 'Robert Lafore',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'issued',
      renewals: 1
    },
    {
      id: '2',
      title: 'Linear Algebra and Its Applications',
      author: 'David C. Lay',
      issueDate: '2024-01-20',
      dueDate: '2024-02-10',
      status: 'overdue',
      renewals: 0,
      fine: 25
    },
    {
      id: '3',
      title: 'Physics for Scientists and Engineers',
      author: 'Raymond A. Serway',
      issueDate: '2024-02-01',
      dueDate: '2024-03-01',
      status: 'issued',
      renewals: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'returned': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Library Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Search, issue, and manage your library books
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Books Issued
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {libraryStats.booksIssued}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Currently borrowed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Books Returned
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {libraryStats.booksReturned}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              This academic year
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Overdue Books
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {libraryStats.overdueBooks}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Need immediate return
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Total Fine
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              ₹{libraryStats.totalFine}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Outstanding amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Books</TabsTrigger>
          <TabsTrigger value="issued">My Books ({libraryStats.booksIssued})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Interface */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Search Library Catalog</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title, author, or category..."
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
                {filteredBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{book.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {book.author}
                          <span>•</span>
                          <span>{book.category}</span>
                          <span>•</span>
                          <span>Shelf: {book.shelf}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ISBN: {book.isbn} • {book.publisher} ({book.year})
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{book.available}</span> of <span>{book.copies}</span> available
                      </div>
                      <Button 
                        size="sm" 
                        disabled={book.available === 0}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        {book.available > 0 ? 'Issue Book' : 'Not Available'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issued" className="space-y-6">
          {/* Currently Issued Books */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Currently Issued Books</CardTitle>
              </div>
              <CardDescription>
                Books you have currently borrowed from the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issuedBooks.map((book) => (
                  <div key={book.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    book.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-accent/5 border-accent/10'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        book.status === 'overdue' 
                          ? 'bg-gradient-to-br from-red-100 to-red-200' 
                          : 'bg-gradient-to-br from-primary/20 to-accent/20'
                      }`}>
                        {book.status === 'overdue' ? (
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{book.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {book.author}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Issued: {book.issueDate} • Due: {book.dueDate}
                          {book.renewals > 0 && ` • Renewed ${book.renewals} time(s)`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(book.status)}>
                        {book.status === 'overdue' ? 'Overdue' : 'Issued'}
                      </Badge>
                      {book.fine && (
                        <div className="text-sm text-red-600 font-medium">
                          Fine: ₹{book.fine}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Renew
                        </Button>
                        <Button size="sm" variant="secondary">
                          Return
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overdue Alert */}
          {libraryStats.overdueBooks > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-red-800 dark:text-red-200">
                    Overdue Books Alert
                  </CardTitle>
                </div>
                <CardDescription className="text-red-700 dark:text-red-300">
                  You have {libraryStats.overdueBooks} overdue book(s). Please return them immediately to avoid additional fines.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Borrowing History</CardTitle>
              </div>
              <CardDescription>
                Your complete library transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your borrowing history will appear here</p>
                <p className="text-sm">Complete transaction records with return dates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}