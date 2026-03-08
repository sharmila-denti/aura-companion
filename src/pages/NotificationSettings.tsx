import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Droplets, Sparkles, Dumbbell, Utensils, Moon, Heart, Calendar } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermission, sendNotification, NotificationSettings as NS } from '@/lib/notifications';
import { getProfile } from '@/lib/store';
import { toast } from 'sonner';

const reminderConfigs = [
  { key: 'hydration', icon: Droplets, label: 'Hydration Reminders', desc: 'Get reminded to drink water every hour', color: 'text-fitness' },
  { key: 'skincare', icon: Sparkles, label: 'Skincare Routine', desc: 'Morning & evening skincare reminders', color: 'text-beauty' },
  { key: 'workout', icon: Dumbbell, label: 'Workout Alerts', desc: 'Daily exercise reminder', color: 'text-fitness' },
  { key: 'meals', icon: Utensils, label: 'Meal Reminders', desc: 'Don\'t skip meals — eat on time', color: 'text-nutrition' },
  { key: 'sleep', icon: Moon, label: 'Sleep Reminder', desc: 'Wind-down notification at bedtime', color: 'text-accent' },
  { key: 'dental', icon: Heart, label: 'Dental Care', desc: 'Brush & floss reminders', color: 'text-wellness' },
  { key: 'cycle', icon: Calendar, label: 'Cycle Tracking', desc: 'Log your period daily for accuracy', color: 'text-cycle' },
];

export default function NotificationSettingsPage() {
  const profile = getProfile();
  const isMale = profile?.gender === 'male';
  const [settings, setSettings] = useState<NS>(getNotificationSettings());

  const toggle = (key: keyof NS) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const enableAll = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      sendNotification('🔔 Notifications Enabled!', 'You\'ll now receive wellness reminders.');
      toast.success('Notifications enabled! 🔔');
    } else {
      toast.error('Please allow notifications in your browser settings.');
    }
  };

  const filteredReminders = reminderConfigs.filter(r => {
    if (r.key === 'cycle' && isMale) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Reminders" subtitle="Stay on track with smart notifications" showBack />

      <div className="px-5 mt-4 space-y-4">
        {/* Master toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.enabled ? <Bell size={24} className="text-primary" /> : <BellOff size={24} className="text-muted-foreground" />}
              <div>
                <h3 className="font-bold font-display text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">{settings.enabled ? 'Reminders are active' : 'Reminders are off'}</p>
              </div>
            </div>
            <button
              onClick={settings.enabled ? () => toggle('enabled') : enableAll}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                settings.enabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {settings.enabled ? 'On' : 'Turn On'}
            </button>
          </div>
        </motion.div>

        {/* Individual reminders */}
        {settings.enabled && (
          <div className="space-y-3">
            {filteredReminders.map(({ key, icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon size={20} className={color} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(key as keyof NS)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      settings[key as keyof NS] ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${
                        settings[key as keyof NS] ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Test notification */}
        {settings.enabled && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              sendNotification('🧪 Test Notification', 'Your reminders are working correctly!');
              toast.success('Test notification sent!');
            }}
            className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-medium text-sm"
          >
            Send Test Notification 🔔
          </motion.button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
