/**
 * Wrapper HTTP enxuto em torno de fetch nativo.
 * - Base URL vinda de VITE_API_URL.
 * - Retorna JSON já parseado + status.
 * - Não lança em erro HTTP: devolve o payload de erro
 *   para o caller decidir mapeamento (ex: 400 -> setError por field).
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

export interface ApiOk<T> {
  ok: true;
  status: number;
  data: T;
}

export interface ApiErr<E = unknown> {
  ok: false;
  status: number;
  data: E;
}

export type ApiResult<T, E = unknown> = ApiOk<T> | ApiErr<E>;

interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T, E = unknown>(
  path: string,
  init: ApiRequestInit = {},
): Promise<ApiResult<T, E>> {
  const { body, headers, ...rest } = init;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const status = response.status;
  const text = await response.text();
  const parsed = text ? (JSON.parse(text) as unknown) : null;

  if (response.ok) {
    return { ok: true, status, data: parsed as T };
  }
  return { ok: false, status, data: parsed as E };
}

export const api = {
  get: <T, E = unknown>(path: string, init?: ApiRequestInit) =>
    request<T, E>(path, { ...init, method: 'GET' }),
  post: <T, E = unknown>(path: string, body?: unknown, init?: ApiRequestInit) =>
    request<T, E>(path, { ...init, method: 'POST', body }),
  patch: <T, E = unknown>(path: string, body?: unknown, init?: ApiRequestInit) =>
    request<T, E>(path, { ...init, method: 'PATCH', body }),
  del: <T, E = unknown>(path: string, init?: ApiRequestInit) =>
    request<T, E>(path, { ...init, method: 'DELETE' }),
};
