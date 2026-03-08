import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Send, Sparkles, Sun, Moon, Briefcase, Heart, GraduationCap, PartyPopper, Plane, Gem } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/store';
import { calculateBMI } from '@/lib/types';

type Msg = { role: 'user' | 'assistant'; content: string };

const OCCASIONS = [
  { label: 'Casual', icon: Sun, emoji: '☀️' },
  { label: 'Formal', icon: Briefcase, emoji: '💼' },
  { label: 'Date Night', icon: Heart, emoji: '❤️' },
  { label: 'College', icon: GraduationCap, emoji: '🎓' },
  { label: 'Party', icon: PartyPopper, emoji: '🎉' },
  { label: 'Travel', icon: Plane, emoji: '✈️' },
  { label: 'Wedding', icon: Gem, emoji: '💍' },
];

const QUICK_PROMPTS = [
  'What colors suit my skin tone?',
  'Suggest a complete outfit for today',
  'Budget-friendly styling tips',
  'Accessory recommendations',
  'How to dress for my body type?',
];

export default function StyleAdvisor() {
  const profile = getProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOccasions, setShowOccasions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const bmi = profile ? calculateBMI(profile.height, profile.weight) : null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowOccasions(false);

    let assistantSoFar = '';

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/style-advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: profile ? {
            gender: profile.gender,
            skinTone: profile.skinTone || 'not set',
            bmiCategory: bmi?.category || 'unknown',
            lifestyle: profile.lifestyle,
            age: profile.age,
          } : {},
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Something went wrong' }));
        setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, ${err.error || 'something went wrong'}. Please try again.` }]);
        setLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const askOccasion = (occasion: string) => {
    sendMessage(`Suggest a complete outfit for a ${occasion.toLowerCase()} occasion. Include clothing, colors, shoes, and accessories.`);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <PageHeader title="Style Advisor" showBack />

      <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-3">
        {/* Welcome */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-3">
              <Shirt size={32} className="text-accent" />
            </div>
            <h2 className="text-xl font-bold font-display text-foreground">Your Personal Stylist ✨</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              Get outfit suggestions tailored to your skin tone, body type & occasion
            </p>
            {profile?.skinTone && (
              <p className="text-xs text-primary mt-2 font-medium">
                Styling for: {profile.skinTone} skin tone · {profile.gender}
              </p>
            )}
          </motion.div>
        )}

        {/* Occasions Grid */}
        <AnimatePresence>
          {showOccasions && messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-medium text-foreground mb-2">Pick an occasion:</p>
              <div className="grid grid-cols-2 gap-2">
                {OCCASIONS.map(({ label, icon: Icon, emoji }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => askOccasion(label)}
                    className="glass-card rounded-xl p-3 flex items-center gap-2 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{emoji} {label}</span>
                  </motion.button>
                ))}
              </div>

              <p className="text-sm font-medium text-foreground mt-4 mb-2">Or ask anything:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'glass-card text-foreground rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-sm">Styling your look...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-background">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about outfits, colors, accessories..."
            className="flex-1 h-11 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-accent/50"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || loading} className="h-11 w-11 rounded-xl bg-accent hover:bg-accent/90">
            <Send size={18} />
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
