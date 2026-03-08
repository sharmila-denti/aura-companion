import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveProfile } from '@/lib/store';
import { UserProfile, calculateBMI } from '@/lib/types';
import { applyGenderTheme } from '@/lib/theme';
import { requestNotificationPermission, startNotificationScheduler } from '@/lib/notifications';

const medicalOptions = ['None', 'Diabetes', 'PCOS', 'Anemia', 'Gastritis', 'Thyroid', 'Hypertension'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    gender: 'female',
    activityLevel: 'moderate',
    foodPreference: 'vegetarian',
    lifestyle: 'student',
    medicalConditions: [],
    skinType: 'combination',
  });

  const update = (fields: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...fields }));

  const canProceed = () => {
    if (step === 0) return profile.name && profile.age && profile.gender;
    if (step === 1) return profile.height && profile.weight;
    if (step === 2) return true;
    return true;
  };

  const finish = async () => {
    saveProfile(profile as UserProfile);
    applyGenderTheme();
    const granted = await requestNotificationPermission();
    if (granted) startNotificationScheduler();
    navigate('/dashboard');
  };

  const bmi = profile.height && profile.weight ? calculateBMI(profile.height, profile.weight) : null;

  const steps = [
    // Step 0: Basic Info
    <div key="basics" className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Your Name</Label>
        <Input
          placeholder="Enter your name"
          value={profile.name || ''}
          onChange={e => update({ name: e.target.value })}
          className="h-12 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Age</Label>
          <Input
            type="number"
            placeholder="25"
            value={profile.age || ''}
            onChange={e => update({ age: parseInt(e.target.value) || undefined })}
            className="h-12 rounded-xl bg-secondary border-0 text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Gender</Label>
          <div className="flex gap-2">
            {(['female', 'male', 'other'] as const).map(g => (
              <button
                key={g}
                onClick={() => update({ gender: g })}
                className={`flex-1 h-12 rounded-xl text-sm font-medium transition-all ${
                  profile.gender === g
                    ? 'gradient-warm text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Lifestyle</Label>
        <div className="grid grid-cols-2 gap-2">
          {(['student', 'professional', 'sedentary', 'other'] as const).map(l => (
            <button
              key={l}
              onClick={() => update({ lifestyle: l })}
              className={`h-11 rounded-xl text-sm font-medium transition-all ${
                profile.lifestyle === l
                  ? 'gradient-warm text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 1: Body Metrics
    <div key="body" className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Height (cm)</Label>
          <Input
            type="number"
            placeholder="165"
            value={profile.height || ''}
            onChange={e => update({ height: parseInt(e.target.value) || undefined })}
            className="h-12 rounded-xl bg-secondary border-0 text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Weight (kg)</Label>
          <Input
            type="number"
            placeholder="60"
            value={profile.weight || ''}
            onChange={e => update({ weight: parseInt(e.target.value) || undefined })}
            className="h-12 rounded-xl bg-secondary border-0 text-foreground"
          />
        </div>
      </div>
      {bmi && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-5 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
          <p className="text-4xl font-bold font-display" style={{ color: bmi.color }}>{bmi.value}</p>
          <p className="text-sm font-medium capitalize mt-1" style={{ color: bmi.color }}>{bmi.category}</p>
        </motion.div>
      )}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Activity Level</Label>
        <div className="space-y-2">
          {(['sedentary', 'light', 'moderate', 'active', 'very-active'] as const).map(a => (
            <button
              key={a}
              onClick={() => update({ activityLevel: a })}
              className={`w-full h-11 rounded-xl text-sm font-medium transition-all ${
                profile.activityLevel === a
                  ? 'gradient-warm text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {a.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2: Preferences & Medical
    <div key="prefs" className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Food Preference</Label>
        <div className="flex gap-2">
          {(['vegetarian', 'non-vegetarian'] as const).map(f => (
            <button
              key={f}
              onClick={() => update({ foodPreference: f })}
              className={`flex-1 h-12 rounded-xl text-sm font-medium transition-all ${
                profile.foodPreference === f
                  ? 'gradient-warm text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Medical Conditions</Label>
        <div className="flex flex-wrap gap-2">
          {medicalOptions.map(m => {
            const selected = m === 'None'
              ? (profile.medicalConditions?.length === 0)
              : profile.medicalConditions?.includes(m);
            return (
              <button
                key={m}
                onClick={() => {
                  if (m === 'None') {
                    update({ medicalConditions: [] });
                  } else {
                    const conditions = profile.medicalConditions || [];
                    update({
                      medicalConditions: conditions.includes(m)
                        ? conditions.filter(c => c !== m)
                        : [...conditions, m],
                    });
                  }
                }}
                className={`px-4 h-10 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? 'gradient-warm text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Skin Type</Label>
        <div className="flex flex-wrap gap-2">
          {(['oily', 'dry', 'combination', 'normal', 'sensitive'] as const).map(s => (
            <button
              key={s}
              onClick={() => update({ skinType: s })}
              className={`px-4 h-10 rounded-full text-sm font-medium transition-all ${
                profile.skinType === s
                  ? 'gradient-warm text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>,
  ];

  const titles = ['About You', 'Body Metrics', 'Preferences'];
  const subtitles = [
    'Let\'s get to know you better',
    'We\'ll calculate your BMI & plan',
    'Customize your experience',
  ];

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="px-5 pt-12 pb-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <Sparkles size={20} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display text-foreground">Hey Me!</span>
        </motion.div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full gradient-warm rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold font-display text-foreground">{titles[step]}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitles[step]}</p>
        </motion.div>
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 pb-8 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            className="h-14 rounded-2xl px-6 border-border"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <Button
          onClick={() => step < 2 ? setStep(s => s + 1) : finish()}
          disabled={!canProceed()}
          className="flex-1 h-14 rounded-2xl gradient-warm text-primary-foreground font-semibold text-base border-0 disabled:opacity-40"
        >
          {step < 2 ? 'Continue' : 'Get Started'}
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
