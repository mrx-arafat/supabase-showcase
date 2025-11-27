import { Shield, Database, Zap, Radio } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { AuthDemo } from "@/components/AuthDemo";
import { DatabaseDemo } from "@/components/DatabaseDemo";
import { StorageDemo } from "@/components/StorageDemo";
import { EdgeFunctionDemo } from "@/components/EdgeFunctionDemo";
import { RealtimeDemo } from "@/components/RealtimeDemo";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              Supabase Learning Platform
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Interactive demos showcasing Authentication, Storage, Edge Functions, and Realtime features
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm text-primary font-mono">Powered by Lovable Cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={Shield}
            title="Authentication"
            description="Complete user management system with email/password authentication"
          >
            <AuthDemo />
          </FeatureCard>

          <FeatureCard
            icon={Database}
            title="Database & Tables"
            description="Create tables with RLS policies for secure data management"
          >
            <DatabaseDemo />
          </FeatureCard>

          <FeatureCard
            icon={Database}
            title="Storage"
            description="Store and manage files with secure bucket access"
          >
            <StorageDemo />
          </FeatureCard>

          <FeatureCard
            icon={Zap}
            title="Edge Functions"
            description="Run serverless functions at the edge for custom backend logic"
          >
            <EdgeFunctionDemo />
          </FeatureCard>

          <FeatureCard
            icon={Radio}
            title="Realtime"
            description="Listen to database changes and broadcast messages in real-time"
          >
            <RealtimeDemo />
          </FeatureCard>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>Built with Lovable Cloud • Learn Supabase features hands-on</p>
      </footer>
    </div>
  );
};

export default Index;
