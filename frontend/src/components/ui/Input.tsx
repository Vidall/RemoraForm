import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  /** Sufixo visual dentro do input (ex: `.remoralink.com`). */
  suffix?: ReactNode;
  /** Contador de caracteres — passa `maxLength` que a UI renderiza. */
  showCounter?: boolean;
  /** Valor atual, obrigatório se `showCounter`. */
  currentLength?: number;
}

/**
 * Input mobile-first:
 *  - h-14 no mobile (toque confortável) → h-12 em md+
 *  - Suporta suffix, contador, error e hint
 *  - a11y: label + aria-describedby + aria-invalid
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    suffix,
    showCounter,
    currentLength,
    maxLength,
    className,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy =
    [error ? errorId : undefined, hint ? hintId : undefined].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>

      <div
        className={cn(
          'relative flex items-center rounded-xl border bg-bg-card transition-colors',
          'focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg',
          error ? 'border-danger' : 'border-border hover:border-border-strong',
        )}
      >
        <input
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'peer w-full bg-transparent px-4 outline-none placeholder:text-fg-subtle',
            'h-14 text-base md:h-12 md:text-sm',
            suffix && 'pr-2',
            className,
          )}
          {...rest}
        />
        {suffix && (
          <span className="pr-4 text-sm text-fg-muted select-none whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-2">
        <div className="flex-1">
          {error ? (
            <p id={errorId} className="field-error" role="alert">
              <span aria-hidden="true">⚠</span> {error}
            </p>
          ) : hint ? (
            <p id={hintId} className="field-hint">
              {hint}
            </p>
          ) : null}
        </div>
        {showCounter && typeof maxLength === 'number' && (
          <span
            className={cn(
              'text-[11px] tabular-nums',
              (currentLength ?? 0) > maxLength * 0.9 ? 'text-accent' : 'text-fg-subtle',
            )}
          >
            {currentLength ?? 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});
