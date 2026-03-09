import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Dumbbell, Heart, Scissors, BookOpen, Bot, Calendar, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import heyMeLogo from '@/assets/heyme-logo.png';
import upiQr from '@/assets/upi-qr.jpg';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/hooks/use-toast';

const plans = [
  { id: 'monthly', label: '1 Month', price: '₹39', period: '/month', savings: '', popular: false },
  { id: 'half-yearly', label: '6 Months', price: '₹149', period: '/6 months', savings: 'Save 36%', popular: true },
  { id: 'yearly', label: '1 Year', price: '₹249', period: '/year', savings: 'Save 47%', popular: false },
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
  const { saveSubscription, skipSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState('half-yearly');
  const [showQR, setShowQR] = useState(false);

  const UPI_ID = 'sharmiideepii@oksbi';

  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    const plan = plans.find(p => p.id === selectedPlan)!;
    const amount = plan.price.replace('₹', '');
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=HeyMe&am=${amount}&cu=INR&tn=HeyMe+${plan.label}+Subscription`;
    window.location.href = upiUrl;
    setPaymentInitiated(true);
  };

  const handleSkip = async () => {
    try {
      await skipSubscription();
      navigate('/onboarding');
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    }
  };

  const handlePaymentConfirmed = async () => {
    const trimmed = transactionId.trim();
    if (!trimmed) {
      toast({ title: 'Transaction ID required', description: 'Please enter your UPI transaction/reference ID', variant: 'destructive' });
      return;
    }
    if (!/^[a-zA-Z0-9]{8,35}$/.test(trimmed)) {
      toast({ title: 'Invalid Transaction ID', description: 'Enter a valid 8-35 character alphanumeric transaction ID', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await saveSubscription(selectedPlan, trimmed);
      toast({ title: 'Payment submitted!', description: 'Your subscription will be activated after verification.' });
      navigate('/onboarding');
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
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
          Pay with UPI App
        </motion.button>

        {paymentInitiated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 text-center space-y-3"
          >
            <p className="text-sm font-medium text-foreground">Completed your payment?</p>
            <p className="text-xs text-muted-foreground">
              Enter your UPI Transaction/Reference ID below to verify your payment.
            </p>
            <Input
              value={transactionId}
              onChange={e => setTransactionId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              placeholder="e.g. 412345678901"
              className="h-11 rounded-xl text-center text-sm font-mono tracking-wider"
              maxLength={35}
            />
            <button
              onClick={handlePaymentConfirmed}
              disabled={submitting || !transactionId.trim()}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Verify & Activate →'}
            </button>
          </motion.div>
        )}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          onClick={() => setShowQR(!showQR)}
          className="w-full h-12 rounded-2xl border-2 border-primary bg-primary/5 text-primary font-semibold text-sm flex items-center justify-center gap-2"
        >
          <QrCode size={18} />
          {showQR ? 'Hide QR Code' : 'Pay via QR Code'}
        </motion.button>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <p className="text-sm font-medium text-foreground mb-3">
              Scan to pay <span className="font-bold text-primary">{plans.find(p => p.id === selectedPlan)?.price}</span> for {plans.find(p => p.id === selectedPlan)?.label}
            </p>
            <img src={upiQr} alt="UPI QR Code" className="w-56 mx-auto rounded-xl" />
            <p className="text-xs text-muted-foreground mt-3">UPI ID: sharmiideepii@oksbi</p>
            <Input
              value={transactionId}
              onChange={e => setTransactionId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              placeholder="Enter UPI Transaction ID"
              className="mt-3 h-11 rounded-xl text-center text-sm font-mono tracking-wider"
              maxLength={35}
            />
            <button
              onClick={handlePaymentConfirmed}
              disabled={submitting || !transactionId.trim()}
              className="mt-2 w-full h-10 rounded-xl bg-secondary text-foreground text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Verify & Activate →'}
            </button>
          </motion.div>
        )}

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
