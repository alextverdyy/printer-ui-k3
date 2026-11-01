# K3 reference UI validation

Based on tdunl410/printer-ui-klipper at 846fc62a2c1756bdbc3a3e79c8d5c47c94d7bf80. The supplied Home/Control screenshots define the intended appearance; the earlier native HelixScreen layout is not this product's visual base.

Verified locally with Node22.23.2 and headless Chromium:

- Production TypeScript/Vite build.
- Nine unit tests: printer state/temperature derivation and appearance validation/contrast.
- Six Playwright interaction cases across 400×1280 and480×800: navigation, cancel-first emergency confirmation, expected emergency HTTP endpoint, keyboard jog payload, scroll area clear of dock, appearance persistence, JSON export/import and credential-field rejection.
- Fourteen offline screenshots across both sizes plus two bright-accent screenshots; no page errors or horizontal overflow. Main captures are committed under docs/screenshots/k3-*.png. Captures use the real app and inherited printer render, with network requests intercepted and no live telemetry.
- Design detector returned no findings. Independent visual review found strong fidelity; its single bright-accent contrast finding was corrected and scored resolved. The targeted final disposition was ship for that finding.
- Installer shell syntax and static-server JavaScript syntax checked. Node version detection now enforces the build toolchain's required minor versions.

The existing Moonraker HTTP/WebSocket transport, file management, heaters, print monitoring, fan controls and installer remain inherited. The browser tests verify intercepted requests, not physical printer outcomes. Physical Waveshare touch/rotation, HDMI/DSI setup, kiosk systemd installation and a live Klipper/Moonraker printer remain unverified.

Reproduce:

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

Set K3_CHROMIUM_PATH only to reuse an already-installed compatible Chromium executable. Browser tests block external traffic and intercept all printer HTTP and WebSocket calls; they do not accept a live printer endpoint.
