import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Users, Send, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  text: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  userId: string;
}

interface UserPresence {
  userId: string;
  userName: string;
  userEmail: string;
}

export const ChatDemo = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [channel, setChannel] = useState<any>(null);
  const [presenceChannel, setPresenceChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user info
    let userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    let userName = `Guest ${Math.floor(Math.random() * 1000)}`;
    let userEmail = '';
    let channelsInitialized = false;

    const initializeChannels = () => {
      if (channelsInitialized) return;
      channelsInitialized = true;

      // Set current user
      setCurrentUser({ id: userId, email: userEmail, name: userName });

      // Chat channel for messages (with self-receive enabled)
      const chatChannel = supabase.channel('public-chat', {
        config: {
          broadcast: {
            self: true, // This enables receiving your own messages!
          },
        },
      })
        .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
          const newMessage: ChatMessage = {
            id: `${payload.userId}-${payload.timestamp}`,
            text: payload.text,
            userName: payload.userName,
            userEmail: payload.userEmail,
            timestamp: payload.timestamp,
            userId: payload.userId,
          };
          setMessages((prev) => [...prev, newMessage]);
          
          // Auto-scroll to bottom
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, 100);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            toast.success("Connected to chat! 💬");
          }
        });

      setChannel(chatChannel);

      // Presence channel - track who's online
      const presence = supabase.channel('chat-users', {
        config: {
          presence: {
            key: userId,
          },
        },
      });

      presence
        .on('presence', { event: 'sync' }, () => {
          const state = presence.presenceState();
          const users = Object.values(state).flat() as any[];
          setOnlineUsers(users.map(u => ({
            userId: u.userId,
            userName: u.userName,
            userEmail: u.userEmail,
          })));
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          const newUser = newPresences[0] as any;
          const displayName = newUser.userEmail || newUser.userName;
          toast.success(`${displayName} joined the chat! 👋`, {
            icon: '🟢',
          });
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          const leftUser = leftPresences[0] as any;
          const displayName = leftUser.userEmail || leftUser.userName;
          toast.info(`${displayName} left the chat`, {
            icon: '🔴',
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presence.track({
              userId,
              userName,
              userEmail,
              joinedAt: new Date().toISOString(),
            });
          }
        });

      setPresenceChannel(presence);
    };

    // Get user session and initialize
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email || '';
        userName = userEmail || `User ${session.user.id.slice(0, 8)}`;
      }
      initializeChannels();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (!messageInput.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!channel) {
      toast.error("Not connected to chat");
      return;
    }

    channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: {
        text: messageInput.trim(),
        userName: currentUser?.name || 'Anonymous',
        userEmail: currentUser?.email || '',
        timestamp: new Date().toISOString(),
        userId: currentUser?.id || 'unknown',
      },
    });

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearAllMessages = () => {
    setMessages([]);
    toast.success("Chat cleared! 🧹");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className={`w-4 h-4 text-green-500 ${isConnected ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium text-green-400">
              {isConnected ? 'Chat Active' : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Real-time' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">{onlineUsers.length}</span>
            <span className="text-xs text-muted-foreground">
              {onlineUsers.length === 1 ? 'user' : 'users'}
            </span>
          </div>
        </div>
      </div>

      {/* Current User Info */}
      {currentUser && (
        <div className="p-2 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            You're chatting as: <span className="text-primary font-medium">{currentUser.email || currentUser.name}</span>
          </p>
        </div>
      )}

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3 h-3 text-green-500" />
            <span className="text-xs font-medium">Online Now:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {onlineUsers.map((user, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                {user.userEmail || user.userName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="p-4 rounded-lg bg-code-bg border border-code-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Chat Messages ({messages.length})</p>
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllMessages}
              className="h-6 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        <ScrollArea className="h-80 pr-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground">Be the first to say hello! 👋</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isCurrentUser = msg.userId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted border border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          isCurrentUser ? 'text-primary-foreground/90' : 'text-primary'
                        }`}>
                          {msg.userEmail || msg.userName}
                        </span>
                        <span className={`text-xs ${
                          isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        isCurrentUser ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-secondary border-border"
          disabled={!isConnected}
        />
        <Button 
          onClick={sendMessage} 
          disabled={!isConnected || !messageInput.trim()}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20">
        <p className="text-sm font-bold text-purple-400 mb-2">💬 Real-time Chat Features:</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">✨</Badge>
            <div>
              <p className="text-xs font-medium text-purple-300">Instant Messaging</p>
              <p className="text-xs text-muted-foreground">Messages appear instantly across all connected users!</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">👥</Badge>
            <div>
              <p className="text-xs font-medium text-pink-300">User Presence</p>
              <p className="text-xs text-muted-foreground">See who's online in real-time with join/leave notifications</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">🔐</Badge>
            <div>
              <p className="text-xs font-medium text-blue-300">User Identity</p>
              <p className="text-xs text-muted-foreground">Sign in to show your email, or chat as a guest</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <p className="text-xs text-purple-200 font-medium mb-1">🧪 Test it out:</p>
          <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
            <li>📱 Open this page in multiple tabs or devices</li>
            <li>💬 Send messages and watch them sync instantly</li>
            <li>👋 See join/leave notifications when users connect</li>
            <li>⚡ Messages are color-coded (yours vs others)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
