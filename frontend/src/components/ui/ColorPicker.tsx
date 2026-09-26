import { useId } from 'react';
import { cn } from '@/lib/cn';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
  hint?: string;
}

/**
 * ColorPicker com input nativo + campo hex controlado.
 * Mobile-first: 56px de área de swatch, área de toque confortável.
 */
export function ColorPicker({ label, value, onChange, error, hint }: ColorPickerProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Normaliza para o input[type=color] que exige #RRGGBB
  const normalized = (() => {
    const v = value?.startsWith('#') ? value : `#${value ?? ''}`;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    return '#000000';
  })();

  return (
    <div className="w-full">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-bg-card p-2',
          'focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg',
          error ? 'border-danger' : 'border-border hover:border-border-strong',
        )}
      >
        <label
          htmlFor={id}
          className="relative h-12 w-12 md:h-10 md:w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border"
          style={{ backgroundColor: normalized }}
          aria-label="Abrir seletor de cor"
        >
          <input
            id={id}
            type="color"
            value={normalized}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-describedby={error ? errorId : hint ? hintId : undefined}
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full min-w-0 bg-transparent text-base md:text-sm outline-none placeholder:text-fg-subtle uppercase tracking-wide"
          maxLength={7}
        />
      </div>

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
  );
}
