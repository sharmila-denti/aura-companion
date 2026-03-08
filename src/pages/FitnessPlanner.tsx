import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Timer, Flame, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile } from '@/lib/store';
import { calculateBMI, UserProfile, BMIResult } from '@/lib/types';

interface Workout {
  name: string;
  duration: string;
  calories: string;
  exercises: string[];
}

function getWorkouts(bmi: BMIResult, lifestyle: string): { title: string; workouts: Workout[] }[] {
  const plans: { title: string; workouts: Workout[] }[] = [];

  if (bmi.category === 'obese') {
    plans.push({
      title: '🔥 Weight Loss Plan',
      workouts: [
        { name: 'Morning Walk', duration: '30 min', calories: '150', exercises: ['Brisk Walking', 'Light Stretching', 'Deep Breathing'] },
        { name: 'Low Impact Cardio', duration: '25 min', calories: '200', exercises: ['Marching in Place', 'Side Steps', 'Arm Circles', 'Wall Push-ups'] },
        { name: 'Beginner Strength', duration: '20 min', calories: '120', exercises: ['Chair Squats', 'Wall Push-ups', 'Standing Calf Raises', 'Knee Lifts'] },
      ],
    });
  } else if (bmi.category === 'underweight') {
    plans.push({
      title: '💪 Muscle Gain Plan',
      workouts: [
        { name: 'Upper Body', duration: '40 min', calories: '250', exercises: ['Bench Press', 'Dumbbell Rows', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips'] },
        { name: 'Lower Body', duration: '40 min', calories: '280', exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises', 'Deadlifts'] },
        { name: 'Full Body', duration: '45 min', calories: '300', exercises: ['Pull-ups', 'Push-ups', 'Planks', 'Squats', 'Rows'] },
      ],
    });
  } else {
    plans.push({
      title: '⚡ Maintenance Plan',
      workouts: [
        { name: 'HIIT Session', duration: '30 min', calories: '350', exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees'] },
        { name: 'Strength Circuit', duration: '35 min', calories: '280', exercises: ['Deadlifts', 'Bench Press', 'Pull-ups', 'Planks', 'Lunges'] },
        { name: 'Yoga Flow', duration: '40 min', calories: '180', exercises: ['Sun Salutation', 'Warrior Poses', 'Tree Pose', 'Cobra', 'Savasana'] },
      ],
    });
  }

  if (lifestyle === 'student') {
    plans.push({
      title: '🎓 Student-Friendly',
      workouts: [
        { name: 'Dorm Room Workout', duration: '15 min', calories: '120', exercises: ['Push-ups', 'Squats', 'Planks', 'Crunches', 'Jumping Jacks'] },
        { name: 'Study Break Stretch', duration: '10 min', calories: '50', exercises: ['Neck Rolls', 'Shoulder Stretch', 'Hip Opener', 'Wrist Circles'] },
      ],
    });
  }

  // Facial Exercises — always included
  plans.push({
    title: '🧖 Facial Exercises',
    workouts: [
      { name: 'Face Yoga Basics', duration: '10 min', calories: '15', exercises: ['Forehead Smoother', 'Cheek Lifter', 'Jaw Release', 'Eye Firmer', 'Neck Toner'] },
      { name: 'Anti-Aging Facial', duration: '12 min', calories: '10', exercises: ['Lion Face Stretch', 'Fish Face Hold', 'Brow Lift Press', 'Chin Lock', 'Temple Massage'] },
      { name: 'De-Stress Face', duration: '8 min', calories: '8', exercises: ['Jaw Unclenching', 'Tongue-to-Roof Press', 'Ear-to-Shoulder Tilt', 'Eye Circle Rolls', 'Deep Face Relaxation'] },
      { name: 'Sculpting Routine', duration: '15 min', calories: '12', exercises: ['Cheekbone Definer', 'Jawline Sculptor', 'Lip Plumper Exercise', 'Under-Eye Drain', 'Forehead Lift'] },
    ],
  });

  return plans;
}

export default function FitnessPlanner() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(profile.height, profile.weight);
  const plans = getWorkouts(bmi, profile.lifestyle);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Fitness Planner" subtitle={`Workouts for ${bmi.category} BMI`} showBack />

      <div className="px-5 mt-4 space-y-6">
        {/* BMI Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">Your BMI</p>
              <p className="text-3xl font-bold font-display">{bmi.value}</p>
              <p className="text-sm capitalize opacity-90">{bmi.category}</p>
            </div>
            <Dumbbell size={40} className="opacity-30" />
          </div>
        </motion.div>

        {/* Workout Plans */}
        {plans.map((plan, pi) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + pi * 0.05 }}
          >
            <h3 className="font-bold font-display text-foreground text-lg mb-3">{plan.title}</h3>
            <div className="space-y-3">
              {plan.workouts.map(w => {
                const isExpanded = expandedWorkout === w.name;
                return (
                  <div key={w.name} className="glass-card rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedWorkout(isExpanded ? null : w.name)}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{w.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Timer size={12} /> {w.duration}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Flame size={12} /> {w.calories} cal
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-4 pb-4"
                      >
                        <div className="border-t border-border pt-3 space-y-2">
                          {w.exercises.map((ex, i) => (
                            <div key={ex} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-fitness/10 text-fitness text-xs font-bold flex items-center justify-center">{i + 1}</span>
                              <span className="text-sm text-foreground">{ex}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
