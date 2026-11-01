import { useRef, useState } from 'react';
import { defaultAppearance, parseAppearance, type Appearance } from '../domain/appearance';
import { useAppearanceStore } from '../stores/useAppearanceStore';

export function AppearanceControls() {
  const { appearance, setAppearance, error } = useAppearanceStore();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const exportProfile = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(appearance, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'k3-appearance.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="appearance-controls">
      <label className="appearance-row" htmlFor="accent-color">
        <span>Custom accent</span>
        <input id="accent-color" type="color" value={appearance.accent || '#7b4dff'}
          onChange={(event) => setAppearance({ ...appearance, accent: event.target.value })} />
      </label>
      <fieldset className="appearance-size">
        <legend>Text size</legend>
        <div className="btn-row" aria-label="Text size">
          {([1, 1.1, 1.2] as const).map((scale) => <button type="button" key={scale}
            className={`btn ${appearance.textScale === scale ? 'accent' : ''}`} aria-pressed={appearance.textScale === scale}
            onClick={() => setAppearance({ ...appearance, textScale: scale as Appearance['textScale'] })}>{Math.round(scale * 100)}%</button>)}
        </div>
      </fieldset>
      <div className="btn-row two">
        <button type="button" className="btn" onClick={exportProfile}>Export appearance</button>
        <button type="button" className="btn" onClick={() => input.current?.click()}>Import appearance</button>
      </div>
      <input ref={input} type="file" accept="application/json,.json" hidden onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          if (file.size > 4096) throw new Error('Choose an appearance file smaller than 4 KB.');
          setAppearance(parseAppearance(JSON.parse(await file.text())));
          setMessage('Appearance imported.');
        } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not import appearance.'); }
        event.target.value = '';
      }} />
      <button type="button" className="btn appearance-reset" onClick={() => { setAppearance({ ...defaultAppearance }); setMessage('Default appearance restored.'); }}>Reset custom appearance</button>
      <p className="appearance-note">Saved on this screen. Export includes only the accent and text size.</p>
      {error || message ? <p className="appearance-note" role="status">{error || message}</p> : null}
    </div>
  );
}
