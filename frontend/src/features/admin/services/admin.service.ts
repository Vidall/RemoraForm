import { api } from '@/services/api';
import type { BriefingResponse, BriefingStatus } from '@remora/core';

/**
 * ============================================================
 *  admin.service — chamadas HTTP do painel admin
 * ============================================================
 *  Reutiliza o wrapper `api` (fetch + JSON) já existente.
 *  Retorna sempre ApiResult (ok/err) para o caller decidir o
 *  mapeamento de erro (ex.: 401 → logout).
 * ============================================================
 */

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export interface LoginResponse {
  accessToken: string;
}

export const adminService = {
  login: (password: string) =>
    api.post<LoginResponse>('/auth/login', { password }),

  listBriefings: (token: string) =>
    api.get<BriefingResponse[]>('/briefing', {
      headers: authHeaders(token),
    }),

  getBriefing: (token: string, id: string) =>
    api.get<BriefingResponse>(`/briefing/${id}`, {
      headers: authHeaders(token),
    }),

  updateStatus: (token: string, id: string, status: BriefingStatus) =>
    api.patch<BriefingResponse>(
      `/briefing/${id}/status`,
      { status },
      { headers: authHeaders(token) },
    ),
};
