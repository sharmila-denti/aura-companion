export interface UserProfile {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  foodPreference: 'vegetarian' | 'non-vegetarian';
  lifestyle: 'student' | 'professional' | 'sedentary' | 'other';
  medicalConditions: string[];
  skinType?: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  skinTone?: 'fair' | 'light' | 'medium' | 'olive' | 'tan' | 'dark';
  hairTexture?: 'straight' | 'wavy' | 'curly' | 'coily';
  hairDensity?: 'thin' | 'medium' | 'thick';
  hairType?: 'oily' | 'dry' | 'normal' | 'combination';
  language?: 'english' | 'hindi' | 'tamil' | 'telugu' | 'spanish' | 'french' | 'korean' | 'japanese';
}

export interface BMIResult {
  value: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  color: string;
}

export function calculateBMI(height: number, weight: number): BMIResult {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category: BMIResult['category'];
  let color: string;

  if (bmi < 18.5) { category = 'underweight'; color = 'hsl(var(--fitness))'; }
  else if (bmi < 25) { category = 'normal'; color = 'hsl(var(--wellness))'; }
  else if (bmi < 30) { category = 'overweight'; color = 'hsl(var(--nutrition))'; }
  else { category = 'obese'; color = 'hsl(var(--destructive))'; }

  return { value: Math.round(bmi * 10) / 10, category, color };
}

export interface TrackerEntry {
  date: string;
  type: string;
  value: number | string;
  notes?: string;
}

export interface PeriodEntry {
  startDate: string;
  endDate?: string;
  symptoms: string[];
  mood: string;
  flow: 'light' | 'medium' | 'heavy';
}
