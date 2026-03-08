import { getProfile } from './store';

const NOTIFICATION_SETTINGS_KEY = 'glow_notifications';
const NOTIFICATION_TIMERS_KEY = 'glow_notification_timers';

export interface NotificationSettings {
  enabled: boolean;
  hydration: boolean;
  skincare: boolean;
  workout: boolean;
  meals: boolean;
  sleep: boolean;
  dental: boolean;
  cycle: boolean;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  hydration: true,
  skincare: true,
  workout: true,
  meals: true,
  sleep: true,
  dental: true,
  cycle: true,
};

export function getNotificationSettings(): NotificationSettings {
  const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: icon || '/favicon.ico', badge: '/favicon.ico' });
}

interface ReminderConfig {
  key: string;
  title: string;
  body: string;
  intervalMs: number;
}

const profile = () => getProfile();

export function getReminders(): ReminderConfig[] {
  const p = profile();
  const isFemale = p?.gender === 'female';

  const reminders: ReminderConfig[] = [
    { key: 'hydration', title: '💧 Stay Hydrated!', body: 'Time to drink a glass of water. Your body needs it!', intervalMs: 60 * 60 * 1000 },
    { key: 'skincare', title: '🧴 Skincare Reminder', body: 'Have you done your skincare routine today?', intervalMs: 8 * 60 * 60 * 1000 },
    { key: 'workout', title: '💪 Workout Time!', body: 'Time for your daily exercise. Even 20 minutes makes a difference!', intervalMs: 24 * 60 * 60 * 1000 },
    { key: 'meals', title: '🥗 Meal Reminder', body: 'Don\'t skip your meal! Eat healthy and balanced.', intervalMs: 4 * 60 * 60 * 1000 },
    { key: 'sleep', title: '😴 Sleep Reminder', body: 'Time to wind down. Aim for 7-9 hours of sleep tonight.', intervalMs: 24 * 60 * 60 * 1000 },
    { key: 'dental', title: '🦷 Dental Care', body: 'Time to brush your teeth and floss!', intervalMs: 12 * 60 * 60 * 1000 },
  ];

  if (isFemale) {
    reminders.push({ key: 'cycle', title: '🌸 Period Tracker', body: 'Don\'t forget to log your cycle today for better predictions.', intervalMs: 24 * 60 * 60 * 1000 });
  }

  return reminders;
}

let activeTimers: NodeJS.Timeout[] = [];

export function startNotificationScheduler() {
  stopNotificationScheduler();

  const settings = getNotificationSettings();
  if (!settings.enabled) return;

  const reminders = getReminders();

  reminders.forEach(reminder => {
    if (settings[reminder.key as keyof NotificationSettings]) {
      // Send first one after a short delay
      const timer = setInterval(() => {
        sendNotification(reminder.title, reminder.body);
      }, reminder.intervalMs);
      activeTimers.push(timer);

      // Also send an initial one after 5 seconds if just enabled
      const lastSent = localStorage.getItem(`glow_last_${reminder.key}`);
      const now = Date.now();
      if (!lastSent || now - parseInt(lastSent) > reminder.intervalMs) {
        setTimeout(() => {
          sendNotification(reminder.title, reminder.body);
          localStorage.setItem(`glow_last_${reminder.key}`, String(now));
        }, 5000 + Math.random() * 10000);
      }
    }
  });
}

export function stopNotificationScheduler() {
  activeTimers.forEach(clearInterval);
  activeTimers = [];
}

// Quick in-app notifications (toast-style tips)
export function getGenderSpecificTips(): string[] {
  const p = profile();
  if (!p) return [];

  if (p.gender === 'male') {
    return [
      '🧔 Grooming tip: Trim and maintain your beard/stubble regularly.',
      '💪 Focus on compound exercises for maximum muscle engagement.',
      '🧴 Use SPF daily — skincare isn\'t just for women!',
      '🥩 Protein intake: Aim for 1.6-2.2g per kg of bodyweight for muscle growth.',
      '😴 Quality sleep boosts testosterone levels naturally.',
      '🧘 Stress management improves both mental and physical health.',
    ];
  }

  if (p.gender === 'female') {
    return [
      '🌸 Track your cycle to sync workouts with your hormonal phases.',
      '💄 Double cleanse at night for clear, glowing skin.',
      '🧘 Yoga and stretching can help with PMS and cramps.',
      '🥗 Iron-rich foods are essential, especially during your period.',
      '💪 Strength training boosts metabolism and bone density.',
      '😴 Prioritize sleep — it\'s the ultimate beauty treatment.',
    ];
  }

  return [
    '✨ Self-care is for everyone. Build a routine that works for you.',
    '💪 Consistent exercise improves mood and energy levels.',
    '🧴 A simple skincare routine goes a long way.',
    '🥗 Balanced nutrition fuels both body and mind.',
    '😴 Good sleep is the foundation of wellness.',
  ];
}
