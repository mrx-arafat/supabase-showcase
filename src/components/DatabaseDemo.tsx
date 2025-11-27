import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export const DatabaseDemo = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadNotes();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadNotes();
      } else {
        setNotes([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadNotes = async () => {
    const { data, error } = await (supabase as any)
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notes:', error);
    } else {
      setNotes(data || []);
    }
  };

  const createNote = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);
    const { error } = await (supabase as any)
      .from('notes')
      .insert({ title, content, user_id: user.id });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Note created!");
      setTitle("");
      setContent("");
      loadNotes();
    }
    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    const { error } = await (supabase as any)
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Note deleted!");
      loadNotes();
    }
  };

  if (!user) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          Please sign in to use the database features
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-secondary border-border"
        />
        <Textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-secondary border-border min-h-[80px]"
        />
        <Button onClick={createNote} disabled={loading} className="w-full">
          Create Note
        </Button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 rounded-lg bg-code-bg border border-code-border text-center">
            <p className="text-xs text-muted-foreground italic">
              No notes yet. Create your first note above!
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Run the SQL scripts in <code className="text-primary">sql-setup/</code> folder
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg bg-code-bg border border-code-border flex justify-between items-start gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{note.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteNote(note.id)}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
