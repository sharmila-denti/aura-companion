import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplet, Sun, CloudRain, Scissors, FlaskConical, ShoppingBag, ChevronDown, ChevronUp, Leaf, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { addTrackerEntry, getProfile } from '@/lib/store';
import { getSkinRecommendations, getHairRecommendations, getBestTimeLabel, ProductRecommendation } from '@/lib/recommendations';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const skinConditions = ['Clear', 'Oily', 'Dry', 'Acne', 'Pigmentation', 'Redness'];
const routineSteps = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Eye Cream'];
const hairConcerns = ['Hair Fall', 'Dandruff', 'Dryness', 'Oily Scalp', 'Thinning', 'Frizzy'];

function ProductCard({ product, delay = 0 }: { product: ProductRecommendation; delay?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [showNatural, setShowNatural] = useState(false);
  const timeInfo = getBestTimeLabel(product.bestTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-secondary/60 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full p-3.5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{product.icon}</span>
            <p className="text-sm font-semibold text-foreground">{product.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {timeInfo.emoji} {timeInfo.label}
            </span>
            {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <FlaskConical size={12} className="text-primary shrink-0" />
          <p className="text-xs font-medium text-primary">{product.activeIngredient}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{product.usage}</p>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-3">
              {/* Procedure */}
              <div className="bg-background/60 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock size={13} className="text-accent-foreground" />
                  <p className="text-xs font-semibold text-foreground">How to Use</p>
                </div>
                <div className="space-y-1">
                  {product.procedure.split('\n').map((step, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">{step}</p>
                  ))}
                </div>
              </div>

              {/* Natural Alternative Toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowNatural(!showNatural); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-wellness/10 hover:bg-wellness/15 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Leaf size={14} className="text-wellness" />
                  <span className="text-xs font-semibold text-wellness">Natural Alternative</span>
                </div>
                {showNatural ? <ChevronUp size={13} className="text-wellness" /> : <ChevronDown size={13} className="text-wellness" />}
              </button>

              <AnimatePresence>
                {showNatural && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-wellness/5 border border-wellness/20 rounded-lg p-3 space-y-2">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        🌿 {product.naturalAlternative.name}
                      </p>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-wellness mb-0.5">Ingredients</p>
                        <p className="text-[11px] text-muted-foreground">{product.naturalAlternative.ingredients}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-wellness mb-0.5">Preparation</p>
                        <p className="text-[11px] text-muted-foreground">{product.naturalAlternative.preparation}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-wellness mb-0.5">How to Apply</p>
                        <p className="text-[11px] text-muted-foreground">{product.naturalAlternative.usage}</p>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Clock size={11} className="text-wellness" />
                        <p className="text-[11px] font-medium text-wellness">{product.naturalAlternative.bestTime}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BeautyTracker() {
  const today = new Date().toISOString().split('T')[0];
  const profile = getProfile();
  const isMale = profile?.gender === 'male';
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedHairConcerns, setSelectedHairConcerns] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'skin' | 'hair'>('skin');

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleHairConcern = (c: string) => {
    setSelectedHairConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleStep = (s: string) => {
    setCompletedSteps(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const logRoutine = () => {
    addTrackerEntry({
      date: today,
      type: 'skincare',
      value: completedSteps.length,
      notes: `Conditions: ${selectedConditions.join(', ')}. Steps: ${completedSteps.join(', ')}`,
    });
    toast.success(isMale ? 'Grooming routine logged! 💪' : 'Skincare routine logged! ✨');
    setSelectedConditions([]);
    setCompletedSteps([]);
  };

  const skinRecs = getSkinRecommendations(selectedConditions);
  const hairRecs = getHairRecommendations(selectedHairConcerns);

  const tips = [
    { icon: Sun, title: 'Morning Routine', desc: 'Cleanse → Tone → Serum → Moisturize → SPF' },
    { icon: CloudRain, title: 'Night Routine', desc: 'Double cleanse → Tone → Treatment → Night cream' },
    { icon: Droplet, title: 'Hydration', desc: 'Drink 8 glasses of water for glowing skin' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={isMale ? 'Grooming Hub' : 'Beauty Tracker'}
        subtitle={isMale ? 'Track your grooming & get product picks' : 'Track skincare & get product recommendations'}
        showBack
      />

      <div className="px-5 mt-4 space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
          <button
            onClick={() => setActiveTab('skin')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'skin' ? 'gradient-warm text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <Sparkles size={16} /> Skin Care
          </button>
          <button
            onClick={() => setActiveTab('hair')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'hair' ? 'gradient-warm text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <Scissors size={16} /> Hair Care
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'skin' ? (
            <motion.div key="skin" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-6">
              {/* Skin Condition Selector */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-beauty" /> Today's Skin
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Select your concerns to see product & natural remedy recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {skinConditions.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCondition(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedConditions.includes(c)
                          ? 'bg-beauty text-beauty-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Product Recommendations */}
              {skinRecs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                  <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-1">
                    <ShoppingBag size={18} className="text-primary" /> Recommended Products
                  </h3>
                  <p className="text-[11px] text-muted-foreground mb-4">Tap any product to see procedure, timing & natural alternatives</p>
                  <div className="space-y-4">
                    {skinRecs.map(({ condition, products }) => (
                      <div key={condition}>
                        <p className="text-xs font-semibold text-beauty uppercase tracking-wider mb-2">For {condition}</p>
                        <div className="grid gap-2">
                          {products.map((p, i) => (
                            <ProductCard key={p.name} product={p} delay={i * 0.05} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Routine Checklist */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold font-display text-foreground mb-3">Routine Checklist</h3>
                <div className="space-y-2">
                  {routineSteps.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleStep(s)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        completedSteps.includes(s) ? 'bg-beauty/10' : 'bg-secondary'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        completedSteps.includes(s) ? 'border-beauty bg-beauty' : 'border-muted-foreground'
                      }`}>
                        {completedSteps.includes(s) && <span className="text-beauty-foreground text-xs">✓</span>}
                      </div>
                      <span className={`text-sm font-medium ${completedSteps.includes(s) ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={logRoutine}
                  disabled={completedSteps.length === 0}
                  className="w-full mt-4 h-12 rounded-xl gradient-warm text-primary-foreground border-0"
                >
                  Log Routine
                </Button>
              </div>

              {/* Tips */}
              <div className="space-y-3">
                <h3 className="font-bold font-display text-foreground">Skincare Tips</h3>
                {tips.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="glass-card rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-beauty/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-beauty" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="hair" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              {/* Hair Concerns Selector */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-3">
                  <Scissors size={18} className="text-beauty" /> Hair Concerns
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Select your concerns for product & natural remedy recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {hairConcerns.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleHairConcern(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedHairConcerns.includes(c)
                          ? 'bg-beauty text-beauty-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Product Recommendations */}
              {hairRecs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                  <h3 className="font-bold font-display text-foreground flex items-center gap-2 mb-1">
                    <ShoppingBag size={18} className="text-primary" /> Recommended Products
                  </h3>
                  <p className="text-[11px] text-muted-foreground mb-4">Tap any product to see procedure, timing & natural alternatives</p>
                  <div className="space-y-4">
                    {hairRecs.map(({ concern, products }) => (
                      <div key={concern}>
                        <p className="text-xs font-semibold text-beauty uppercase tracking-wider mb-2">For {concern}</p>
                        <div className="grid gap-2">
                          {products.map((p, i) => (
                            <ProductCard key={p.name} product={p} delay={i * 0.05} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Hair Care Tips */}
              <div className="space-y-3">
                <h3 className="font-bold font-display text-foreground">Hair Care Tips</h3>
                {[
                  { icon: Droplet, title: 'Oiling Routine', desc: 'Oil your scalp 1-2x/week with coconut or castor oil. Leave for 1hr before washing.' },
                  { icon: Sun, title: 'Heat Protection', desc: 'Always use heat protectant before styling. Air dry when possible.' },
                  { icon: CloudRain, title: 'Wash Frequency', desc: isMale ? 'Wash every 2-3 days. Over-washing strips natural oils.' : 'Wash 2-3x/week. Use sulfate-free shampoo for colored hair.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="glass-card rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-beauty/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-beauty" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
