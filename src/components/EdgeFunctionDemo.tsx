import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Zap, Clock, Code } from "lucide-react";

interface EdgeFunctionResponse {
  message?: string;
  timestamp?: string;
  features?: string[];
  name?: string;
  [key: string]: unknown;
}

export const EdgeFunctionDemo = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<EdgeFunctionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callFunction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const loadingToast = toast.loading("⏳ Calling edge function...");
    
    try {
      // For self-hosted Supabase, call the function directly via fetch
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // Ensure URL doesn't have trailing slash
      const cleanUrl = baseUrl?.replace(/\/$/, '') || '';
      const url = `${cleanUrl}/functions/v1/hello-world`;
      
      console.log("Calling function at:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name || 'World' }),
      });

      console.log("Response status:", response.status);
      
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        // If function not deployed, show helpful message
        if (response.status === 404) {
          throw new Error("Edge Function not deployed. See troubleshooting guide for setup instructions.");
        }
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(`Server Error: ${errorData.error || errorData.msg || response.statusText}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = JSON.parse(responseText);
      
      setResult(data);
      toast.success("🎉 Function executed successfully!", { id: loadingToast });
      console.log('Edge Function Response:', data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to call edge function';
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`, { id: loadingToast });
      console.error('Edge Function Error:', error);
      
      // Offer demo mode as fallback
      if (errorMsg.includes("not deployed") || errorMsg.includes("404")) {
        toast.info('💡 Function not deployed yet? Check EDGE_FUNCTION_TROUBLESHOOTING.md', {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      callFunction();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Main Input Card */}
      <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl">Edge Function Test</CardTitle>
          </div>
          <CardDescription className="text-base">
            Test your serverless function running on the edge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name-input" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Your Name
            </label>
            <Input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name (or leave blank)"
              className="h-12 text-base border-2 focus:border-primary transition-colors"
              disabled={loading}
            />
          </div>
          
          <Button 
            onClick={callFunction} 
            disabled={loading} 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Executing Function...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Call Edge Function
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 animate-in slide-in-from-top duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 h-8 w-8 animate-ping text-blue-400 dark:text-blue-600 opacity-20">
                  <Loader2 className="h-8 w-8" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                  Processing Request
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Invoking serverless function on Supabase edge network...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-300 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950 dark:to-red-900/50 animate-in slide-in-from-top duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-red-900 dark:text-red-100 mb-1">
                  Execution Failed
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {result && !loading && !error && (
        <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
          {/* Main Success Card */}
          <Card className="border-green-300 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950 dark:to-emerald-900/50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-2">
                    Success! Function Executed
                  </h3>
                  <p className="text-base text-green-800 dark:text-green-200 font-medium">
                    {result.message || 'Function executed successfully'}
                  </p>
                </div>
              </div>
              
              {/* Timestamp */}
              {result.timestamp && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Executed at: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Card */}
          {result.features && Array.isArray(result.features) && (
            <Card className="border-purple-300 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-100/50 dark:from-purple-950 dark:to-violet-900/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-lg">Edge Function Capabilities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.features.map((feature: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0" />
                      <span className="text-sm text-purple-900 dark:text-purple-100 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* JSON Response Card */}
          <Card className="border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <CardTitle className="text-lg">Raw JSON Response</CardTitle>
              </div>
              <CardDescription>
                Full API response from the edge function
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
