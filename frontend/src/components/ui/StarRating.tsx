import { useState } from 'react';
import { cn } from '@/lib/cn';

interface StarRatingProps {
  value: number;
  onChange: (next: number) => void;
  label?: string;
  error?: string;
  max?: number;
}

/**
 * Star rating com animação de "pop" ao clicar e hover-preview.
 * A11y: cada estrela é um botão com aria-label descritivo.
 */
export function StarRating({ value, onChange, label, error, max = 5 }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;

  return (
    <div className="w-full">
      {label && <span className="field-label">{label}</span>}
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={label ?? 'Avaliação'}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: max }).map((_, i) => {
          const star = i + 1;
          const isActive = star <= active;
          const wasJustPicked = star === value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} de ${max} estrelas`}
              onMouseEnter={() => setHover(star)}
              onFocus={() => setHover(star)}
              onBlur={() => setHover(null)}
              onClick={() => onChange(star)}
              className={cn(
                'p-1 rounded-md min-h-touch min-w-touch md:min-h-[36px] md:min-w-[36px]',
                'flex items-center justify-center transition-transform',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                wasJustPicked && 'animate-star-pop',
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  'h-7 w-7 md:h-6 md:w-6 transition-colors',
                  isActive ? 'text-accent' : 'text-border-strong',
                )}
                fill={isActive ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          );
        })}
        <span className="ml-2 text-xs text-fg-muted tabular-nums" aria-live="polite">
          {value}/{max}
        </span>
      </div>
      {error && (
        <p className="field-error mt-1.5" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
