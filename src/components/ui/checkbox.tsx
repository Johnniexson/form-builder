import type * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

function Checkbox({
  className,
  label,
  required,
  onCheckedChange,
  ...props
}: React.ComponentProps<'input'> & {
  label?: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = props.id ?? 'checkbox-input';
  return (
    <div className="flex items-center text-sm">
      <input
        id={id}
        type="checkbox"
        {...props}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={cn('mr-2 hover:cursor-pointer', className)}
      />
      {label ? (
        <Label
          htmlFor={id}
          className="text-xs -mb-0.5 font-normal"
          required={required}
        >
          {label}
        </Label>
      ) : (
        ''
      )}
    </div>
  );
}

export { Checkbox };
