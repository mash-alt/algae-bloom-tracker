import { useEffect, useState } from 'react';

import { subscribeToAlgaeReports, type AlgaeReport } from '@/services/reports';

export type BloomReport = AlgaeReport;

export function useBloomReports() {
  const [reports, setReports] = useState<AlgaeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToAlgaeReports(
      (items) => {
        setReports(items);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setReports([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { reports, loading, error };
}
