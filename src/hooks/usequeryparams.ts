import { useCallback, useMemo } from 'react';
import type { QueryParamsInput } from '../types';

// Mock react-router-dom functions for now - will be replaced when router is available
const useNavigate = () => (path: string) => {
  window.location.href = path;
};
const useLocation = () => ({
  search: window.location.search,
  pathname: window.location.pathname,
  hash: window.location.hash,
});

export function useQueryParams(): {
  params: URLSearchParams;
  setQueryParams: (
    newParams: QueryParamsInput,
    options?: { replace?: boolean; merge?: boolean }
  ) => void;
} {
  const navigate = useNavigate();
  const { search, pathname, hash } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setQueryParams = useCallback(
    (
      newParams: QueryParamsInput,
      options: { replace?: boolean; merge?: boolean } = {}
    ) => {
      if (typeof window === 'undefined') return;
      const { replace = false, merge = true } = options;
      const updated = merge
        ? new URLSearchParams(search)
        : new URLSearchParams();

      let entries: [string, string][];
      if (newParams instanceof URLSearchParams) {
        entries = Array.from(newParams.entries());
      } else {
        entries = Object.entries(newParams).flatMap(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map((v) => [key, v]);
          }
          return [[key, value]];
        });
      }

      entries.forEach(([key, value]) => {
        updated.delete(key);
        updated.append(key, value);
      });

      const searchString = updated.toString();
      const newUrl = pathname + (searchString ? `?${searchString}` : '') + hash;
      navigate(newUrl, { replace });
    },
    [navigate, search, pathname, hash]
  );

  return { params, setQueryParams };
}
