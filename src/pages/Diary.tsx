import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, BookOpen, Smile, Frown, Meh, Heart, Zap, X, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { format } from 'date-fns';

const moods = [
  { value: 'happy', icon: Smile, label: 'Happy', color: 'hsl(var(--wellness))' },
  { value: 'grateful', icon: Heart, label: 'Grateful', color: 'hsl(var(--beauty))' },
  { value: 'neutral', icon: Meh, label: 'Neutral', color: 'hsl(var(--muted-foreground))' },
  { value: 'energetic', icon: Zap, label: 'Energetic', color: 'hsl(var(--fitness))' },
  { value: 'sad', icon: Frown, label: 'Sad', color: 'hsl(var(--cycle))' },
];

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
}

export default function Diary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'Failed to load diary', variant: 'destructive' });
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const saveEntry = async () => {
    if (!content.trim()) return;

    if (editingId) {
      const { error } = await supabase
        .from('diary_entries')
        .update({ title: title || null, content, mood })
        .eq('id', editingId);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update entry', variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('diary_entries')
        .insert({ user_id: user!.id, title: title || null, content, mood });
      if (error) {
        toast({ title: 'Error', description: 'Failed to save entry', variant: 'destructive' });
        return;
      }
    }

    resetForm();
    fetchEntries();
    toast({ title: editingId ? 'Updated!' : 'Saved!', description: 'Your diary entry has been saved ✨' });
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('diary_entries').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      setEntries(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Deleted', description: 'Entry removed' });
    }
  };

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title || '');
    setContent(entry.content);
    setMood(entry.mood);
    setIsWriting(true);
  };

  const resetForm = () => {
    setIsWriting(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setMood('neutral');
  };

  const getMoodIcon = (moodValue: string) => {
    const m = moods.find(m => m.value === moodValue);
    return m || moods[2];
  };

  return (
    <div className="min-h-screen gradient-soft pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-1.5 rounded-xl hover:bg-secondary">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold font-display text-foreground">My Diary</h1>
            <p className="text-[10px] text-muted-foreground">{entries.length} entries</p>
          </div>
        </div>
        <button
          onClick={() => setIsWriting(true)}
          className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center"
        >
          <Plus size={18} className="text-primary-foreground" />
        </button>
      </div>

      {/* Write/Edit Modal */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <button onClick={resetForm} className="p-1.5">
                <X size={20} className="text-foreground" />
              </button>
              <h2 className="font-bold font-display text-foreground">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h2>
              <Button
                onClick={saveEntry}
                disabled={!content.trim()}
                size="sm"
                className="gradient-warm text-primary-foreground border-0 rounded-xl"
              >
                Save
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl bg-secondary border-0 text-foreground text-lg font-display"
              />

              {/* Mood Picker */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">How are you feeling?</p>
                <div className="flex gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        mood === m.value
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-secondary border-2 border-transparent'
                      }`}
                    >
                      <m.icon size={20} style={{ color: m.color }} />
                      <span className="text-[10px] font-medium text-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="What's on your mind today..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] rounded-xl bg-secondary border-0 text-foreground resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mb-2">Start Your Diary</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Write down your thoughts, track your mood, and reflect on your journey.
            </p>
            <Button onClick={() => setIsWriting(true)} className="gradient-warm text-primary-foreground border-0 rounded-xl">
              <Plus size={16} className="mr-2" /> Write First Entry
            </Button>
          </motion.div>
        ) : (
          entries.map((entry, i) => {
            const moodData = getMoodIcon(entry.mood);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <moodData.icon size={18} style={{ color: moodData.color }} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(entry)} className="p-1.5 rounded-lg hover:bg-secondary">
                      <Edit3 size={14} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  </div>
                </div>
                {entry.title && (
                  <h3 className="font-bold font-display text-foreground mb-1">{entry.title}</h3>
                )}
                <p className="text-sm text-foreground/80 line-clamp-3 whitespace-pre-wrap">{entry.content}</p>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
