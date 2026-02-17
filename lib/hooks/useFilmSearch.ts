import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { CatalogTitle } from '@/lib/types/catalog';

export function useFilmSearch(query: string) {
  const [results, setResults] = useState<CatalogTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/catalog/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.items || []);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [debouncedQuery]);

  return { results, isLoading, error };
}
