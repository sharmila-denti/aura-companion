import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Heart, Dumbbell, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/beauty', icon: Sparkles, label: 'Beauty' },
  { path: '/health', icon: Heart, label: 'Health' },
  { path: '/fitness', icon: Dumbbell, label: 'Fitness' },
  { path: '/diet', icon: Utensils, label: 'Diet' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative">
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full gradient-warm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={active ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
