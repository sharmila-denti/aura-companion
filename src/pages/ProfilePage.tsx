import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ruler, Weight, Activity, Heart, Trash2, Pencil, Check, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile, saveProfile, clearAllData } from '@/lib/store';
import { calculateBMI, UserProfile } from '@/lib/types';
import { applyGenderTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const medicalOptions = ['None', 'Diabetes', 'PCOS', 'Anemia', 'Gastritis', 'Thyroid', 'Hypertension'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);

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
    saveProfile(draft);
    setProfile(draft);
    applyGenderTheme();
    setDraft(null);
    setEditing(false);
  };

  const update = (fields: Partial<UserProfile>) => {
    if (draft) setDraft(prev => prev ? { ...prev, ...fields } : prev);
  };

  const current = editing && draft ? draft : profile;

  const infoItems = [
    { icon: User, label: 'Age', value: `${current.age} years`, field: 'age' as const },
    { icon: Ruler, label: 'Height', value: `${current.height} cm`, field: 'height' as const },
    { icon: Weight, label: 'Weight', value: `${current.weight} kg`, field: 'weight' as const },
    { icon: Activity, label: 'Activity', value: current.activityLevel, field: 'activityLevel' as const },
    { icon: Heart, label: 'Medical', value: current.medicalConditions.length ? current.medicalConditions.join(', ') : 'None', field: 'medicalConditions' as const },
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

          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold font-display">{current.name.charAt(0)}</span>
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

        {/* Editable Fields */}
        {editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Age</Label>
                  <Input type="number" value={draft?.age || ''} onChange={e => update({ age: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Height (cm)</Label>
                  <Input type="number" value={draft?.height || ''} onChange={e => update({ height: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
                  <Input type="number" value={draft?.weight || ''} onChange={e => update({ weight: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Activity Level</Label>
              <div className="flex flex-wrap gap-2">
                {(['sedentary', 'light', 'moderate', 'active', 'very-active'] as const).map(a => (
                  <button
                    key={a}
                    onClick={() => update({ activityLevel: a })}
                    className={`px-3 h-9 rounded-xl text-xs font-medium transition-all ${
                      draft?.activityLevel === a ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {a.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Food Preference</Label>
              <div className="flex gap-2">
                {(['vegetarian', 'non-vegetarian'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => update({ foodPreference: f })}
                    className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
                      draft?.foodPreference === f ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Lifestyle</Label>
              <div className="flex flex-wrap gap-2">
                {(['student', 'professional', 'sedentary', 'other'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => update({ lifestyle: l })}
                    className={`px-3 h-9 rounded-xl text-xs font-medium transition-all ${
                      draft?.lifestyle === l ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Medical Conditions</Label>
              <div className="flex flex-wrap gap-2">
                {medicalOptions.map(m => {
                  const selected = m === 'None' ? (draft?.medicalConditions?.length === 0) : draft?.medicalConditions?.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        if (m === 'None') { update({ medicalConditions: [] }); }
                        else {
                          const conditions = draft?.medicalConditions || [];
                          update({ medicalConditions: conditions.includes(m) ? conditions.filter(c => c !== m) : [...conditions, m] });
                        }
                      }}
                      className={`px-3 h-9 rounded-full text-xs font-medium transition-all ${
                        selected ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Skin Type</Label>
              <div className="flex flex-wrap gap-2">
                {(['oily', 'dry', 'combination', 'normal', 'sensitive'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => update({ skinType: s })}
                    className={`px-3 h-9 rounded-full text-xs font-medium transition-all ${
                      draft?.skinType === s ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={saveEdit} className="w-full h-12 rounded-xl gradient-warm text-primary-foreground font-semibold border-0">
              <Check size={16} className="mr-2" /> Save Changes
            </Button>
          </motion.div>
        ) : (
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
        )}

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
