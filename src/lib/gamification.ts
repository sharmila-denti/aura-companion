// Gamification system — points, levels, daily targets, unlockables

const POINTS_KEY = 'heyme_points';
const TARGETS_KEY = 'heyme_targets';
const UNLOCKS_KEY = 'heyme_unlocks';

export interface DailyTarget {
  id: string;
  label: string;
  icon: string;
  category: 'health' | 'beauty' | 'fitness' | 'diet' | 'mindfulness';
  points: number;
  completed: boolean;
}

export interface UnlockableFeature {
  id: string;
  label: string;
  description: string;
  icon: string;
  requiredPoints: number;
  unlocked: boolean;
}

export interface GamificationState {
  totalPoints: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  dailyPointsToday: number;
}

const DEFAULT_DAILY_TARGETS: Omit<DailyTarget, 'completed'>[] = [
  { id: 'water', label: 'Drink 8 glasses of water', icon: '💧', category: 'health', points: 10 },
  { id: 'steps', label: 'Walk 5,000 steps', icon: '🚶', category: 'fitness', points: 15 },
  { id: 'skincare', label: 'Complete skincare routine', icon: '✨', category: 'beauty', points: 10 },
  { id: 'meal', label: 'Eat a balanced meal', icon: '🥗', category: 'diet', points: 10 },
  { id: 'sleep', label: 'Sleep 7+ hours', icon: '😴', category: 'health', points: 15 },
  { id: 'journal', label: 'Write in your diary', icon: '📝', category: 'mindfulness', points: 10 },
  { id: 'workout', label: 'Complete a workout', icon: '💪', category: 'fitness', points: 20 },
  { id: 'meditate', label: '5 min meditation', icon: '🧘', category: 'mindfulness', points: 10 },
];

export const UNLOCKABLE_FEATURES: UnlockableFeature[] = [
  { id: 'mood_music', label: 'Mood Music', description: 'Unlock curated playlists for your mood', icon: '🎵', requiredPoints: 50, unlocked: false },
  { id: 'ai_coach', label: 'AI Wellness Coach', description: 'Get personalized AI coaching', icon: '🤖', requiredPoints: 100, unlocked: false },
  { id: 'style_advisor', label: 'Style Advisor', description: 'AI fashion & outfit suggestions', icon: '👗', requiredPoints: 200, unlocked: false },
  { id: 'advanced_analytics', label: 'Advanced Analytics', description: 'Detailed health trend charts', icon: '📊', requiredPoints: 350, unlocked: false },
  { id: 'custom_avatar', label: 'Custom Avatar Items', description: 'Unlock premium avatar accessories', icon: '👑', requiredPoints: 500, unlocked: false },
  { id: 'premium_diet', label: 'Premium Diet Plans', description: 'Access advanced meal planners', icon: '🍽️', requiredPoints: 750, unlocked: false },
];

export function getGamificationState(): GamificationState {
  const data = localStorage.getItem(POINTS_KEY);
  if (data) {
    const state = JSON.parse(data) as GamificationState;
    const today = new Date().toISOString().split('T')[0];
    if (state.lastActiveDate !== today) {
      state.dailyPointsToday = 0;
      // Check streak
      const lastDate = new Date(state.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) state.streak = 0;
      state.lastActiveDate = today;
      saveGamificationState(state);
    }
    return state;
  }
  const initial: GamificationState = {
    totalPoints: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyPointsToday: 0,
  };
  saveGamificationState(initial);
  return initial;
}

function saveGamificationState(state: GamificationState) {
  localStorage.setItem(POINTS_KEY, JSON.stringify(state));
}

export function getLevelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function getPointsForNextLevel(level: number): number {
  return level * 100;
}

export function addPoints(points: number): GamificationState {
  const state = getGamificationState();
  state.totalPoints += points;
  state.dailyPointsToday += points;
  state.level = getLevelFromPoints(state.totalPoints);
  state.streak = Math.max(state.streak, 1);
  saveGamificationState(state);
  return state;
}

export function getDailyTargets(): DailyTarget[] {
  const today = new Date().toISOString().split('T')[0];
  const key = `${TARGETS_KEY}_${today}`;
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  const targets = DEFAULT_DAILY_TARGETS.map(t => ({ ...t, completed: false }));
  localStorage.setItem(key, JSON.stringify(targets));
  return targets;
}

export function completeTarget(targetId: string): { target: DailyTarget; newState: GamificationState } | null {
  const today = new Date().toISOString().split('T')[0];
  const key = `${TARGETS_KEY}_${today}`;
  const targets = getDailyTargets();
  const target = targets.find(t => t.id === targetId);
  if (!target || target.completed) return null;
  target.completed = true;
  localStorage.setItem(key, JSON.stringify(targets));
  const newState = addPoints(target.points);
  return { target, newState };
}

export function getUnlockedFeatures(): UnlockableFeature[] {
  const state = getGamificationState();
  return UNLOCKABLE_FEATURES.map(f => ({
    ...f,
    unlocked: state.totalPoints >= f.requiredPoints,
  }));
}
