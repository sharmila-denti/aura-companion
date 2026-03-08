import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscribed(null);
      setPlan(null);
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
      } else if (data && data.status === 'active') {
        setSubscribed(true);
        setPlan(data.plan);
      } else {
        setSubscribed(false);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const saveSubscription = async (planId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        { user_id: user.id, plan: planId, status: 'active' },
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

  return { subscribed, plan, loading, saveSubscription, skipSubscription };
}
