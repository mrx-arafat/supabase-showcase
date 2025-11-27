import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const RealtimeDemo = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const newChannel = supabase.channel('demo-channel')
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((prev) => [...prev, payload.text]);
      })
      .subscribe();

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, []);

  const sendMessage = () => {
    const message = `Message at ${new Date().toLocaleTimeString()}`;
    channel?.send({
      type: 'broadcast',
      event: 'message',
      payload: { text: message },
    });
    toast.success("Message broadcasted!");
  };

  return (
    <div className="space-y-4">
      <Button onClick={sendMessage} className="w-full">
        Broadcast Message
      </Button>
      
      <div className="p-4 rounded-lg bg-code-bg border border-code-border max-h-40 overflow-y-auto">
        <p className="text-sm text-muted-foreground mb-2">Real-time messages:</p>
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No messages yet...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="text-xs text-primary mb-1">
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
