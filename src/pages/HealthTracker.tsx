import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Moon, Footprints, Pill, Plus, Minus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { addTrackerEntry, getTrackerEntries } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function HealthTracker() {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = getTrackerEntries().filter(e => e.date === today);
  const waterCount = todayEntries.filter(e => e.type === 'water').length;
  const [sleep, setSleep] = useState('');
  const [steps, setSteps] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const symptomList = ['Headache', 'Fatigue', 'Nausea', 'Back Pain', 'Bloating', 'Stress', 'Cramps', 'Dizziness'];

  const addWater = () => {
    addTrackerEntry({ date: today, type: 'water', value: 1 });
    toast.success('💧 +1 glass of water!');
    window.location.reload();
  };

  const logSleep = () => {
    if (!sleep) return;
    addTrackerEntry({ date: today, type: 'sleep', value: parseFloat(sleep) });
    toast.success(`😴 ${sleep} hours logged`);
    setSleep('');
  };

  const logSteps = () => {
    if (!steps) return;
    addTrackerEntry({ date: today, type: 'steps', value: parseInt(steps) });
    toast.success(`🚶 ${steps} steps logged`);
    setSteps('');
  };

  const logSymptoms = () => {
    if (symptoms.length === 0) return;
    addTrackerEntry({ date: today, type: 'symptoms', value: symptoms.length, notes: symptoms.join(', ') });
    toast.success('Symptoms logged');
    setSymptoms([]);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Health Tracker" subtitle="Monitor your daily wellness" showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Water */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={20} className="text-fitness" />
              <h3 className="font-bold font-display text-foreground">Hydration</h3>
            </div>
            <span className="text-2xl font-bold font-display text-fitness">{waterCount}/8</span>
          </div>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-3 rounded-full transition-all ${
                  i < waterCount ? 'bg-fitness' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
          <Button onClick={addWater} className="w-full h-11 rounded-xl bg-fitness/10 text-fitness hover:bg-fitness/20 border-0">
            <Plus size={16} className="mr-1" /> Add Glass
          </Button>
        </motion.div>

        {/* Sleep */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={20} className="text-cycle" />
            <h3 className="font-bold font-display text-foreground">Sleep</h3>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Hours slept"
              value={sleep}
              onChange={e => setSleep(e.target.value)}
              className="h-11 rounded-xl bg-secondary border-0 text-foreground"
            />
            <Button onClick={logSleep} className="h-11 rounded-xl gradient-warm text-primary-foreground border-0 px-6">Log</Button>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Footprints size={20} className="text-wellness" />
            <h3 className="font-bold font-display text-foreground">Steps</h3>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Steps count"
              value={steps}
              onChange={e => setSteps(e.target.value)}
              className="h-11 rounded-xl bg-secondary border-0 text-foreground"
            />
            <Button onClick={logSteps} className="h-11 rounded-xl gradient-warm text-primary-foreground border-0 px-6">Log</Button>
          </div>
        </motion.div>

        {/* Symptoms */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Pill size={20} className="text-accent" />
            <h3 className="font-bold font-display text-foreground">Symptoms</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {symptomList.map(s => (
              <button
                key={s}
                onClick={() => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  symptoms.includes(s) ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {symptoms.length > 0 && (
            <Button onClick={logSymptoms} className="w-full h-11 rounded-xl gradient-warm text-primary-foreground border-0">
              Log Symptoms
            </Button>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
