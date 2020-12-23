import { useState, useCallback, useEffect } from 'react';
import tap from 'lodash/tap';

export const useQueryParam = (nameParam: string): [string | null, (newValue: string) => void] => {
  const [initialValue, setInitialValue] = useState<string | null>(null);
  const syncInitialValue = useCallback(() => {
    setInitialValue(new URLSearchParams(window.location.search).get(nameParam) || '');
  }, []);

  useEffect(() => {
    syncInitialValue();
  }, []);

  const updateInitialValue = useCallback((value: string) => {
    setInitialValue(value);
    const newSearchParams = `?${tap(
      new URLSearchParams(window.location.search), 
      (queryParams) => queryParams.set(nameParam, value)
    ).toString()}`;

    window.history.pushState(null, '', newSearchParams);
  }, []);

  return [initialValue, updateInitialValue];
}