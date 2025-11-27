import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const StorageDemo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('demo-files')
      .upload(fileName, file);

    if (error) {
      toast.error(error.message);
    } else {
      const { data } = supabase.storage
        .from('demo-files')
        .getPublicUrl(fileName);
      
      setUploadedUrl(data.publicUrl);
      toast.success("File uploaded successfully!");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-secondary border-border"
        />
        <Button onClick={handleFileUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
      
      {uploadedUrl && (
        <div className="p-4 rounded-lg bg-code-bg border border-code-border">
          <p className="text-sm text-muted-foreground mb-2">Uploaded file URL:</p>
          <code className="text-primary text-xs break-all">{uploadedUrl}</code>
        </div>
      )}
    </div>
  );
};
