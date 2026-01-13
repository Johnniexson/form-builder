import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

type TextAreaProps = {
  label?: string;
} & React.ComponentProps<'textarea'>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, required, ...props }, ref) => {
    return (
      <div className="grid w-full items-center gap-2">
        {label ? (
          <Label htmlFor={props.id} className="text-xs" required={required}>
            {label}
          </Label>
        ) : (
          ''
        )}
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className
          )}
          ref={ref}
          required={required}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
