import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Globe } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { MoodMusicEngine, moodConfigs, languageConfigs, Mood } from '@/lib/moodMusic';
import { Slider } from '@/components/ui/slider';
import { getProfile } from '@/lib/store';
import { UserProfile } from '@/lib/types';

const moods: Mood[] = ['sad', 'calm', 'joyful', 'energetic', 'anxious', 'sleepy'];
const languages = Object.keys(languageConfigs) as Array<keyof typeof languageConfigs>;

export default function MoodMusic() {
  const engineRef = useRef<MoodMusicEngine | null>(null);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<UserProfile['language']>('english');

  useEffect(() => {
    engineRef.current = new MoodMusicEngine();
    const profile = getProfile();
    if (profile?.language) setSelectedLang(profile.language);
    return () => {
      engineRef.current?.destroy();
    };
  }, []);
      engineRef.current?.destroy();
    };
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    const engine = engineRef.current;
    if (!engine) return;

    if (activeMood === mood && isPlaying) {
      engine.stop();
      setIsPlaying(false);
      setActiveMood(null);
    } else {
      engine.play(mood);
      engine.setVolume(isMuted ? 0 : volume / 100);
      setActiveMood(mood);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    const engine = engineRef.current;
    if (!engine || !activeMood) return;

    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      engine.play(activeMood);
      engine.setVolume(isMuted ? 0 : volume / 100);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    setIsMuted(v === 0);
    engineRef.current?.setVolume(v / 100);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    engineRef.current?.setVolume(newMuted ? 0 : volume / 100);
  };

  const activeConfig = activeMood ? moodConfigs[activeMood] : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Mood Music" subtitle="Ambient sounds tailored to how you feel" showBack />

      <div className="px-5 mt-4 space-y-6">
        {/* Now Playing */}
        <AnimatePresence>
          {activeConfig && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="glass-card rounded-2xl p-5 relative overflow-hidden"
            >
              {/* Animated background pulse */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{ background: activeConfig.color }}
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${activeConfig.color}20` }}
                    >
                      {activeConfig.emoji}
                    </div>
                    <div>
                      <p className="font-bold font-display text-foreground text-lg">{activeConfig.label}</p>
                      <p className="text-xs text-muted-foreground">{isPlaying ? 'Now Playing' : 'Paused'}</p>
                    </div>
                  </div>
                  <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full flex items-center justify-center gradient-warm text-primary-foreground"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                  </button>
                </div>

                {/* Visualizer bars */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-8 mb-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 rounded-full"
                        style={{ backgroundColor: activeConfig.color }}
                        animate={{
                          height: [
                            `${Math.random() * 60 + 10}%`,
                            `${Math.random() * 90 + 10}%`,
                            `${Math.random() * 40 + 10}%`,
                          ],
                        }}
                        transition={{
                          duration: 0.8 + Math.random() * 0.5,
                          repeat: Infinity,
                          repeatType: 'mirror',
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">{isMuted ? 0 : volume}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Selector */}
        <div>
          <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
            <Music size={18} className="text-primary" /> Choose Your Mood
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood, i) => {
              const config = moodConfigs[mood];
              const isActive = activeMood === mood;
              return (
                <motion.button
                  key={mood}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`relative rounded-2xl p-4 text-left transition-all overflow-hidden ${
                    isActive
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'glass-card hover:shadow-md'
                  }`}
                >
                  {isActive && isPlaying && (
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      style={{ background: config.color }}
                      animate={{ opacity: [0.08, 0.18, 0.08] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{config.emoji}</span>
                      {isActive && isPlaying && (
                        <div className="flex gap-0.5 items-end h-4">
                          {[1, 2, 3].map(b => (
                            <motion.div
                              key={b}
                              className="w-1 rounded-full"
                              style={{ backgroundColor: config.color }}
                              animate={{ height: ['30%', '100%', '50%'] }}
                              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'mirror', delay: b * 0.15 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-foreground">{config.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{config.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mood Benefits */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold font-display text-foreground mb-3">🎵 Music & Wellness</h3>
          <div className="space-y-2.5">
            {[
              { title: 'Stress Relief', desc: 'Calm & anxious relief modes lower cortisol levels and heart rate' },
              { title: 'Better Sleep', desc: 'Sleepy mode uses slow tempos & solfeggio frequencies to ease into sleep' },
              { title: 'Mood Boost', desc: 'Joyful major-key melodies trigger dopamine release in the brain' },
              { title: 'Focus & Energy', desc: 'Energetic rhythms increase alertness and workout performance' },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
