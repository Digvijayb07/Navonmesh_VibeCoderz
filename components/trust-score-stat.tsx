'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/stat-card';
import { createClient } from '@/utils/supabase/client';

export function TrustScoreStat() {
  const [score, setScore] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('trust_score, total_completed, total_failed')
        .eq('id', data.user.id)
        .single();
      if (profile) {
        setScore(profile.trust_score ?? 50);
        setTotal((profile.total_completed ?? 0) + (profile.total_failed ?? 0));
      }
    });
  }, []);

  const scoreOut5 = score !== null ? (score / 20).toFixed(1) : '—';

  return (
    <StatCard
      icon="⭐"
      title="Trust Score"
      value={`${scoreOut5}/5`}
      subtitle={`Based on ${total} transactions`}
      trend={score !== null && score >= 50 ? Math.round(score - 50) : undefined}
    />
  );
}
