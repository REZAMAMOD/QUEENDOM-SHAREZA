import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    setApiKeyState(stored);
    setIsLoading(false);
  }, []);

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKeyState(key);
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState(null);
  }, []);

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    isLoading,
    hasApiKey: !!apiKey
  };
}
