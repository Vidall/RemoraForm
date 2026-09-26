import clsx, { type ClassValue } from 'clsx';

/**
 * Concatena classes condicionais. Wrapper enxuto de clsx —
 * fica isolado aqui para que, se um dia trocar para tailwind-merge,
 * seja um edit único.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
