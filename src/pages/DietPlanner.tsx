import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Sun, Moon as MoonIcon, Cookie } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile } from '@/lib/store';
import { calculateBMI, UserProfile } from '@/lib/types';

interface Meal {
  time: string;
  icon: React.ElementType;
  name: string;
  vegOption: string;
  nonVegOption: string;
  calories: string;
}

function getMealPlan(bmiCategory: string, isStudent: boolean): Meal[] {
  const base: Meal[] = [
    {
      time: '8:00 AM',
      icon: Coffee,
      name: 'Breakfast',
      vegOption: bmiCategory === 'underweight'
        ? 'Banana smoothie with oats, peanut butter toast, mixed nuts'
        : bmiCategory === 'obese'
        ? 'Green smoothie, 1 boiled egg white, fruit salad'
        : 'Overnight oats with berries, green tea, almonds',
      nonVegOption: bmiCategory === 'underweight'
        ? 'Scrambled eggs with cheese toast, banana shake'
        : bmiCategory === 'obese'
        ? '2 egg whites, whole wheat toast, fruit salad'
        : 'Egg omelette with veggies, whole wheat toast, juice',
      calories: bmiCategory === 'obese' ? '300' : bmiCategory === 'underweight' ? '500' : '400',
    },
    {
      time: '1:00 PM',
      icon: Sun,
      name: 'Lunch',
      vegOption: bmiCategory === 'underweight'
        ? 'Rice, dal, paneer curry, curd, salad'
        : bmiCategory === 'obese'
        ? 'Brown rice (small), dal, sautéed veggies, salad'
        : 'Chapati, mixed veg curry, dal, salad, curd',
      nonVegOption: bmiCategory === 'underweight'
        ? 'Rice, chicken curry, dal, salad'
        : bmiCategory === 'obese'
        ? 'Grilled chicken breast, brown rice (small), salad'
        : 'Grilled fish, chapati, dal, salad',
      calories: bmiCategory === 'obese' ? '400' : bmiCategory === 'underweight' ? '650' : '550',
    },
    {
      time: '4:30 PM',
      icon: Cookie,
      name: 'Snack',
      vegOption: isStudent ? 'Trail mix, fruit, green tea' : 'Hummus with veggie sticks, fruit',
      nonVegOption: isStudent ? 'Protein bar, fruit, juice' : 'Greek yogurt with nuts, fruit',
      calories: '150',
    },
    {
      time: '7:30 PM',
      icon: MoonIcon,
      name: 'Dinner',
      vegOption: bmiCategory === 'underweight'
        ? 'Chapati, paneer, dal, rice, milk before bed'
        : bmiCategory === 'obese'
        ? 'Soup, grilled veggies, 1 chapati'
        : 'Multigrain chapati, veggie stir-fry, light dal',
      nonVegOption: bmiCategory === 'underweight'
        ? 'Chapati, chicken, rice, warm milk before bed'
        : bmiCategory === 'obese'
        ? 'Grilled fish, steamed veggies, soup'
        : 'Grilled chicken, sautéed veggies, soup',
      calories: bmiCategory === 'obese' ? '350' : bmiCategory === 'underweight' ? '600' : '450',
    },
  ];
  return base;
}

export default function DietPlanner() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(profile.height, profile.weight);
  const meals = getMealPlan(bmi.category, profile.lifestyle === 'student');
  const isVeg = profile.foodPreference === 'vegetarian';

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Diet Planner" subtitle={`${isVeg ? 'Vegetarian' : 'Non-Veg'} • ${bmi.category} plan`} showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Goal Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-warm rounded-2xl p-5 text-primary-foreground">
          <Utensils size={24} className="opacity-50 mb-2" />
          <h3 className="font-bold font-display text-lg">
            {bmi.category === 'obese' ? 'Weight Loss Diet' : bmi.category === 'underweight' ? 'Muscle Gain Diet' : 'Balanced Diet'}
          </h3>
          <p className="text-sm opacity-80 mt-1">
            {bmi.category === 'obese'
              ? 'Calorie deficit with nutrient-dense foods'
              : bmi.category === 'underweight'
              ? 'Calorie surplus with protein-rich foods'
              : 'Balanced nutrition for maintenance'}
          </p>
          {profile.medicalConditions.length > 0 && (
            <p className="text-xs opacity-70 mt-2">⚠️ Adjusted for: {profile.medicalConditions.join(', ')}</p>
          )}
        </motion.div>

        {/* Meals */}
        {meals.map((meal, i) => (
          <motion.div
            key={meal.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-nutrition/10 flex items-center justify-center">
                  <meal.icon size={20} className="text-nutrition" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.time}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-nutrition">{meal.calories} cal</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {isVeg ? meal.vegOption : meal.nonVegOption}
            </p>
          </motion.div>
        ))}

        {/* Tips */}
        {profile.medicalConditions.includes('Diabetes') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-4 border-l-4 border-nutrition">
            <p className="text-sm font-semibold text-foreground">🩺 Diabetes Note</p>
            <p className="text-xs text-muted-foreground mt-1">Avoid refined sugar, white rice. Prefer whole grains. Monitor blood sugar regularly. Consult your doctor.</p>
          </motion.div>
        )}
        {profile.medicalConditions.includes('PCOS') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-4 border-l-4 border-cycle">
            <p className="text-sm font-semibold text-foreground">🩺 PCOS Note</p>
            <p className="text-xs text-muted-foreground mt-1">Focus on anti-inflammatory foods. Reduce dairy and processed food. Include omega-3 rich foods.</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
