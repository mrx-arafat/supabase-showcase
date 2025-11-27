import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EdgeFunctionDemo = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callFunction = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('hello-world');
      
      if (error) throw error;
      
      setResult(JSON.stringify(data, null, 2));
      toast.success("Function executed successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={callFunction} disabled={loading} className="w-full">
        Call Edge Function
      </Button>
      
      {result && (
        <div className="p-4 rounded-lg bg-code-bg border border-code-border">
          <p className="text-sm text-muted-foreground mb-2">Function response:</p>
          <pre className="text-primary text-xs overflow-x-auto">{result}</pre>
        </div>
      )}
    </div>
  );
};
