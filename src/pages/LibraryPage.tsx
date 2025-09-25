import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen,
  Download,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  Users,
  BookMarked,
  FileText,
  Upload,
  BarChart3,
  User,
  Calendar,
  Star,
  Library,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';

export default function LibraryPage() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  // Mock data for library resources
  const resources = [
    {
      id: '1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      subject: 'Computer Science',
      class: 'CS-3A',
      category: 'textbook',
      description: 'Comprehensive guide to algorithms and data structures',
      downloadUrl: '#',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2024-01-15',
      downloads: 245,
      rating: 4.8,
      fileSize: '15.2 MB',
      format: 'PDF'
    },
    {
      id: '2',
      title: 'Database Systems Lecture Notes',
      author: 'Prof. Johnson',
      subject: 'Computer Science',
      class: 'CS-3B',
      category: 'notes',
      description: 'Complete lecture notes covering all database concepts',
      downloadUrl: '#',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2024-02-01',
      downloads: 189,
      rating: 4.6,
      fileSize: '8.7 MB',
      format: 'PDF'
    },
    {
      id: '3',
      title: 'Data Structures Assignment',
      author: 'CS Department',
      subject: 'Computer Science',
      class: 'CS-3A',
      category: 'assignments',
      description: 'Assignment on implementing binary trees and graphs',
      downloadUrl: '#',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2024-02-10',
      downloads: 156,
      rating: 4.5,
      fileSize: '2.3 MB',
      format: 'PDF'
    },
    {
      id: '4',
      title: 'Calculus Reference Guide',
      author: 'Dr. Wilson',
      subject: 'Mathematics',
      class: 'All',
      category: 'reference',
      description: 'Quick reference for calculus formulas and concepts',
      downloadUrl: '#',
      uploadedBy: 'Dr. Wilson',
      uploadDate: '2024-01-20',
      downloads: 320,
      rating: 4.9,
      fileSize: '5.1 MB',
      format: 'PDF'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'textbooks', name: 'Textbooks', count: resources.filter(r => r.category === 'textbook').length },
    { id: 'notes', name: 'Notes', count: resources.filter(r => r.category === 'notes').length },
    { id: 'assignments', name: 'Assignments', count: resources.filter(r => r.category === 'assignments').length },
    { id: 'reference', name: 'Reference', count: resources.filter(r => r.category === 'reference').length },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || resource.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesClass = selectedClass === 'all' || resource.class === selectedClass;
    
    return matchesSearch && matchesCategory && matchesSubject && matchesClass;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'textbook': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'notes': return 'bg-green-100 text-green-800 border-green-200';
      case 'assignments': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reference': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'textbook': return <BookOpen className="h-4 w-4" />;
      case 'notes': return <FileText className="h-4 w-4" />;
      case 'assignments': return <Award className="h-4 w-4" />;
      case 'reference': return <Library className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            EduTrack Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access and download study material anytime
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by title, subject, class, or author..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {profile?.role === 'teacher' && (
                  <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resource
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload New Resource</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input placeholder="Enter resource title" />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="textbook">Textbook</SelectItem>
                              <SelectItem value="notes">Notes</SelectItem>
                              <SelectItem value="assignments">Assignment</SelectItem>
                              <SelectItem value="reference">Reference</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="file">File Upload</Label>
                          <Input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setUploadOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-gradient-to-r from-primary to-accent">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="computer">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="CS-3A">CS-3A</SelectItem>
                    <SelectItem value="CS-3B">CS-3B</SelectItem>
                    <SelectItem value="ME-3A">ME-3A</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {getCategoryIcon(category.id)}
                <span className="hidden sm:inline">{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(resource.category)} variant="outline">
                            {getCategoryIcon(resource.category)}
                            <span className="ml-1 capitalize">{resource.category}</span>
                          </Badge>
                          <Badge variant="outline">
                            {resource.format}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">
                          by {resource.author}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{resource.subject}</span>
                        <span>•</span>
                        <span>{resource.class}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Uploaded by {resource.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{resource.uploadDate}</span>
                        <span>•</span>
                        <span>{resource.fileSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(resource.rating)}
                        </div>
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span>{resource.downloads}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <Library className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Resources
              </CardTitle>
              <Library className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {resources.length}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Available for download
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {resources.reduce((sum, r) => sum + r.downloads, 0)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                This semester
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Contributors
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {new Set(resources.map(r => r.uploadedBy)).size}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Active contributors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Knowledge at Your Fingertips</h3>
            <p className="text-muted-foreground mb-6">
              Access thousands of study materials, textbooks, and resources curated by expert educators
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Search className="h-5 w-5 mr-2" />
                Explore All Resources
              </Button>
              {profile?.role === 'teacher' && (
                <Button size="lg" variant="outline">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Resource
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}