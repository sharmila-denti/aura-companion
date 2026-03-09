import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscribed(null);
      setPlan(null);
      setStatus(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscribed(false);
      } else if (data) {
        setSubscribed(data.status === 'active' || data.status === 'pending');
        setPlan(data.plan);
        setStatus(data.status);
      } else {
        setSubscribed(false);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const saveSubscription = async (planId: string, transactionId?: string, screenshotUrl?: string) => {
    if (!user) return;
    const validPlans = ['monthly', 'half-yearly', 'yearly'];
    if (!validPlans.includes(planId)) {
      throw new Error('Invalid plan');
    }
    if (transactionId && !/^[a-zA-Z0-9]{8,35}$/.test(transactionId)) {
      throw new Error('Invalid transaction ID format');
    }
    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          plan: planId,
          status: 'pending',
          transaction_id: transactionId || null,
          screenshot_url: screenshotUrl || null,
        } as any,
        { onConflict: 'user_id' }
      );
    if (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
    setSubscribed(true);
    setPlan(planId);
  };

  const skipSubscription = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        { user_id: user.id, plan: 'free_trial', status: 'active' },
        { onConflict: 'user_id' }
      );
    if (error) {
      console.error('Error saving subscription:', error);
    }
    setSubscribed(true);
    setPlan('free_trial');
  };

  return { subscribed, plan, status, loading, saveSubscription, skipSubscription };
}
