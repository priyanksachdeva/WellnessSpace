import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Phone, 
  AlertTriangle,
  LogOut,
  Menu,
  Plus,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Quick response suggestions for mental health
  const quickResponses = [
    "I'm feeling anxious",
    "I'm stressed about studies", 
    "I'm feeling lonely",
    "I need someone to talk to",
    "Help me with coping strategies"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
    } else {
      setConversations(data || []);
    }
  };

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: user?.id,
        title: 'New Conversation'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive"
      });
    } else {
      setCurrentConversation(data.id);
      setMessages([]);
      loadConversations();
      
      // Add welcome message
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: "Hi! I'm here to listen and support you. Everything we discuss is confidential. How are you feeling today?",
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  };

  const loadConversation = async (conversationId: string) => {
    setCurrentConversation(conversationId);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      // Type assertion to ensure role matches our Message interface
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant' | 'system'
      }));
      setMessages(typedMessages);
    }
    setShowSidebar(false);
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || loading) return;

    // Create conversation if none exists
    let conversationId = currentConversation;
    if (!conversationId) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user?.id,
          title: messageContent.slice(0, 50)
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive"
        });
        return;
      }
      conversationId = data.id;
      setCurrentConversation(conversationId);
      loadConversations();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: messageContent
      });

    try {
      // Call AI function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { message: messageContent }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to get AI response");
      }

      const aiResponse = functionData?.response;
      
      if (aiResponse) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Save assistant message
        await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: aiResponse
          });

        // Update conversation timestamp
        await supabase
          .from('chat_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickResponse = (response: string) => {
    sendMessage(response);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-wellness flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-heading mb-2">Please sign in to continue</h2>
            <p className="text-muted-foreground mb-4">Access your personalized AI support companion</p>
            <Link to="/auth">
              <Button className="bg-gradient-hero hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-wellness">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border/30 transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-heading font-semibold">Chat History</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(false)}
            className="lg:hidden"
          >
            ✕
          </Button>
        </div>

        <div className="p-4">
          <Button 
            onClick={createNewConversation}
            className="w-full bg-gradient-hero hover:opacity-90 mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>

          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant={currentConversation === conversation.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => loadConversation(conversation.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate">{conversation.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(conversation.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            onClick={signOut}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center breathing">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-semibold">AI Support Companion</h1>
                  <p className="text-sm text-muted-foreground">Here to listen and support you</p>
                </div>
              </div>
            </div>

            {/* Emergency Button */}
            <Button variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10">
              <Phone className="w-4 h-4 mr-2" />
              Emergency: 988
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !currentConversation && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-primary/50 mx-auto mb-4 breathing" />
              <h2 className="font-heading text-xl mb-2">Welcome to Your Safe Space</h2>
              <p className="text-muted-foreground mb-6">
                Start a conversation whenever you need support. Everything is confidential.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-4 hover:bg-primary/5"
                    onClick={() => handleQuickResponse(response)}
                  >
                    "{response}"
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-hero text-white'
                      : 'bg-card border border-border/30 shadow-wellness'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border/30 rounded-2xl p-4 shadow-wellness">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-muted-foreground ml-2">AI is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-card border-t border-border/30 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              disabled={loading}
              className="flex-1 border-border/50 focus:border-primary"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-gradient-hero hover:opacity-90 shadow-soft px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Crisis? Call 988 or text HOME to 741741 immediately
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;