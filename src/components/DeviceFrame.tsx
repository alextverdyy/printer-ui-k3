import type { ReactNode } from 'react';

// Use the real panel viewport. The previous aspect lock resized the box without
// scaling its content, clipping controls on shorter Waveshare displays.
export function DeviceFrame({ children }: { children: ReactNode }) {
  return <main className="device">{children}</main>;
}
