import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const medicalOptions = ['None', 'Diabetes', 'PCOS', 'Anemia', 'Gastritis', 'Thyroid', 'Hypertension'];

interface ProfileEditFormProps {
  draft: UserProfile | null;
  update: (fields: Partial<UserProfile>) => void;
  onSave: () => void;
}

export default function ProfileEditForm({ draft, update, onSave }: ProfileEditFormProps) {
  if (!draft) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Age</Label>
            <Input type="number" value={draft.age || ''} onChange={e => update({ age: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Height (cm)</Label>
            <Input type="number" value={draft.height || ''} onChange={e => update({ height: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
            <Input type="number" value={draft.weight || ''} onChange={e => update({ weight: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl bg-secondary border-0 text-foreground" />
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
                draft.activityLevel === a ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
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
                draft.foodPreference === f ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
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
                draft.lifestyle === l ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
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
            const selected = m === 'None' ? (draft.medicalConditions?.length === 0) : draft.medicalConditions?.includes(m);
            return (
              <button
                key={m}
                onClick={() => {
                  if (m === 'None') { update({ medicalConditions: [] }); }
                  else {
                    const conditions = draft.medicalConditions || [];
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
                draft.skinType === s ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 space-y-2">
        <Label className="text-xs text-muted-foreground">Skin Tone</Label>
        <div className="flex flex-wrap gap-2">
          {(['fair', 'light', 'medium', 'olive', 'tan', 'dark'] as const).map(t => (
            <button
              key={t}
              onClick={() => update({ skinTone: t })}
              className={`px-3 h-9 rounded-full text-xs font-medium transition-all ${
                draft.skinTone === t ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={onSave} className="w-full h-12 rounded-xl gradient-warm text-primary-foreground font-semibold border-0">
        <Check size={16} className="mr-2" /> Save Changes
      </Button>
    </motion.div>
  );
}
