import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Moon, Footprints, Sparkles, Heart, Dumbbell, Utensils, Calendar, Settings, Bell, Music, Target } from 'lucide-react';
import { getProfile, getTrackerEntries, addTrackerEntry } from '@/lib/store';
import { UserProfile, calculateBMI } from '@/lib/types';
import { getGenderSpecificTips } from '@/lib/notifications';
import { getGamificationState } from '@/lib/gamification';
import MetricCard from '@/components/MetricCard';
import BottomNav from '@/components/BottomNav';
import AnimatedAvatar from '@/components/AnimatedAvatar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(profile.height, profile.weight);
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = getTrackerEntries().filter(e => e.date === today);
  const waterCount = todayEntries.filter(e => e.type === 'water').length;
  const sleepEntry = todayEntries.find(e => e.type === 'sleep');
  const stepsEntry = todayEntries.find(e => e.type === 'steps');
  const isMale = profile.gender === 'male';
  const tips = getGenderSpecificTips();
  const gamification = getGamificationState();

  const addWater = () => {
    addTrackerEntry({ date: today, type: 'water', value: 1 });
    window.location.reload();
  };

  const quickActions = [
    { icon: Target, label: 'Targets', color: 'hsl(var(--accent))', path: '/targets' },
    { icon: Sparkles, label: isMale ? 'Grooming' : 'Beauty', color: 'hsl(var(--beauty))', path: '/beauty' },
    { icon: Heart, label: 'Health', color: 'hsl(var(--wellness))', path: '/health' },
    { icon: Dumbbell, label: 'Fitness', color: 'hsl(var(--fitness))', path: '/fitness' },
    { icon: Utensils, label: 'Diet', color: 'hsl(var(--nutrition))', path: '/diet' },
    ...(!isMale ? [{ icon: Calendar, label: 'Cycle', color: 'hsl(var(--cycle))', path: '/cycle' }] : []),
    { icon: Music, label: 'Mood Music', color: 'hsl(var(--beauty))', path: '/mood-music' },
    { icon: Bell, label: 'Reminders', color: 'hsl(var(--accent))', path: '/notifications' },
    { icon: Settings, label: 'Profile', color: 'hsl(var(--muted-foreground))', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-warm px-5 pt-10 pb-8 rounded-b-[2rem]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</p>
            <h1 className="text-2xl font-bold font-display text-primary-foreground mt-0.5">{profile.name} ✨</h1>
          </div>
          <button onClick={() => navigate('/profile')} className="shrink-0">
            <PersonalizedAvatar
              name={profile.name}
              gender={profile.gender}
              size={48}
              avatarStyle={(profile as any).avatarStyle ?? 0}
              className="ring-2 ring-primary-foreground/30"
            />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-primary-foreground/70 text-xs">Your BMI</p>
            <p className="text-3xl font-bold font-display text-primary-foreground">{bmi.value}</p>
            <p className="text-primary-foreground/80 text-sm capitalize">{bmi.category}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/70 text-xs">{profile.height}cm · {profile.weight}kg</p>
            <p className="text-primary-foreground/80 text-xs mt-1 capitalize">{profile.activityLevel} · {profile.lifestyle}</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold font-display text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ icon: Icon, label, color, path }, i) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => navigate(path)}
              className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-xs font-medium text-foreground">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-display text-foreground">Today's Progress</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={Droplets} label="Water Intake" value={waterCount} unit="glasses" color="hsl(var(--fitness))" delay={0.1} onClick={addWater} />
          <MetricCard icon={Moon} label="Sleep" value={sleepEntry ? String(sleepEntry.value) : '—'} unit="hrs" color="hsl(var(--accent))" delay={0.15} />
          <MetricCard icon={Footprints} label="Steps" value={stepsEntry ? String(stepsEntry.value) : '—'} color="hsl(var(--wellness))" delay={0.2} />
          <MetricCard icon={Sparkles} label="Self-Care" value={todayEntries.filter(e => e.type === 'skincare').length > 0 ? '✓' : '—'} color="hsl(var(--beauty))" delay={0.25} />
        </div>
      </div>

      {/* Gender-specific Tips */}
      <div className="px-5 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-bold font-display text-foreground mb-2">
            {isMale ? 'Men\'s Wellness Tip 💪' : profile.gender === 'other' ? 'Wellness Tip ✨' : 'Women\'s Wellness Tip 🌸'}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{tips[tipIndex % tips.length]}</p>
          <button
            onClick={() => setTipIndex(i => i + 1)}
            className="mt-2 text-xs font-medium text-primary hover:underline"
          >
            Next tip →
          </button>
        </motion.div>

        {/* BMI tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5 mt-3"
        >
          <h3 className="font-bold font-display text-foreground mb-1">Daily Tip ✨</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {bmi.category === 'obese'
              ? 'Start with 20 minutes of brisk walking today. Small steps lead to big changes!'
              : bmi.category === 'underweight'
              ? 'Focus on nutrient-dense meals with healthy fats and proteins today.'
              : bmi.category === 'overweight'
              ? 'Try a 30-minute combination of cardio and light strength training today.'
              : 'Great job maintaining a healthy BMI! Keep up your balanced routine.'}
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
