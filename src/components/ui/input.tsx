import { cn } from '@/lib/utils';
import { Loader2Icon, type LucideIcon, X } from 'lucide-react';
import * as React from 'react';
import { Label } from './label';

interface InputWithIconsProps extends React.ComponentProps<'input'> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  showClearButton?: boolean;
  hasError?: boolean;
  isLoading?: boolean;
  label?: string;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputWithIconsProps>(
  (
    {
      className,
      type,
      label,
      required,
      id,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showClearButton = false,
      isLoading = false,
      hasError = false,
      onClear,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const idRef = id ?? 'input-field';
    const [internalValue, setInternalValue] = React.useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      const e = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(e);
      onClear?.();
    };

    const shouldShowClearButton =
      showClearButton && String(internalValue).length > 0;

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    return (
      <div className="grid w-full items-center">
        {label ? (
          <Label htmlFor={id} className="text-xs mb-2" required={required}>
            {label}
          </Label>
        ) : (
          ''
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LeftIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          <input
            id={idRef}
            type={type}
            className={cn(
              'flex h-9 w-full rounded-sm border bg-transparent py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              LeftIcon ? 'pl-10' : 'pl-3',
              RightIcon || shouldShowClearButton ? 'pr-10' : 'pr-3',
              hasError ? 'border-red-300' : 'border-input',
              className
            )}
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            required={required}
            {...props}
          />

          {(isLoading || RightIcon || shouldShowClearButton) && (
            <div className="absolute content-centered right-3 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : shouldShowClearButton ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : RightIcon ? (
                <RightIcon className="h-4 w-4 text-muted-foreground" />
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
