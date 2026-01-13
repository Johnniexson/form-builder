import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

function Modal({
  title = '',
  desc = '',
  open = false,
  className,
  children,
  actionBtns,
  onOpenChange,
  ...props
}: React.ComponentProps<'div'> & {
  title?: string | React.JSX.Element;
  desc?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionBtns?: Array<React.JSX.Element>;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={cn(
          'bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto',
          className
        )}
        {...props}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        {children}
        <div className="mt-4 flex gap-2 justify-end">
          {actionBtns?.map((actionBtn) => (
            <React.Fragment key={actionBtn.key}>{actionBtn}</React.Fragment>
          ))}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Modal };
