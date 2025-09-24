import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Plus,
  Search,
  Send,
  Paperclip,
  Bell,
  Users,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function MessagesPage() {
  const { profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      type: 'announcement',
      title: 'Semester Exam Schedule',
      sender: 'Dr. Smith',
      senderRole: 'teacher',
      lastMessage: 'The final exam schedule has been updated. Please check the new timings.',
      timestamp: '2 hours ago',
      unread: true,
      participants: ['CS-3A', 'CS-3B'],
      avatar: null
    },
    {
      id: 2,
      type: 'query',
      title: 'Assignment Submission Query',
      sender: 'John Doe',
      senderRole: 'student',
      lastMessage: 'When is the deadline for the Data Structures assignment?',
      timestamp: '1 day ago',
      unread: false,
      participants: ['Prof. Johnson'],
      avatar: null
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Library Maintenance Notice',
      sender: 'Admin',
      senderRole: 'admin',
      lastMessage: 'The library will be closed for maintenance this weekend.',
      timestamp: '2 days ago',
      unread: true,
      participants: ['All Students'],
      avatar: null
    }
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: 'Dr. Smith',
      senderRole: 'teacher',
      content: 'Dear Students, I hope you are all doing well. I wanted to inform you about the updated semester exam schedule.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      conversationId: 1,
      sender: 'Dr. Smith',
      senderRole: 'teacher',
      content: 'The final exam schedule has been updated. Please check the new timings and make sure to prepare accordingly. The exam will cover all topics discussed in the semester.',
      timestamp: '10:32 AM',
      isOwn: false
    },
    {
      id: 3,
      conversationId: 1,
      sender: profile?.name || 'You',
      senderRole: profile?.role || 'student',
      content: 'Thank you for the update, Dr. Smith. Will the syllabus remain the same?',
      timestamp: '10:45 AM',
      isOwn: true
    }
  ];

  const getCurrentMessages = () => {
    return messages.filter(msg => msg.conversationId === selectedConversation);
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  const getUnreadCount = () => {
    return conversations.filter(conv => conv.unread).length;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <User className="h-3 w-3" />;
      case 'admin': return <Users className="h-3 w-3" />;
      case 'student': return <User className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-green-100 text-green-800 border-green-200';
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'student': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="h-4 w-4" />;
      case 'query': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Stay Connected
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Students and teachers can communicate easily
          </p>
        </div>

        {/* Messages Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Message List */}
          <Card className="border-0 shadow-lg lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Messages</CardTitle>
                  {getUnreadCount() > 0 && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {getUnreadCount()}
                    </Badge>
                  )}
                </div>
                <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Compose Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="to">To</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs-3a">CS-3A Class</SelectItem>
                            <SelectItem value="cs-3b">CS-3B Class</SelectItem>
                            <SelectItem value="all-students">All Students</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input placeholder="Enter subject" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea placeholder="Type your message..." rows={4} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setComposeOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search messages..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent/10 ${
                        selectedConversation === conversation.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-accent/5'
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                            {conversation.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageTypeIcon(conversation.type)}
                            <h4 className="font-semibold text-sm truncate">{conversation.title}</h4>
                            {conversation.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{conversation.sender}</span>
                            <Badge className={getRoleColor(conversation.senderRole)} variant="outline">
                              {getRoleIcon(conversation.senderRole)}
                              <span className="ml-1 text-xs">{conversation.senderRole}</span>
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {conversation.participants.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Conversation Panel */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getCurrentConversation()?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      {getCurrentConversation()?.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{getCurrentConversation()?.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {getCurrentConversation()?.sender}
                      </span>
                      <Badge className={getRoleColor(getCurrentConversation()?.senderRole || '')} variant="outline">
                        {getRoleIcon(getCurrentConversation()?.senderRole || '')}
                        <span className="ml-1 text-xs">{getCurrentConversation()?.senderRole}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 p-4">
                  {getCurrentMessages().map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs">
                          {message.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${message.isOwn ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {!message.isOwn && (
                            <>
                              <span className="text-xs font-medium">{message.sender}</span>
                              <Badge className={getRoleColor(message.senderRole)} variant="outline">
                                <span className="text-xs">{message.senderRole}</span>
                              </Badge>
                            </>
                          )}
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.isOwn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent/10 border border-accent/20'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="border-t border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Unread Messages
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {getUnreadCount()}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Announcements
              </CardTitle>
              <Megaphone className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {conversations.filter(c => c.type === 'announcement').length}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Active Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {conversations.length}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Total conversations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Communication Made Simple</h3>
            <p className="text-muted-foreground mb-6">
              Stay connected with instant messaging, announcements, and real-time notifications
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Plus className="h-5 w-5 mr-2" />
              Start New Conversation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}