import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Users, Radio, Zap, Activity } from "lucide-react";

interface RealtimeEvent {
  type: string;
  message: string;
  timestamp: string;
}

interface UserPresence {
  userId: string;
  userName: string;
  joinedAt: string;
}

export const RealtimeDemo = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [dbEvents, setDbEvents] = useState<RealtimeEvent[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [dbChannel, setDbChannel] = useState<any>(null);
  const [presenceChannel, setPresenceChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [lastActivity, setLastActivity] = useState<string>("");
  const [activityAnimation, setActivityAnimation] = useState(false);

  useEffect(() => {
    // Get current user info
    let userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    let userName = `Guest ${Math.floor(Math.random() * 1000)}`;
    let userEmail = '';
    let channelsInitialized = false;

    const initializeChannels = () => {
      if (channelsInitialized) return;
      channelsInitialized = true;

      // Broadcast channel for messages
      const newChannel = supabase.channel('demo-channel')
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          const displayName = payload.userEmail || payload.userName;
          setMessages((prev) => [...prev, `${displayName}: ${payload.text}`]);
          setLastActivity(`Message from ${displayName}`);
          setActivityAnimation(true);
          setTimeout(() => setActivityAnimation(false), 1000);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          }
        });

      setChannel(newChannel);

      // Presence channel - track who's online
      const presence = supabase.channel('online-users', {
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
            userName: u.userEmail || u.userName,
            joinedAt: u.joinedAt
          })));
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          const newUser = newPresences[0] as any;
          const displayName = newUser.userEmail || newUser.userName;
          setLastActivity(`${displayName} joined`);
          setActivityAnimation(true);
          setTimeout(() => setActivityAnimation(false), 1000);
          toast.success(`${displayName} joined the room! 👋`, {
            icon: '🟢',
          });
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          const leftUser = leftPresences[0] as any;
          const displayName = leftUser.userEmail || leftUser.userName;
          setLastActivity(`${displayName} left`);
          toast.info(`${displayName} left the room`, {
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

      // Database changes channel (listening to notes table)
      const notesChannel = supabase
        .channel('notes-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notes' },
          (payload) => {
            const eventType = payload.eventType;
            let message = '';
            
            if (eventType === 'INSERT') {
              message = `📝 New note created: "${(payload.new as any).title}"`;
            } else if (eventType === 'UPDATE') {
              message = `✏️ Note updated: "${(payload.new as any).title}"`;
            } else if (eventType === 'DELETE') {
              message = `🗑️ Note deleted (ID: ${(payload.old as any).id})`;
            }

            const event: RealtimeEvent = {
              type: eventType,
              message,
              timestamp: new Date().toLocaleTimeString()
            };

            setDbEvents((prev) => [event, ...prev].slice(0, 10)); // Keep last 10 events
            setLastActivity(message);
            setActivityAnimation(true);
            setTimeout(() => setActivityAnimation(false), 1000);
            toast.success(`Realtime: ${message}`);
          }
        )
        .subscribe();

      setDbChannel(notesChannel);
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
      if (dbChannel) supabase.removeChannel(dbChannel);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async () => {
    const message = `Message at ${new Date().toLocaleTimeString()}`;
    
    // Get current user email
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || '';
    const userName = userEmail || onlineUsers.find(u => u.userId === presenceChannel?.clientId)?.userName || 'You';
    
    channel?.send({
      type: 'broadcast',
      event: 'message',
      payload: { text: message, userName, userEmail },
    });
    toast.success("Message broadcasted to all users! 📡");
  };

  const clearMessages = () => {
    setMessages([]);
    setDbEvents([]);
    toast.info("Messages cleared");
  };

  return (
    <div className="space-y-4">
      {/* Status Bar with Live Indicators */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Radio className={`w-4 h-4 text-green-500 ${isConnected ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium text-green-400">
              {isConnected ? 'Live Connection' : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Real-time Active' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Online Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">{onlineUsers.length}</span>
            <span className="text-xs text-muted-foreground">
              {onlineUsers.length === 1 ? 'person' : 'people'} online
            </span>
          </div>
        </div>
      </div>

      {/* Live Activity Indicator */}
      {lastActivity && (
        <div className={`p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 transition-all ${activityAnimation ? 'scale-105 shadow-lg' : ''}`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 text-purple-400 ${activityAnimation ? 'animate-bounce' : ''}`} />
            <div>
              <p className="text-xs font-medium text-purple-400">Live Activity</p>
              <p className="text-xs text-muted-foreground">{lastActivity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Online Users List */}
      {onlineUsers.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="text-xs font-medium">Who's Here:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {onlineUsers.map((user, i) => (
              <Badge key={i} variant="secondary" className="text-xs flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="truncate max-w-[200px]" title={user.userName}>
                  {user.userName}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={clearMessages}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-4">
        {/* Broadcast Messages */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Broadcast Messages</h4>
            <Badge variant="secondary">Channel</Badge>
          </div>
          <Button onClick={sendMessage} className="w-full">
            Broadcast Message
          </Button>
          <div className="p-4 rounded-lg bg-code-bg border border-code-border max-h-32 overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2">
              💡 Open this page in multiple tabs to see messages appear everywhere!
            </p>
            {messages.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No messages yet...</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="text-xs text-primary mb-1">
                  📨 {msg}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Database Changes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Database Changes</h4>
            <Badge variant="secondary">Postgres Changes</Badge>
          </div>
          <div className="p-4 rounded-lg bg-code-bg border border-code-border max-h-48 overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2">
              💡 Create, update, or delete notes in the Database tab to see real-time events!
            </p>
            {dbEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Listening for changes... Try creating a note in the Database section!
              </p>
            ) : (
              dbEvents.map((event, i) => (
                <div key={i} className="text-xs mb-2 p-2 rounded bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs h-5">
                      {event.type}
                    </Badge>
                    <span className="text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-primary">{event.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20">
        <p className="text-sm font-bold text-blue-400 mb-2">🧪 How to Test Realtime:</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">1</Badge>
            <div>
              <p className="text-xs font-medium text-blue-300">Test Presence</p>
              <p className="text-xs text-muted-foreground">Open this page in 2+ tabs → Watch user count increase! 📈</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">2</Badge>
            <div>
              <p className="text-xs font-medium text-purple-300">Test Broadcast</p>
              <p className="text-xs text-muted-foreground">Click "Broadcast Message" in one tab → See it in ALL tabs instantly! 📡</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">3</Badge>
            <div>
              <p className="text-xs font-medium text-pink-300">Test Database Changes</p>
              <p className="text-xs text-muted-foreground">Go to Database tab → Create/delete notes → Watch live events! ⚡</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-blue-500/20">
          <p className="text-xs text-blue-200 font-medium mb-1">✨ Visual Indicators:</p>
          <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
            <li>🟢 Green pulse = Live connection active</li>
            <li>👥 User count updates when people join/leave</li>
            <li>⚡ Activity box animates on every event</li>
            <li>🎯 Toast notifications for all changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
