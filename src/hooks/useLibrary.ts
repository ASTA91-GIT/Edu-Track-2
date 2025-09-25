import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  file_url?: string;
  cover_image_url?: string;
  isbn?: string;
  publication_year?: number;
  total_copies: number;
  available_copies: number;
  subject_tags?: string[];
  created_at: string;
  updated_at: string;
}

interface LibraryAccessLog {
  id: string;
  book_id: string;
  user_id: string;
  action: 'download' | 'view' | 'search';
  accessed_at: string;
}

export const useLibrary = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [accessLogs, setAccessLogs] = useState<LibraryAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { profile } = useAuth();
  const { toast } = useToast();

  // Fetch books based on user role and filters
  const fetchBooks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('library_books')
        .select('*')
        .order('title');

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Error",
          description: "Failed to load library books",
          variant: "destructive"
        });
        return;
      }

      setBooks(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch access logs for admin/teachers
  const fetchAccessLogs = async () => {
    if (profile?.role !== 'admin' && profile?.role !== 'teacher') return;

    try {
      const { data, error } = await supabase
        .from('library_access_logs')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching access logs:', error);
        return;
      }

      // Type assertion since we know the data structure
      setAccessLogs((data as LibraryAccessLog[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Log book access
  const logBookAccess = async (bookId: string, action: 'download' | 'view' | 'search') => {
    try {
      // Log book access
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user?.id) return;

      const { error } = await supabase
        .from('library_access_logs')
        .insert({
          book_id: bookId,
          user_id: userData.user.id,
          action,
          ip_address: 'client', // In real app, get actual IP
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging access:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Download book (placeholder)
  const downloadBook = async (book: LibraryBook) => {
    try {
      await logBookAccess(book.id, 'download');
      
      toast({
        title: "Download Started",
        description: `Downloading "${book.title}" by ${book.author}`,
      });

      // In a real app, this would trigger actual file download
      // For demo, we'll just show success
      setTimeout(() => {
        toast({
          title: "Download Complete",
          description: `"${book.title}" has been downloaded successfully.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error downloading book:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the book. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add new book (teachers/admins only)
  const addBook = async (bookData: Omit<LibraryBook, 'id' | 'created_at' | 'updated_at'>) => {
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add books.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('library_books')
        .insert(bookData);

      if (error) {
        console.error('Error adding book:', error);
        toast({
          title: "Error",
          description: "Failed to add book to library",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Book added to library successfully"
      });

      await fetchBooks(); // Refresh the list
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAccessLogs();
  }, [profile, searchQuery, selectedCategory]);

  const categories = [...new Set(books.map(book => book.category))];

  return {
    books,
    accessLogs,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    downloadBook,
    addBook,
    logBookAccess,
    refreshBooks: fetchBooks
  };
};