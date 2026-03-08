import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ruler, Weight, Activity, Heart, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile, clearAllData } from '@/lib/store';
import { calculateBMI, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;
  const bmi = calculateBMI(profile.height, profile.weight);

  const infoItems = [
    { icon: User, label: 'Age', value: `${profile.age} years` },
    { icon: Ruler, label: 'Height', value: `${profile.height} cm` },
    { icon: Weight, label: 'Weight', value: `${profile.weight} kg` },
    { icon: Activity, label: 'Activity', value: profile.activityLevel },
    { icon: Heart, label: 'Medical', value: profile.medicalConditions.length ? profile.medicalConditions.join(', ') : 'None' },
  ];

  const handleReset = () => {
    if (window.confirm('This will delete all your data. Are you sure?')) {
      clearAllData();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profile" showBack />

      <div className="px-5 mt-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-6 text-center text-primary-foreground">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold font-display">{profile.name.charAt(0)}</span>
          </div>
          <h2 className="text-xl font-bold font-display">{profile.name}</h2>
          <p className="text-sm opacity-80 capitalize">{profile.lifestyle} · {profile.foodPreference}</p>
          <div className="mt-3 bg-primary-foreground/15 rounded-xl p-3 inline-block">
            <span className="text-2xl font-bold font-display">{bmi.value}</span>
            <span className="text-sm ml-1 opacity-80 capitalize">{bmi.category}</span>
          </div>
        </motion.div>

        {infoItems.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium text-foreground capitalize">{value}</p>
            </div>
          </motion.div>
        ))}

        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full h-12 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <Trash2 size={16} className="mr-2" /> Reset All Data
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
