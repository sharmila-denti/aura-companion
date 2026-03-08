import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Dumbbell, Heart, Scissors, BookOpen, Bot, Calendar } from 'lucide-react';
import heyMeLogo from '@/assets/heyme-logo.png';

const plans = [
  { id: 'monthly', label: '1 Month', price: '₹19', period: '/month', savings: '', popular: false },
  { id: 'half-yearly', label: '6 Months', price: '₹99', period: '/6 months', savings: 'Save 13%', popular: true },
  { id: 'yearly', label: '1 Year', price: '₹149', period: '/year', savings: 'Save 35%', popular: false },
];

const benefits = [
  { icon: Bot, text: 'AI Wellness Assistant' },
  { icon: Dumbbell, text: 'Personalized Workouts' },
  { icon: Heart, text: 'Diet & Nutrition Plans' },
  { icon: Sparkles, text: 'Beauty & Skin Tracking' },
  { icon: Scissors, text: 'Hair & Dental Care' },
  { icon: Calendar, text: 'Period Tracker' },
  { icon: BookOpen, text: 'Personal Diary' },
  { icon: Crown, text: 'Health Analytics' },
];

export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('half-yearly');

  const UPI_ID = 'sharmiideepii@oksbi';

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan)!;
    const amount = plan.price.replace('₹', '');
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=HeyMe&am=${amount}&cu=INR&tn=HeyMe+${plan.label}+Subscription`;
    
    // Try UPI intent
    window.location.href = upiUrl;
    
    // Mark as subscribed after redirect attempt
    setTimeout(() => {
      localStorage.setItem('heyme_subscribed', 'true');
      navigate('/onboarding');
    }, 3000);
  };

  const handleSkip = () => {
    localStorage.setItem('heyme_subscribed', 'skipped');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden">
            <img src={heyMeLogo} alt="Hey Me!" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground mb-1">Unlock Hey Me!</h1>
          <p className="text-sm text-muted-foreground">Your complete wellness companion</p>
        </motion.div>
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-5 py-3"
      >
        <div className="glass-card rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 py-3 flex-1"
      >
        <h2 className="text-lg font-bold font-display text-foreground mb-3 text-center">Choose Your Plan</h2>
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left relative ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider gradient-warm text-primary-foreground">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{plan.label}</p>
                  {plan.savings && (
                    <p className="text-xs text-primary font-medium mt-0.5">{plan.savings}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">{plan.price}</p>
                  <p className="text-xs text-muted-foreground">{plan.period}</p>
                </div>
              </div>
              {selectedPlan === plan.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 w-5 h-5 rounded-full gradient-warm flex items-center justify-center"
                >
                  <Check size={12} className="text-primary-foreground" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <div className="px-5 pb-8 space-y-3">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSubscribe}
          className="w-full h-14 rounded-2xl gradient-warm text-primary-foreground font-semibold text-base flex items-center justify-center gap-2"
        >
          <Crown size={18} />
          Subscribe Now
        </motion.button>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-muted-foreground py-2"
        >
          Continue with free trial
        </button>
      </div>
    </div>
  );
}
