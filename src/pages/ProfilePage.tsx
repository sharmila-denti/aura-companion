import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, Weight, Activity, Heart, Trash2, Pencil, Check, X, Crown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile, saveProfile, clearAllData } from '@/lib/store';
import { calculateBMI, UserProfile } from '@/lib/types';
import { applyGenderTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useSubscription } from '@/hooks/useSubscription';



export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const { subscribed, plan } = useSubscription();
  

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);
    
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(
    editing && draft ? draft.height : profile.height,
    editing && draft ? draft.weight : profile.weight
  );

  const startEdit = () => {
    setDraft({ ...profile });
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
    
  };

  const saveEdit = () => {
    if (!draft) return;
    const updated = { ...draft };
    saveProfile(updated);
    setProfile(updated);
    applyGenderTheme();
    setDraft(null);
    setEditing(false);
  };

  const update = (fields: Partial<UserProfile>) => {
    if (draft) setDraft(prev => prev ? { ...prev, ...fields } : prev);
  };

  const current = editing && draft ? draft : profile;

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
        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-6 text-center text-primary-foreground relative">
          {!editing ? (
            <button onClick={startEdit} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Pencil size={14} />
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={cancelEdit} className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <X size={14} />
              </button>
              <button onClick={saveEdit} className="w-8 h-8 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                <Check size={14} />
              </button>
            </div>
          )}

          {/* Name Initial */}
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold">{current.name.charAt(0).toUpperCase()}</span>
          </div>

          {editing ? (
            <Input
              value={draft?.name || ''}
              onChange={e => update({ name: e.target.value })}
              className="h-10 rounded-xl bg-primary-foreground/20 border-0 text-center text-primary-foreground placeholder:text-primary-foreground/60 font-bold text-lg mb-1"
            />
          ) : (
            <h2 className="text-xl font-bold font-display">{current.name}</h2>
          )}

          {editing ? (
            <div className="flex gap-2 justify-center mt-2">
              {(['female', 'male', 'other'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => update({ gender: g })}
                  className={`px-3 h-8 rounded-full text-xs font-medium transition-all ${
                    draft?.gender === g ? 'bg-primary-foreground/30' : 'bg-primary-foreground/10'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-80 capitalize">{current.lifestyle} · {current.foodPreference}</p>
          )}

          <div className="mt-3 bg-primary-foreground/15 rounded-xl p-3 inline-block">
            <span className="text-2xl font-bold font-display">{bmi.value}</span>
            <span className="text-sm ml-1 opacity-80 capitalize">{bmi.category}</span>
          </div>
        </motion.div>

        {/* Editable Fields or Info Cards */}
        {editing ? (
          <ProfileEditForm draft={draft} update={update} onSave={saveEdit} />
        ) : (
          <ProfileInfoCards profile={profile} />
        )}

        {/* Subscription */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/subscription')}
          className="w-full glass-card rounded-xl p-4 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center">
            <Crown size={18} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Subscription Plan</p>
            <p className="text-xs text-muted-foreground">
              {localStorage.getItem('heyme_subscribed') === 'true' ? 'Active' : 'Upgrade to Premium'}
            </p>
          </div>
          <span className="text-xs font-medium text-primary">→</span>
        </motion.button>

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

/* ---- Sub-components extracted inline ---- */

function ProfileInfoCards({ profile }: { profile: UserProfile }) {
  const infoItems = [
    { icon: Ruler, label: 'Height', value: `${profile.height} cm` },
    { icon: Weight, label: 'Weight', value: `${profile.weight} kg` },
    { icon: Activity, label: 'Activity', value: profile.activityLevel },
    { icon: Heart, label: 'Medical', value: profile.medicalConditions.length ? profile.medicalConditions.join(', ') : 'None' },
  ];

  return (
    <>
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
    </>
  );
}
