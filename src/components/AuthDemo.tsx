import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const AuthDemo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for verification!");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      setUser(data.user);
      toast.success("Signed in successfully!");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Signed out successfully!");
  };

  return (
    <div className="space-y-4">
      {user ? (
        <div className="p-4 rounded-lg bg-code-bg border border-code-border">
          <p className="text-sm text-muted-foreground mb-2">Authenticated as:</p>
          <code className="text-primary text-sm">{user.email}</code>
          <Button onClick={handleSignOut} variant="outline" className="mt-4 w-full">
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button onClick={handleSignIn} disabled={loading} className="flex-1">
              Sign In
            </Button>
            <Button onClick={handleSignUp} disabled={loading} variant="outline" className="flex-1">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
