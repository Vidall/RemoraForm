import { useCallback, useEffect, useState } from 'react';
import type { BriefingResponse } from '@remora/core';
import { adminService } from '../services/admin.service';

interface UseBriefingsListState {
  briefings: BriefingResponse[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Lista todos os briefings — usada em AdminBriefingsListPage.
 * Em 401, sinaliza erro para o caller decidir logout.
 */
export function useBriefingsList(
  token: string | null,
  onUnauthorized?: () => void,
): UseBriefingsListState {
  const [briefings, setBriefings] = useState<BriefingResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    const result = await adminService.listBriefings(token);
    if (result.ok) {
      setBriefings(result.data);
    } else {
      if (result.status === 401) {
        onUnauthorized?.();
      }
      const message =
        (result.data as { message?: string })?.message ??
        `Erro ${result.status} ao carregar briefings.`;
      setError(message);
    }
    setIsLoading(false);
  }, [token, onUnauthorized]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { briefings, isLoading, error, refetch: fetch };
}

interface UseBriefingState {
  briefing: BriefingResponse | null;
  isLoading: boolean;
  error: string | null;
  setBriefing: (b: BriefingResponse) => void;
  refetch: () => Promise<void>;
}

/**
 * Carrega um briefing por id.
 */
export function useBriefing(
  token: string | null,
  id: string | undefined,
  onUnauthorized?: () => void,
): UseBriefingState {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token || !id) return;
    setIsLoading(true);
    setError(null);
    const result = await adminService.getBriefing(token, id);
    if (result.ok) {
      setBriefing(result.data);
    } else {
      if (result.status === 401) {
        onUnauthorized?.();
      }
      const message =
        (result.data as { message?: string })?.message ??
        `Erro ${result.status} ao carregar briefing.`;
      setError(message);
    }
    setIsLoading(false);
  }, [token, id, onUnauthorized]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { briefing, isLoading, error, setBriefing, refetch: fetch };
}
