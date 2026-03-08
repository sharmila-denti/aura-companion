import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Droplets, Heart, Smile, Frown, Meh, Bell, ShieldCheck, AlertTriangle, Sparkles, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { addPeriodEntry, getPeriodEntries } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

const moods = [
  { value: 'happy', icon: Smile, label: 'Happy', color: 'text-wellness' },
  { value: 'neutral', icon: Meh, label: 'Okay', color: 'text-nutrition' },
  { value: 'sad', icon: Frown, label: 'Low', color: 'text-cycle' },
];

const symptomsList = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Mood Swings', 'Cravings', 'Back Pain', 'Breast Tenderness'];

const careTips: Record<string, { icon: typeof ShieldCheck; tip: string; color: string }> = {
  Cramps: { icon: ShieldCheck, tip: 'Apply a warm compress to your lower abdomen. Try gentle stretching or yoga.', color: 'text-destructive' },
  Headache: { icon: AlertTriangle, tip: 'Stay hydrated, rest in a dark room, and avoid screens. Try peppermint oil.', color: 'text-nutrition' },
  Bloating: { icon: ShieldCheck, tip: 'Avoid salty foods and carbonated drinks. Drink warm water with lemon.', color: 'text-wellness' },
  Fatigue: { icon: ShieldCheck, tip: 'Get extra sleep, eat iron-rich foods, and take short walks for energy.', color: 'text-fitness' },
  'Mood Swings': { icon: Heart, tip: 'Practice deep breathing. Journal your feelings. Reach out to someone you trust.', color: 'text-cycle' },
  Cravings: { icon: Sparkles, tip: 'Opt for dark chocolate or fruits. Keep healthy snacks nearby.', color: 'text-beauty' },
  'Back Pain': { icon: ShieldCheck, tip: 'Use a heating pad on your lower back. Gentle back stretches can help.', color: 'text-destructive' },
  'Breast Tenderness': { icon: ShieldCheck, tip: 'Wear a supportive bra. Reduce caffeine intake during this phase.', color: 'text-accent' },
};

const moodCareTips: Record<string, string> = {
  happy: '💛 Great mood! Keep it up — light exercise and socializing can maintain your energy.',
  neutral: '🧡 Feeling okay is perfectly fine. Gentle self-care like a warm bath can lift your spirits.',
  sad: '💜 It\'s okay to feel low. Be gentle with yourself — rest, comfort food, and cozy activities help.',
};

const generalPeriodCare = [
  '🌸 Stay hydrated — drink at least 8 glasses of water daily',
  '🍫 Eat iron-rich foods like spinach, lentils, and dark chocolate',
  '🧘 Practice gentle yoga or stretching to ease discomfort',
  '😴 Prioritize sleep — aim for 7-9 hours',
  '🛁 Warm baths can soothe cramps and relax muscles',
  '🚫 Avoid excessive caffeine and alcohol',
];

export default function CycleTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [showNotifications, setShowNotifications] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const entries = getPeriodEntries();

  const lastPeriod = entries.length > 0 ? entries[entries.length - 1] : null;

  // Build dates for calendar highlighting
  const periodDates = useMemo(() => {
    return entries.map(e => new Date(e.startDate));
  }, [entries]);

  const prediction = useMemo(() => {
    if (entries.length < 2) return null;
    const diffs: number[] = [];
    for (let i = 1; i < entries.length; i++) {
      const diff = Math.round(
        (new Date(entries[i].startDate).getTime() - new Date(entries[i - 1].startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      diffs.push(diff);
    }
    const avgCycle = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    if (!lastPeriod) return null;
    const nextDate = new Date(lastPeriod.startDate);
    nextDate.setDate(nextDate.getDate() + avgCycle);
    const ovulationDate = new Date(lastPeriod.startDate);
    ovulationDate.setDate(ovulationDate.getDate() + avgCycle - 14);
    return { nextDate, avgCycle, ovulationDate };
  }, [entries, lastPeriod]);

  const logPeriod = () => {
    addPeriodEntry({
      startDate: new Date().toISOString().split('T')[0],
      symptoms: selectedSymptoms,
      mood: selectedMood || 'neutral',
      flow,
    });
    toast.success('Period logged! 🌸');
    setShowNotifications(true);
  };

  const daysSince = lastPeriod
    ? Math.round((Date.now() - new Date(lastPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const activeNotifications = [
    ...(selectedMood && moodCareTips[selectedMood] ? [{ type: 'mood', text: moodCareTips[selectedMood] }] : []),
    ...selectedSymptoms.map(s => ({
      type: 'symptom',
      symptom: s,
      text: careTips[s]?.tip || '',
      color: careTips[s]?.color || 'text-muted-foreground',
    })),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Cycle Tracker" subtitle="Track your menstrual health" showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-6 text-center text-primary-foreground">
          <CalendarIcon size={28} className="mx-auto mb-2 opacity-60" />
          {daysSince !== null ? (
            <>
              <p className="text-4xl font-bold font-display">{daysSince}</p>
              <p className="text-sm opacity-80">days since last period</p>
            </>
          ) : (
            <p className="text-sm opacity-80">No period logged yet</p>
          )}
          {prediction && (
            <div className="mt-4 bg-primary-foreground/15 rounded-xl p-3">
              <p className="text-xs opacity-70">Next period predicted</p>
              <p className="font-semibold">{prediction.nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              <p className="text-xs opacity-70 mt-1">
                Ovulation: {prediction.ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Cycle: {prediction.avgCycle} days
              </p>
            </div>
          )}
        </motion.div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className="glass-card rounded-2xl p-4">
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <CalendarIcon size={18} className="text-cycle" /> Period Calendar
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="pointer-events-auto"
              modifiers={{
                period: periodDates,
                predicted: prediction ? [prediction.nextDate] : [],
                ovulation: prediction ? [prediction.ovulationDate] : [],
              }}
              modifiersStyles={{
                period: { backgroundColor: 'hsl(300 40% 55%)', color: 'white', borderRadius: '50%' },
                predicted: { backgroundColor: 'hsl(300 40% 55% / 0.3)', border: '2px dashed hsl(300 40% 55%)', borderRadius: '50%' },
                ovulation: { backgroundColor: 'hsl(150 45% 50% / 0.3)', border: '2px dashed hsl(150 45% 50%)', borderRadius: '50%' },
              }}
            />
          </div>
          <div className="flex gap-4 justify-center mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-cycle inline-block" /> Period</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-dashed border-cycle inline-block" /> Predicted</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-dashed border-wellness inline-block" /> Ovulation</span>
          </div>
        </motion.div>

        {/* Flow */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <Droplets size={18} className="text-cycle" /> Flow
          </h3>
          <div className="flex gap-2">
            {(['light', 'medium', 'heavy'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFlow(f)}
                className={`flex-1 h-11 rounded-xl text-sm font-medium transition-all ${
                  flow === f ? 'bg-cycle text-cycle-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mood */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <Heart size={18} className="text-cycle" /> Mood
          </h3>
          <div className="flex gap-3 justify-center">
            {moods.map(({ value, icon: Icon, label, color }) => (
              <button
                key={value}
                onClick={() => setSelectedMood(value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedMood === value ? 'bg-cycle/15 scale-110' : ''
                }`}
              >
                <Icon size={28} className={selectedMood === value ? color : 'text-muted-foreground'} />
                <span className={`text-xs font-medium ${selectedMood === value ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              </button>
            ))}
          </div>
          {/* Mood notification inline */}
          <AnimatePresence>
            {selectedMood && moodCareTips[selectedMood] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-cycle/10 rounded-xl p-3 text-sm text-foreground"
              >
                {moodCareTips[selectedMood]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Symptoms */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground mb-3">Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {symptomsList.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSymptoms.includes(s) ? 'bg-cycle text-cycle-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Symptom care tips inline */}
          <AnimatePresence>
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {selectedSymptoms.map(s => {
                  const care = careTips[s];
                  if (!care) return null;
                  const Icon = care.icon;
                  return (
                    <div key={s} className="flex items-start gap-2 bg-accent/10 rounded-xl p-3">
                      <Icon size={16} className={`${care.color} mt-0.5 shrink-0`} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{s}</p>
                        <p className="text-xs text-muted-foreground">{care.tip}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* General Period Care */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <Bell size={18} className="text-cycle" /> Period Care Tips
          </h3>
          <div className="space-y-2">
            {generalPeriodCare.map((tip, i) => (
              <div key={i} className="bg-secondary/60 rounded-xl px-3 py-2 text-xs text-foreground">
                {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notification Panel after logging */}
        <AnimatePresence>
          {showNotifications && activeNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-2xl p-5 border-2 border-cycle/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-display text-foreground flex items-center gap-2">
                  <Bell size={18} className="text-cycle" /> Your Care Notifications
                </h3>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2">
                {activeNotifications.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-cycle/10 rounded-xl p-3 text-sm text-foreground"
                  >
                    {n.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={logPeriod}
          className="w-full h-14 rounded-2xl gradient-warm text-primary-foreground font-semibold text-base border-0"
        >
          Log Period 🌸
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
