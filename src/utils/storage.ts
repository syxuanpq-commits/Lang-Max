/**
 * Safe localStorage wrapper that handles SSR, incognito mode restrictions, and quotas
 */

export function safeGetItem(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return window.localStorage.getItem(key);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    console.warn(`Error setting localStorage key "${key}":`, err);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn(`Error removing localStorage key "${key}":`, err);
  }
}
