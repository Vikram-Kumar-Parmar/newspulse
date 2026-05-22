import { useEffect, useState } from 'react';
import { searchPackage } from '../services/npmService';
import { PackageResult } from '../types/package';

export function usePackageSearch(query: string) {
  const [data, setData] = useState<PackageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const results = await searchPackage(query);
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return { data, loading, error };
}
