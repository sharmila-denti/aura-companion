import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplet, Sun, CloudRain } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { addTrackerEntry, getTrackerEntries } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const skinConditions = ['Clear', 'Oily', 'Dry', 'Acne', 'Pigmentation', 'Redness'];
const routineSteps = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Eye Cream'];

export default function BeautyTracker() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const todayEntries = getTrackerEntries('skincare').filter(e => e.date === today);

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleStep = (s: string) => {
    setCompletedSteps(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const logRoutine = () => {
    addTrackerEntry({
      date: today,
      type: 'skincare',
      value: completedSteps.length,
      notes: `Conditions: ${selectedConditions.join(', ')}. Steps: ${completedSteps.join(', ')}`,
    });
    toast.success('Skincare routine logged! ✨');
    setSelectedConditions([]);
    setCompletedSteps([]);
  };

  const tips = [
    { icon: Sun, title: 'Morning Routine', desc: 'Cleanse → Tone → Serum → Moisturize → SPF' },
    { icon: CloudRain, title: 'Night Routine', desc: 'Double cleanse → Tone → Treatment → Night cream' },
    { icon: Droplet, title: 'Hydration', desc: 'Drink 8 glasses of water for glowing skin' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Beauty Tracker" subtitle="Track your skincare journey" showBack />

      <div className="px-5 mt-4 space-y-6">
        {/* Skin Condition */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-beauty" /> Today's Skin
          </h3>
          <div className="flex flex-wrap gap-2">
            {skinConditions.map(c => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedConditions.includes(c)
                    ? 'bg-beauty text-beauty-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Routine Checklist */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground mb-3">Routine Checklist</h3>
          <div className="space-y-2">
            {routineSteps.map(s => (
              <button
                key={s}
                onClick={() => toggleStep(s)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  completedSteps.includes(s) ? 'bg-beauty/10' : 'bg-secondary'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  completedSteps.includes(s) ? 'border-beauty bg-beauty' : 'border-muted-foreground'
                }`}>
                  {completedSteps.includes(s) && <span className="text-beauty-foreground text-xs">✓</span>}
                </div>
                <span className={`text-sm font-medium ${completedSteps.includes(s) ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              </button>
            ))}
          </div>
          <Button
            onClick={logRoutine}
            disabled={completedSteps.length === 0}
            className="w-full mt-4 h-12 rounded-xl gradient-warm text-primary-foreground border-0"
          >
            Log Routine
          </Button>
        </motion.div>

        {/* Tips */}
        <div className="space-y-3">
          <h3 className="font-bold font-display text-foreground">Skincare Tips</h3>
          {tips.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="glass-card rounded-xl p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-beauty/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-beauty" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
