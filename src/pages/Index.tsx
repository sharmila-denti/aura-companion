import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/store';
import heyMeLogo from '@/assets/heyme-logo.png';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const profile = getProfile();
    if (profile) navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-soft flex flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-soft)]">
          <Sparkles size={36} className="text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-display text-foreground mb-3">
          Hey <span className="text-gradient">Me!</span>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
          Your all-in-one wellness, beauty, fitness & lifestyle companion
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xs space-y-4"
      >
        <div className="grid grid-cols-3 gap-3 mb-8">
          {['🧴 Beauty', '💪 Fitness', '🥗 Diet', '🩺 Health', '🌸 Cycle', '👗 Style'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="glass-card rounded-xl py-3 px-2 text-center"
            >
              <span className="text-xs font-medium text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={() => navigate('/onboarding')}
          className="w-full h-14 rounded-2xl gradient-warm text-primary-foreground font-semibold text-base border-0 shadow-[var(--shadow-soft)]"
        >
          Get Started
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
