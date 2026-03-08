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

function OptionGroup<T extends string>({
  label, options, value, onChange, colorSwatches,
}: {
  label: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (v: T) => void;
  colorSwatches?: Record<string, string>;
}) {
  return (
    <div className="glass-card rounded-xl p-4 space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-3 h-9 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              value === o ? 'gradient-warm text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {colorSwatches?.[o] && (
              <span className="w-3.5 h-3.5 rounded-full border border-foreground/20 shrink-0" style={{ backgroundColor: colorSwatches[o] }} />
            )}
            {o.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>
    </div>
  );
}

const EYE_SWATCHES: Record<string, string> = {
  black: '#1A1A1A', brown: '#5D4037', hazel: '#8B6914', green: '#2E7D32', blue: '#1565C0', gray: '#607D8B',
};

const HAIR_SWATCHES: Record<string, string> = {
  black: '#1A1A2E', 'dark-brown': '#3D2B1F', brown: '#6B4226', auburn: '#8B4513', blonde: '#D4A76A', red: '#C04030', gray: '#9E9E9E', white: '#E0E0E0',
};

const LIP_SWATCHES: Record<string, string> = {
  natural: '#C0776E', pink: '#E91E63', red: '#C62828', berry: '#880E4F', nude: '#D4A08A',
};

export default function ProfileEditForm({ draft, update, onSave }: ProfileEditFormProps) {
  if (!draft) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Basic Info */}
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

      <OptionGroup label="Activity Level" options={['sedentary', 'light', 'moderate', 'active', 'very-active'] as const} value={draft.activityLevel} onChange={v => update({ activityLevel: v })} />
      
      <OptionGroup label="Food Preference" options={['vegetarian', 'non-vegetarian'] as const} value={draft.foodPreference} onChange={v => update({ foodPreference: v })} />

      <OptionGroup label="Lifestyle" options={['student', 'professional', 'sedentary', 'other'] as const} value={draft.lifestyle} onChange={v => update({ lifestyle: v })} />

      {/* Medical Conditions */}
      <div className="glass-card rounded-xl p-4 space-y-2">
        <Label className="text-xs text-muted-foreground">Medical Conditions</Label>
        <div className="flex flex-wrap gap-2">
          {medicalOptions.map(m => {
            const selected = m === 'None' ? (draft.medicalConditions?.length === 0) : draft.medicalConditions?.includes(m);
            return (
              <button
                key={m}
                onClick={() => {
                  if (m === 'None') update({ medicalConditions: [] });
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

      {/* Skin & Hair */}
      <div className="space-y-1">
        <p className="text-sm font-bold font-display text-foreground px-1">Skin & Hair</p>
      </div>
      <OptionGroup label="Skin Type" options={['oily', 'dry', 'combination', 'normal', 'sensitive'] as const} value={draft.skinType} onChange={v => update({ skinType: v })} />
      <OptionGroup label="Skin Tone" options={['fair', 'light', 'medium', 'olive', 'tan', 'dark'] as const} value={draft.skinTone} onChange={v => update({ skinTone: v })} />
      <OptionGroup label="Hair Texture" options={['straight', 'wavy', 'curly', 'coily'] as const} value={draft.hairTexture} onChange={v => update({ hairTexture: v })} />
      <OptionGroup label="Hair Density" options={['thin', 'medium', 'thick'] as const} value={draft.hairDensity} onChange={v => update({ hairDensity: v })} />
      <OptionGroup label="Hair Type" options={['oily', 'dry', 'normal', 'combination'] as const} value={draft.hairType} onChange={v => update({ hairType: v })} />

      {/* Avatar Customization */}
      <div className="space-y-1">
        <p className="text-sm font-bold font-display text-foreground px-1">✨ Avatar Customization</p>
      </div>
      <OptionGroup label="Eye Color" options={['black', 'brown', 'hazel', 'green', 'blue', 'gray'] as const} value={draft.eyeColor} onChange={v => update({ eyeColor: v })} colorSwatches={EYE_SWATCHES} />
      <OptionGroup label="Eye Size" options={['small', 'medium', 'large'] as const} value={draft.eyeSize} onChange={v => update({ eyeSize: v })} />
      <OptionGroup label="Hair Color" options={['black', 'dark-brown', 'brown', 'auburn', 'blonde', 'red', 'gray', 'white'] as const} value={draft.hairColor} onChange={v => update({ hairColor: v })} colorSwatches={HAIR_SWATCHES} />
      <OptionGroup label="Hair Length" options={['short', 'medium', 'long'] as const} value={draft.hairLength} onChange={v => update({ hairLength: v })} />
      <OptionGroup label="Lip Style" options={['thin', 'medium', 'full'] as const} value={draft.lipStyle} onChange={v => update({ lipStyle: v })} />
      <OptionGroup label="Lip Color" options={['natural', 'pink', 'red', 'berry', 'nude'] as const} value={draft.lipColor} onChange={v => update({ lipColor: v })} colorSwatches={LIP_SWATCHES} />
      <OptionGroup label="Dress Style" options={['modern', 'traditional', 'casual', 'formal', 'sporty'] as const} value={draft.dressStyle} onChange={v => update({ dressStyle: v })} />

      {/* Language */}
      <OptionGroup label="Preferred Language (Music)" options={['english', 'hindi', 'tamil', 'telugu', 'spanish', 'french', 'korean', 'japanese'] as const} value={draft.language} onChange={v => update({ language: v })} />

      <Button onClick={onSave} className="w-full h-12 rounded-xl gradient-warm text-primary-foreground font-semibold border-0">
        <Check size={16} className="mr-2" /> Save Changes
      </Button>
    </motion.div>
  );
}
