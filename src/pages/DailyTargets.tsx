import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Star, Lock, Unlock, Flame, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';
import {
  getDailyTargets, completeTarget, getGamificationState,
  getUnlockedFeatures, getLevelFromPoints, getPointsForNextLevel,
  DailyTarget, GamificationState, UnlockableFeature,
} from '@/lib/gamification';
import { toast } from 'sonner';

export default function DailyTargets() {
  const [targets, setTargets] = useState<DailyTarget[]>([]);
  const [state, setState] = useState<GamificationState | null>(null);
  const [unlockables, setUnlockables] = useState<UnlockableFeature[]>([]);
  const [showUnlocks, setShowUnlocks] = useState(false);

  useEffect(() => {
    setTargets(getDailyTargets());
    setState(getGamificationState());
    setUnlockables(getUnlockedFeatures());
  }, []);

  if (!state) return null;

  const completedCount = targets.filter(t => t.completed).length;
  const progress = targets.length ? (completedCount / targets.length) * 100 : 0;
  const nextLevelPoints = getPointsForNextLevel(state.level);
  const levelProgress = ((state.totalPoints % 100) / 100) * 100;

  const handleComplete = (id: string) => {
    const result = completeTarget(id);
    if (!result) return;
    setTargets(getDailyTargets());
    setState(result.newState);
    setUnlockables(getUnlockedFeatures());
    toast.success(`+${result.target.points} points! 🎉`, {
      description: result.target.label,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Daily Targets" showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Stats Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-80">Level {state.level}</p>
              <p className="text-3xl font-bold font-display">{state.totalPoints}</p>
              <p className="text-xs opacity-70">Total Points</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Flame size={16} />
                <span className="text-lg font-bold">{state.streak}</span>
                <span className="text-xs opacity-70">streak</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} />
                <span className="text-xs opacity-80">+{state.dailyPointsToday} today</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs opacity-70 mb-1">
              <span>Level {state.level}</span>
              <span>Level {state.level + 1}</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-primary-foreground/20" />
            <p className="text-xs opacity-60 mt-1">{nextLevelPoints - (state.totalPoints % 100)} pts to next level</p>
          </div>
        </motion.div>

        {/* Today's Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold font-display text-foreground flex items-center gap-2">
              <Target size={18} className="text-primary" /> Today's Progress
            </h3>
            <span className="text-sm font-medium text-primary">{completedCount}/{targets.length}</span>
          </div>
          <Progress value={progress} className="h-3 mb-1" />
          <p className="text-xs text-muted-foreground">{progress === 100 ? 'All targets completed! 🎉' : `${targets.length - completedCount} targets remaining`}</p>
        </motion.div>

        {/* Targets List */}
        <div className="space-y-2">
          <h3 className="font-bold font-display text-foreground">Your Targets</h3>
          <AnimatePresence>
            {targets.map((target, i) => (
              <motion.button
                key={target.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => !target.completed && handleComplete(target.id)}
                disabled={target.completed}
                className={`w-full glass-card rounded-xl p-4 flex items-center gap-3 text-left transition-all ${
                  target.completed ? 'opacity-60' : 'active:scale-[0.98]'
                }`}
              >
                <span className="text-2xl">{target.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${target.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {target.label}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{target.category}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {target.completed ? (
                    <span className="text-xs font-bold text-primary">✓ Done</span>
                  ) : (
                    <span className="text-xs font-bold text-accent">+{target.points}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Unlockable Features */}
        <div className="space-y-2">
          <button
            onClick={() => setShowUnlocks(!showUnlocks)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-bold font-display text-foreground flex items-center gap-2">
              <Trophy size={18} className="text-accent" /> Rewards & Unlockables
            </h3>
            <ChevronRight size={16} className={`text-muted-foreground transition-transform ${showUnlocks ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {showUnlocks && unlockables.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`glass-card rounded-xl p-4 flex items-center gap-3 ${feature.unlocked ? '' : 'opacity-50'}`}
              >
                <span className="text-2xl">{feature.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    {feature.label}
                    {feature.unlocked ? <Unlock size={12} className="text-primary" /> : <Lock size={12} className="text-muted-foreground" />}
                  </p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
                <span className={`text-xs font-bold ${feature.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {feature.unlocked ? 'Unlocked!' : `${feature.requiredPoints} pts`}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
