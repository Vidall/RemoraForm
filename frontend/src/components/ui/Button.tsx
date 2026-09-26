import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent-hover disabled:bg-accent/40 disabled:text-bg/60 shadow-lg shadow-accent/10',
  secondary:
    'bg-bg-elevated text-fg border border-border hover:border-border-strong hover:bg-bg-card disabled:opacity-50',
  ghost:
    'bg-transparent text-fg-muted hover:text-fg hover:bg-bg-card disabled:opacity-40',
};

// Mobile-first: min-h-touch (48px) no mobile, um pouco menor em desktop.
const sizeClasses: Record<Size, string> = {
  md: 'min-h-touch px-5 py-3 text-sm md:min-h-[44px] md:py-2.5',
  lg: 'min-h-[52px] px-6 py-3.5 text-base md:min-h-[48px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    disabled,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-colors duration-150 select-none',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
});
