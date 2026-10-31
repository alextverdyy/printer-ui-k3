import { useEffect, useMemo, useState } from 'react';
import { usePrinterStore } from '../stores/usePrinterStore';

export function CommandToast() {
  const commandQueue = usePrinterStore((state) => state.commandQueue);
  const [visible, setVisible] = useState(true);

  const latest = useMemo(() => commandQueue[0], [commandQueue]);
  if (!latest) return null;

  useEffect(() => {
    setVisible(true);

    if (latest.status !== 'success') return;

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [latest.id, latest.status]);

  return (
    <div className={`command-toast ${latest.status} ${visible ? 'visible' : 'hidden'}`}>
      <strong>{latest.label}</strong>
      <span>{latest.status === 'pending' ? 'Pending…' : latest.status === 'success' ? 'Success' : latest.message || 'Failed'}</span>
    </div>
  );
}
