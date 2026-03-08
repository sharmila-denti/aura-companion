import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, Heart, Smile, Frown, Meh } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { addPeriodEntry, getPeriodEntries } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const moods = [
  { value: 'happy', icon: Smile, label: 'Happy' },
  { value: 'neutral', icon: Meh, label: 'Okay' },
  { value: 'sad', icon: Frown, label: 'Low' },
];

const symptomsList = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Mood Swings', 'Cravings', 'Back Pain', 'Breast Tenderness'];

export default function CycleTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const entries = getPeriodEntries();

  const lastPeriod = entries.length > 0 ? entries[entries.length - 1] : null;

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
    setSelectedSymptoms([]);
    setSelectedMood('');
  };

  const daysSince = lastPeriod
    ? Math.round((Date.now() - new Date(lastPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Cycle Tracker" subtitle="Track your menstrual health" showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-6 text-center text-primary-foreground">
          <Calendar size={28} className="mx-auto mb-2 opacity-60" />
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
            {moods.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setSelectedMood(value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedMood === value ? 'bg-cycle/15' : ''
                }`}
              >
                <Icon size={28} className={selectedMood === value ? 'text-cycle' : 'text-muted-foreground'} />
                <span className={`text-xs font-medium ${selectedMood === value ? 'text-cycle' : 'text-muted-foreground'}`}>{label}</span>
              </button>
            ))}
          </div>
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
        </motion.div>

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
