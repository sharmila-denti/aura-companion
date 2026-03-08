import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Sun, Moon as MoonIcon, Cookie, Flame, Dumbbell, Target, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getProfile } from '@/lib/store';
import { calculateBMI, UserProfile } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

type FitnessGoal = 'fat-loss' | 'toned' | 'bulking';

interface MacroBreakdown {
  protein: number; // grams
  carbs: number;
  fat: number;
  calories: number;
}

interface FoodItem {
  name: string;
  quantity: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface MealPlan {
  time: string;
  icon: React.ElementType;
  name: string;
  vegOptions: FoodItem[];
  nonVegOptions: FoodItem[];
}

function calculateDailyMacros(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: FitnessGoal
): MacroBreakdown {
  // BMR using Mifflin-St Jeor
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'male' ? 5 : -161;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  let calories: number;
  let proteinRatio: number;
  let fatRatio: number;

  switch (goal) {
    case 'fat-loss':
      calories = Math.round(tdee - 500);
      proteinRatio = 2.2; // g per kg
      fatRatio = 0.25; // 25% of calories
      break;
    case 'bulking':
      calories = Math.round(tdee + 400);
      proteinRatio = 2.0;
      fatRatio = 0.25;
      break;
    case 'toned':
    default:
      calories = Math.round(tdee);
      proteinRatio = 1.8;
      fatRatio = 0.28;
      break;
  }

  const protein = Math.round(proteinRatio * weight);
  const fat = Math.round((calories * fatRatio) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { protein, carbs, fat, calories };
}

function getMealPlans(goal: FitnessGoal, macros: MacroBreakdown): MealPlan[] {
  if (goal === 'fat-loss') {
    return [
      {
        time: '7:30 AM', icon: Coffee, name: 'Breakfast',
        vegOptions: [
          { name: 'Moong dal chilla', quantity: '2 pieces', protein: 12, carbs: 20, fat: 4, calories: 164 },
          { name: 'Greek yogurt (low-fat)', quantity: '200g', protein: 18, carbs: 8, fat: 2, calories: 122 },
          { name: 'Mixed berries', quantity: '100g', protein: 1, carbs: 14, fat: 0, calories: 57 },
          { name: 'Green tea', quantity: '1 cup', protein: 0, carbs: 0, fat: 0, calories: 2 },
        ],
        nonVegOptions: [
          { name: 'Egg white omelette (veggies)', quantity: '4 whites + veggies', protein: 22, carbs: 6, fat: 2, calories: 130 },
          { name: 'Whole wheat toast', quantity: '1 slice', protein: 4, carbs: 14, fat: 1, calories: 80 },
          { name: 'Avocado', quantity: '30g', protein: 1, carbs: 2, fat: 5, calories: 50 },
          { name: 'Black coffee', quantity: '1 cup', protein: 0, carbs: 0, fat: 0, calories: 2 },
        ],
      },
      {
        time: '10:30 AM', icon: Cookie, name: 'Mid-Morning Snack',
        vegOptions: [
          { name: 'Roasted chana', quantity: '30g', protein: 6, carbs: 16, fat: 2, calories: 106 },
          { name: 'Green apple', quantity: '1 medium', protein: 0, carbs: 22, fat: 0, calories: 80 },
        ],
        nonVegOptions: [
          { name: 'Boiled eggs', quantity: '2 whole', protein: 12, carbs: 1, fat: 10, calories: 140 },
          { name: 'Cucumber slices', quantity: '100g', protein: 1, carbs: 4, fat: 0, calories: 16 },
        ],
      },
      {
        time: '1:00 PM', icon: Sun, name: 'Lunch',
        vegOptions: [
          { name: 'Brown rice', quantity: '100g cooked', protein: 3, carbs: 24, fat: 1, calories: 112 },
          { name: 'Rajma / dal', quantity: '150g', protein: 14, carbs: 22, fat: 2, calories: 160 },
          { name: 'Sautéed vegetables', quantity: '150g', protein: 3, carbs: 12, fat: 3, calories: 80 },
          { name: 'Salad with lemon', quantity: '1 bowl', protein: 2, carbs: 8, fat: 0, calories: 40 },
        ],
        nonVegOptions: [
          { name: 'Grilled chicken breast', quantity: '150g', protein: 46, carbs: 0, fat: 5, calories: 231 },
          { name: 'Brown rice', quantity: '80g cooked', protein: 2, carbs: 19, fat: 1, calories: 90 },
          { name: 'Steamed broccoli', quantity: '100g', protein: 3, carbs: 7, fat: 0, calories: 34 },
          { name: 'Mixed salad', quantity: '1 bowl', protein: 2, carbs: 8, fat: 1, calories: 45 },
        ],
      },
      {
        time: '4:30 PM', icon: Cookie, name: 'Evening Snack',
        vegOptions: [
          { name: 'Paneer cubes (grilled)', quantity: '50g', protein: 9, carbs: 2, fat: 7, calories: 105 },
          { name: 'Green tea', quantity: '1 cup', protein: 0, carbs: 0, fat: 0, calories: 2 },
        ],
        nonVegOptions: [
          { name: 'Chicken tikka', quantity: '80g', protein: 18, carbs: 2, fat: 4, calories: 116 },
          { name: 'Lemon water', quantity: '1 glass', protein: 0, carbs: 2, fat: 0, calories: 8 },
        ],
      },
      {
        time: '7:30 PM', icon: MoonIcon, name: 'Dinner',
        vegOptions: [
          { name: 'Multigrain roti', quantity: '1 piece', protein: 4, carbs: 18, fat: 2, calories: 100 },
          { name: 'Palak paneer (light)', quantity: '150g', protein: 12, carbs: 8, fat: 8, calories: 150 },
          { name: 'Cucumber raita', quantity: '100g', protein: 3, carbs: 5, fat: 2, calories: 50 },
        ],
        nonVegOptions: [
          { name: 'Grilled fish (tilapia)', quantity: '150g', protein: 34, carbs: 0, fat: 3, calories: 165 },
          { name: 'Steamed veggies', quantity: '150g', protein: 3, carbs: 10, fat: 1, calories: 55 },
          { name: 'Clear soup', quantity: '1 bowl', protein: 3, carbs: 5, fat: 1, calories: 40 },
        ],
      },
    ];
  }

  if (goal === 'bulking') {
    return [
      {
        time: '7:00 AM', icon: Coffee, name: 'Breakfast',
        vegOptions: [
          { name: 'Oats with banana & peanut butter', quantity: '60g oats + 1 banana + 2 tbsp PB', protein: 16, carbs: 60, fat: 18, calories: 460 },
          { name: 'Full-fat milk', quantity: '300ml', protein: 10, carbs: 15, fat: 10, calories: 186 },
          { name: 'Mixed dry fruits', quantity: '30g', protein: 4, carbs: 12, fat: 8, calories: 140 },
        ],
        nonVegOptions: [
          { name: 'Whole eggs scrambled', quantity: '4 eggs', protein: 24, carbs: 2, fat: 20, calories: 280 },
          { name: 'Whole wheat toast + butter', quantity: '3 slices + 1 tbsp', protein: 12, carbs: 42, fat: 15, calories: 340 },
          { name: 'Banana shake', quantity: '300ml', protein: 10, carbs: 35, fat: 8, calories: 250 },
        ],
      },
      {
        time: '10:30 AM', icon: Cookie, name: 'Mid-Morning Snack',
        vegOptions: [
          { name: 'Paneer sandwich', quantity: '2 slices bread + 80g paneer', protein: 20, carbs: 28, fat: 14, calories: 310 },
          { name: 'Banana', quantity: '1 large', protein: 1, carbs: 27, fat: 0, calories: 105 },
        ],
        nonVegOptions: [
          { name: 'Chicken breast wrap', quantity: '1 large wrap', protein: 30, carbs: 30, fat: 8, calories: 310 },
          { name: 'Fruit juice', quantity: '250ml', protein: 1, carbs: 28, fat: 0, calories: 112 },
        ],
      },
      {
        time: '1:00 PM', icon: Sun, name: 'Lunch',
        vegOptions: [
          { name: 'White rice', quantity: '200g cooked', protein: 5, carbs: 50, fat: 1, calories: 230 },
          { name: 'Chole / Rajma curry', quantity: '200g', protein: 18, carbs: 30, fat: 6, calories: 240 },
          { name: 'Paneer bhurji', quantity: '100g', protein: 14, carbs: 4, fat: 14, calories: 200 },
          { name: 'Curd', quantity: '150g', protein: 6, carbs: 7, fat: 5, calories: 100 },
        ],
        nonVegOptions: [
          { name: 'Chicken curry', quantity: '200g', protein: 40, carbs: 8, fat: 12, calories: 300 },
          { name: 'White rice', quantity: '250g cooked', protein: 6, carbs: 62, fat: 1, calories: 288 },
          { name: 'Dal', quantity: '150g', protein: 10, carbs: 18, fat: 2, calories: 130 },
          { name: 'Salad', quantity: '1 bowl', protein: 2, carbs: 8, fat: 1, calories: 45 },
        ],
      },
      {
        time: '4:30 PM', icon: Cookie, name: 'Pre-Workout Snack',
        vegOptions: [
          { name: 'Sweet potato', quantity: '200g boiled', protein: 3, carbs: 40, fat: 0, calories: 172 },
          { name: 'Peanut butter toast', quantity: '1 slice + 1 tbsp', protein: 8, carbs: 18, fat: 10, calories: 190 },
        ],
        nonVegOptions: [
          { name: 'Boiled eggs', quantity: '3 whole', protein: 18, carbs: 1, fat: 15, calories: 210 },
          { name: 'Banana', quantity: '1 large', protein: 1, carbs: 27, fat: 0, calories: 105 },
        ],
      },
      {
        time: '8:00 PM', icon: MoonIcon, name: 'Dinner',
        vegOptions: [
          { name: 'Chapati', quantity: '3 pieces', protein: 9, carbs: 45, fat: 4, calories: 240 },
          { name: 'Dal makhani', quantity: '200g', protein: 14, carbs: 24, fat: 10, calories: 240 },
          { name: 'Mixed veg curry', quantity: '150g', protein: 4, carbs: 14, fat: 6, calories: 120 },
          { name: 'Warm milk + turmeric', quantity: '250ml', protein: 8, carbs: 12, fat: 8, calories: 150 },
        ],
        nonVegOptions: [
          { name: 'Mutton/Chicken curry', quantity: '200g', protein: 38, carbs: 6, fat: 14, calories: 300 },
          { name: 'Chapati', quantity: '3 pieces', protein: 9, carbs: 45, fat: 4, calories: 240 },
          { name: 'Dal', quantity: '150g', protein: 10, carbs: 18, fat: 2, calories: 130 },
          { name: 'Warm milk + honey', quantity: '250ml', protein: 8, carbs: 18, fat: 8, calories: 170 },
        ],
      },
    ];
  }

  // Toned body
  return [
    {
      time: '7:30 AM', icon: Coffee, name: 'Breakfast',
      vegOptions: [
        { name: 'Overnight oats', quantity: '50g oats + 150ml milk', protein: 10, carbs: 35, fat: 6, calories: 230 },
        { name: 'Mixed nuts', quantity: '20g', protein: 4, carbs: 4, fat: 10, calories: 120 },
        { name: 'Banana', quantity: '1 medium', protein: 1, carbs: 23, fat: 0, calories: 89 },
      ],
      nonVegOptions: [
        { name: 'Egg omelette (2 whole + 2 whites)', quantity: '4 eggs', protein: 22, carbs: 2, fat: 12, calories: 200 },
        { name: 'Whole wheat toast', quantity: '2 slices', protein: 8, carbs: 28, fat: 2, calories: 160 },
        { name: 'Orange juice', quantity: '200ml', protein: 1, carbs: 22, fat: 0, calories: 88 },
      ],
    },
    {
      time: '10:30 AM', icon: Cookie, name: 'Mid-Morning Snack',
      vegOptions: [
        { name: 'Sprouts salad', quantity: '100g', protein: 8, carbs: 14, fat: 1, calories: 100 },
        { name: 'Buttermilk', quantity: '200ml', protein: 3, carbs: 5, fat: 1, calories: 40 },
      ],
      nonVegOptions: [
        { name: 'Boiled eggs', quantity: '2 whole', protein: 12, carbs: 1, fat: 10, calories: 140 },
        { name: 'Apple', quantity: '1 medium', protein: 0, carbs: 22, fat: 0, calories: 80 },
      ],
    },
    {
      time: '1:00 PM', icon: Sun, name: 'Lunch',
      vegOptions: [
        { name: 'Quinoa / Brown rice', quantity: '120g cooked', protein: 5, carbs: 28, fat: 2, calories: 140 },
        { name: 'Tofu / Paneer curry', quantity: '120g', protein: 16, carbs: 6, fat: 10, calories: 175 },
        { name: 'Mixed dal', quantity: '150g', protein: 12, carbs: 18, fat: 2, calories: 140 },
        { name: 'Green salad', quantity: '1 bowl', protein: 2, carbs: 8, fat: 1, calories: 45 },
      ],
      nonVegOptions: [
        { name: 'Grilled chicken', quantity: '150g', protein: 46, carbs: 0, fat: 5, calories: 231 },
        { name: 'Brown rice', quantity: '100g cooked', protein: 3, carbs: 24, fat: 1, calories: 112 },
        { name: 'Sautéed veggies', quantity: '150g', protein: 3, carbs: 12, fat: 3, calories: 80 },
        { name: 'Curd', quantity: '100g', protein: 4, carbs: 5, fat: 3, calories: 60 },
      ],
    },
    {
      time: '4:30 PM', icon: Cookie, name: 'Evening Snack',
      vegOptions: [
        { name: 'Protein smoothie (whey/soy)', quantity: '1 scoop + milk', protein: 24, carbs: 12, fat: 3, calories: 170 },
        { name: 'Almonds', quantity: '10 pieces', protein: 3, carbs: 2, fat: 7, calories: 80 },
      ],
      nonVegOptions: [
        { name: 'Grilled fish fingers', quantity: '100g', protein: 20, carbs: 8, fat: 4, calories: 148 },
        { name: 'Green tea', quantity: '1 cup', protein: 0, carbs: 0, fat: 0, calories: 2 },
      ],
    },
    {
      time: '7:30 PM', icon: MoonIcon, name: 'Dinner',
      vegOptions: [
        { name: 'Multigrain roti', quantity: '2 pieces', protein: 8, carbs: 36, fat: 4, calories: 200 },
        { name: 'Paneer tikka', quantity: '100g', protein: 14, carbs: 4, fat: 10, calories: 160 },
        { name: 'Vegetable soup', quantity: '1 bowl', protein: 3, carbs: 10, fat: 2, calories: 65 },
      ],
      nonVegOptions: [
        { name: 'Grilled salmon / fish', quantity: '150g', protein: 34, carbs: 0, fat: 8, calories: 208 },
        { name: 'Steamed vegetables', quantity: '150g', protein: 3, carbs: 10, fat: 1, calories: 55 },
        { name: 'Quinoa', quantity: '80g cooked', protein: 4, carbs: 16, fat: 1, calories: 88 },
      ],
    },
  ];
}

function getMedicalNotes(conditions: string[], goal: FitnessGoal): { title: string; note: string; borderColor: string }[] {
  const notes: { title: string; note: string; borderColor: string }[] = [];

  if (conditions.includes('Diabetes')) {
    notes.push({
      title: '🩺 Diabetes',
      note: goal === 'bulking'
        ? 'Use complex carbs (oats, sweet potato, brown rice) for surplus. Avoid refined sugar & white bread. Monitor blood sugar post-meals.'
        : 'Stick to low-GI carbs. Avoid fruit juices, white rice, and refined sugar. Eat every 3-4 hours to maintain blood sugar.',
      borderColor: 'border-nutrition',
    });
  }
  if (conditions.includes('PCOS')) {
    notes.push({
      title: '🩺 PCOS',
      note: 'Focus on anti-inflammatory foods (turmeric, omega-3). Reduce dairy, refined carbs, and processed food. Include flaxseeds, walnuts, and leafy greens.',
      borderColor: 'border-cycle',
    });
  }
  if (conditions.includes('Thyroid')) {
    notes.push({
      title: '🩺 Thyroid',
      note: 'Avoid raw cruciferous veggies (cook them). Include selenium-rich foods (Brazil nuts, eggs). Take medication 30 min before breakfast.',
      borderColor: 'border-fitness',
    });
  }
  if (conditions.includes('Anemia')) {
    notes.push({
      title: '🩺 Anemia',
      note: 'Increase iron-rich foods: spinach, beetroot, dates, jaggery. Pair with vitamin C for absorption. Avoid tea/coffee with meals.',
      borderColor: 'border-destructive',
    });
  }
  if (conditions.includes('Gastritis')) {
    notes.push({
      title: '🩺 Gastritis',
      note: 'Avoid spicy food, caffeine, and acidic fruits on empty stomach. Eat smaller frequent meals. Include cooling foods like curd and coconut water.',
      borderColor: 'border-wellness',
    });
  }
  if (conditions.includes('Hypertension')) {
    notes.push({
      title: '🩺 Hypertension',
      note: 'Limit sodium to <2g/day. Avoid pickles, processed foods, and excess salt. Include potassium-rich foods (banana, sweet potato).',
      borderColor: 'border-accent',
    });
  }

  return notes;
}

const goalInfo: Record<FitnessGoal, { label: string; icon: React.ElementType; description: string }> = {
  'fat-loss': { label: 'Fat Loss', icon: Flame, description: 'Calorie deficit with high protein to preserve muscle' },
  'toned': { label: 'Toned Body', icon: Target, description: 'Maintenance calories with balanced macros' },
  'bulking': { label: 'Bulking', icon: Dumbbell, description: 'Calorie surplus with high protein for muscle gain' },
};

export default function DietPlanner() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<FitnessGoal>('toned');

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/'); return; }
    setProfile(p);

    // Auto-suggest goal based on BMI
    const bmi = calculateBMI(p.height, p.weight);
    if (bmi.category === 'obese' || bmi.category === 'overweight') setGoal('fat-loss');
    else if (bmi.category === 'underweight') setGoal('bulking');
    else setGoal('toned');
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(profile.height, profile.weight);
  const macros = calculateDailyMacros(profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel, goal);
  const meals = getMealPlans(goal, macros);
  const isVeg = profile.foodPreference === 'vegetarian';
  const medicalNotes = getMedicalNotes(profile.medicalConditions, goal);
  const info = goalInfo[goal];

  const totalMacroGrams = macros.protein + macros.carbs + macros.fat;
  const proteinPct = Math.round((macros.protein / totalMacroGrams) * 100);
  const carbsPct = Math.round((macros.carbs / totalMacroGrams) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Diet Planner" subtitle={`${isVeg ? 'Vegetarian' : 'Non-Veg'} • ${bmi.category} BMI`} showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Goal Selector */}
        <Tabs value={goal} onValueChange={(v) => setGoal(v as FitnessGoal)} className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-2xl bg-secondary">
            {(Object.keys(goalInfo) as FitnessGoal[]).map(g => (
              <TabsTrigger
                key={g}
                value={g}
                className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {goalInfo[g].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Goal Card */}
        <motion.div
          key={goal}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-warm rounded-2xl p-5 text-primary-foreground"
        >
          <div className="flex items-center gap-2 mb-2">
            <info.icon size={22} className="opacity-70" />
            <h3 className="font-bold font-display text-lg">{info.label} Plan</h3>
          </div>
          <p className="text-sm opacity-80">{info.description}</p>
        </motion.div>

        {/* Daily Macros Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-5">
          <h4 className="font-semibold text-foreground mb-1">Daily Target</h4>
          <p className="text-2xl font-bold font-display text-foreground">{macros.calories} <span className="text-sm font-normal text-muted-foreground">kcal/day</span></p>

          {/* Macro bars */}
          <div className="mt-4 space-y-3">
            <MacroRow label="Protein" grams={macros.protein} pct={proteinPct} color="bg-fitness" />
            <MacroRow label="Carbs" grams={macros.carbs} pct={carbsPct} color="bg-nutrition" />
            <MacroRow label="Fat" grams={macros.fat} pct={fatPct} color="bg-accent" />
          </div>
        </motion.div>

        {/* Meal Plans */}
        {meals.map((meal, i) => {
          const options = isVeg ? meal.vegOptions : meal.nonVegOptions;
          const mealCals = options.reduce((s, f) => s + f.calories, 0);
          const mealProtein = options.reduce((s, f) => s + f.protein, 0);
          const mealCarbs = options.reduce((s, f) => s + f.carbs, 0);
          const mealFat = options.reduce((s, f) => s + f.fat, 0);

          return (
            <motion.div
              key={`${goal}-${meal.name}`}
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
                <span className="text-sm font-medium text-nutrition">{mealCals} cal</span>
              </div>

              {/* Mini macro summary */}
              <div className="flex gap-3 mb-3 text-xs">
                <span className="px-2 py-1 rounded-lg bg-fitness/10 text-fitness font-medium">P: {mealProtein}g</span>
                <span className="px-2 py-1 rounded-lg bg-nutrition/10 text-nutrition font-medium">C: {mealCarbs}g</span>
                <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent font-medium">F: {mealFat}g</span>
              </div>

              {/* Food items table */}
              <div className="space-y-2">
                {options.map((food, j) => (
                  <div key={j} className="flex items-start justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.quantity}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground whitespace-nowrap ml-2">
                      <span>{food.protein}p</span>
                      <span>{food.carbs}c</span>
                      <span>{food.fat}f</span>
                      <span className="font-medium text-foreground">{food.calories}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Medical Notes */}
        {medicalNotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle size={16} className="text-destructive" />
              <h4 className="font-semibold text-foreground text-sm">Medical Adjustments</h4>
            </div>
            {medicalNotes.map((n, i) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`glass-card rounded-2xl p-4 border-l-4 ${n.borderColor}`}
              >
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pb-4 pt-2">
          ⚠️ This is a general guide. Consult a certified nutritionist for personalized plans.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

function MacroRow({ label, grams, pct, color }: { label: string; grams: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{grams}g <span className="text-muted-foreground text-xs">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
    </div>
  );
}
