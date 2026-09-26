import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  showCounter?: boolean;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, showCounter, currentLength, maxLength, className, id, ...rest },
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
      <textarea
        ref={ref}
        id={inputId}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-xl border bg-bg-card px-4 py-3 outline-none transition-colors',
          'placeholder:text-fg-subtle resize-y min-h-[120px] text-base md:text-sm md:min-h-[100px]',
          'focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
          error ? 'border-danger' : 'border-border hover:border-border-strong',
          className,
        )}
        {...rest}
      />
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
