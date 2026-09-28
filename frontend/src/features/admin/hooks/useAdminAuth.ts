import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';

const STORAGE_KEY = 'remora_admin_token';

interface UseAdminAuthReturn {
  token: string | null;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

/**
 * Autenticação do painel admin:
 *  - Persiste o access token em localStorage
 *  - Reage a mudanças cross-tab via evento `storage`
 *  - `login` retorna true/false para o form decidir feedback
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setToken(event.newValue);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const result = await adminService.login(password);
    if (!result.ok) return false;
    window.localStorage.setItem(STORAGE_KEY, result.data.accessToken);
    setToken(result.data.accessToken);
    return true;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: token !== null,
    login,
    logout,
  };
}
