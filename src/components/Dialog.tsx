import { useEffect, useId, useRef } from 'react';

interface DialogAction {
  label: string;
  variant?: 'default' | 'accent';
  onClick: () => void;
  disabled?: boolean;
}

interface DialogProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions: DialogAction[];
}

export function Dialog({ title, subtitle, children, actions }: DialogProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const buttons = ref.current?.querySelectorAll<HTMLButtonElement>('button');
    // Focus the final, non-destructive action by default.
    buttons?.[buttons.length - 1]?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div ref={ref} className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby={id}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      <section className="modal-card">
        {subtitle ? <div className="card-label">{subtitle}</div> : null}
        <div id={id} className="card-title">{title}</div>
        {children ? <div>{children}</div> : null}
        <div className={`btn-row top-gap ${actions.length === 2 ? 'two' : ''}`}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`btn ${action.variant === 'accent' ? 'accent' : ''}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
