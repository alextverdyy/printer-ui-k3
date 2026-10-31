import { useEffect, useMemo, useState } from 'react';
import { usePrinterStore } from '../stores/usePrinterStore';

export function CommandToast() {
  const commandQueue = usePrinterStore((state) => state.commandQueue);
  const [visible, setVisible] = useState(true);

  const latest = useMemo(() => commandQueue[0], [commandQueue]);

  useEffect(() => {
    if (!latest) return;

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [latest]);

  if (!latest) return null;

  return (
    <div className={`command-toast ${latest.status} ${visible ? 'visible' : 'hidden'}`}>
      <strong>{latest.label}</strong>
      <span>{latest.status === 'pending' ? 'Pending…' : latest.status === 'success' ? 'Success' : latest.message || 'Failed'}</span>
    </div>
  );
}
