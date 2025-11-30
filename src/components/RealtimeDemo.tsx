import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Users, Radio, Zap, MessageCircle } from "lucide-react";

interface RealtimeEvent {
  type: string;
  message: string;
  timestamp: string;
}

export const RealtimeDemo = () => {
  const [dbEvents, setDbEvents] = useState<RealtimeEvent[]>([]);
  const [dbChannel, setDbChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>("");
  const [activityAnimation, setActivityAnimation] = useState(false);

  useEffect(() => {
    // Presence tracking
    const presence = supabase.channel('realtime-presence')
      .on('presence', { event: 'sync' }, () => {
        const state = presence.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await presence.track({ online_at: new Date().toISOString() });
        }
      });

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

          setDbEvents((prev) => [event, ...prev].slice(0, 10));
          setLastActivity(message);
          setActivityAnimation(true);
          setTimeout(() => setActivityAnimation(false), 1000);
          toast.success(`Realtime: ${message}`);
        }
      )
      .subscribe();

    setDbChannel(notesChannel);

    return () => {
      supabase.removeChannel(presence);
      if (dbChannel) supabase.removeChannel(dbChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearEvents = () => {
    setDbEvents([]);
    toast.info("Events cleared");
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Radio className={`w-4 h-4 text-green-500 ${isConnected ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium text-green-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">Real-time Active</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Watching</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">{onlineCount}</span>
            <span className="text-xs text-muted-foreground">users</span>
          </div>
        </div>
      </div>

      {/* Live Activity */}
      {lastActivity && (
        <div className={`p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 transition-all ${activityAnimation ? 'scale-105' : ''}`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 text-purple-400 ${activityAnimation ? 'animate-bounce' : ''}`} />
            <p className="text-xs text-purple-300">{lastActivity}</p>
          </div>
        </div>
      )}

      {/* Database Events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Database Events
          </h4>
          {dbEvents.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearEvents} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="p-4 rounded-lg bg-code-bg border border-code-border max-h-64 overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3">
            💡 Create or delete notes in the Database section to see live updates!
          </p>
          {dbEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Listening for database changes...
            </p>
          ) : (
            <div className="space-y-2">
              {dbEvents.map((event, i) => (
                <div key={i} className="text-xs p-2 rounded bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs h-5">
                      {event.type}
                    </Badge>
                    <span className="text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-primary">{event.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300 mb-2">
          🎯 <strong>What's happening:</strong>
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
          <li>Open multiple tabs to see the user count increase</li>
          <li>Create/delete notes in Database tab → See events here instantly</li>
          <li>All connected users see the same events in real-time</li>
        </ul>
      </div>
    </div>
  );
};
