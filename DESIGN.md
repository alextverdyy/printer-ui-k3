---
name: K3 portrait touchscreen
description: The supplied K3 printer interface, preserved for a portrait touch panel.
colors:
  accent: "#7b4dff"
  accent-2: "#9a79ff"
  accent-text: "#d9ccff"
  bg: "#0b0d13"
  surface: "#161921"
  surface-soft: "#1c2029"
  surface-strong: "#232834"
  border: "#2f3643"
  text: "#eceff6"
  text-muted: "#9aa4b7"
  success: "#23d568"
  warning: "#e7a21a"
  danger: "#e04f5f"
typography:
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif"
    fontSize: "calc(28px * var(--ui-text-scale))"
    fontWeight: 700
    lineHeight: 1.1
  card-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif"
    fontSize: "calc(20px * var(--ui-text-scale))"
    fontWeight: 650
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif"
    fontSize: "calc(16px * var(--ui-text-scale))"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif"
    fontSize: "calc(12px * var(--ui-text-scale))"
    fontWeight: 650
    letterSpacing: "0.08em"
rounded:
  sm: "12px"
  md: "20px"
  lg: "28px"
  button: "16px"
  primary: "18px"
  dock: "24px"
  pill: "999px"
spacing:
  gap: "12px"
  inset: "14px"
  control: "16px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "var(--accent-foreground)"
    rounded: "{rounded.primary}"
    padding: "20px 16px"
  button-default:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "12px 10px"
  button-selected:
    backgroundColor: "color-mix(in srgb, var(--accent) 30%, var(--surface-strong))"
    textColor: "var(--accent-text)"
    rounded: "{rounded.button}"
    padding: "12px 10px"
  input:
    backgroundColor: "#11151d"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  temperature-chip:
    backgroundColor: "rgba(12, 14, 20, 0.86)"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "10px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "14px"
  navigation:
    backgroundColor: "rgba(14, 17, 24, 0.96)"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.dock}"
    padding: "16px 12px"
---

# Design System: K3 portrait touchscreen

## Overview

**Creative North Star: "The K3 portrait control panel"**

The user's two supplied screenshots and the upstream tdunl410/printer-ui-klipper interface define this visual system. Charcoal surfaces, violet actions and the K3 printer render establish the identity. This is an extension of that interface; HelixScreen's native dashboard was explicitly rejected.

The panel is dense enough for printer operation, with generous touch controls, clear telemetry and a permanent labeled navigation dock. Appearance changes stay within the existing visual structure. The reference composition is the authority; the metaphor below is descriptive shorthand.

**Key Characteristics:**
- Charcoal layers with violet selected actions.
- A prominent printer render, temperature chips and Print action.
- Circular XY motion controls beside separate Z buttons.
- Four permanent icon-and-text navigation tabs.

## Colors

The normative palette above comes from `src/styles/theme.css`; CSS remains the implementation source of truth.

### Primary

Violet accent marks the Print action and selected controls. Its lighter companion supports focus indicators and temperature series; pale violet text belongs on subdued accent fills.

Existing blue, green and rose themes remain available through the stylesheet's theme overrides. A custom six-digit hex accent overrides the main accent locally. The companion accent remains theme-derived. For custom accents, foregrounds are chosen independently for the solid accent, selected blend (30% accent over the strong surface), and pressed blend (40%). Do not reuse the solid-accent foreground on a blended surface without checking it.

### Neutral

Near-black background, charcoal surfaces and a stronger raised-control surface provide structure. Cool-white text carries primary information; muted blue-gray text carries units, secondary readings and labels. Borders separate neighboring dark surfaces.

Success green, warning amber and danger red communicate status. The emergency action uses a restrained danger outline and translucent fill.

**The Reference Palette Rule.** Preserve charcoal surfaces and the existing theme system when adding controls; customization changes accent treatment within this structure.

## Typography

Use the existing system sans-serif stack; Inter is a fallback name, not a newly loaded font. Printer titles use the title role; card titles use the smaller semibold role. Compact uppercase labels use the label role and tracked lettering. Body controls use the body role. Telemetry values remain visually stronger than their muted labels.

Text size settings are (100%, 110%, 120%). The scale affects printer titles, card titles, card labels, navigation labels and selected shared control/body selectors. It does not globally scale every measurement or text element: the Home Print label, several telemetry values and temperature pills retain their source sizing. Preserve wrapping and touch-target space when adjusting typography.

## Layout

Use the actual portrait viewport, capped at (480px) wide and (1480px) high. The panel fills available width and dynamic viewport height within those limits and is centered on wider desktop screens. The reference panel is (400×1280); the short portrait check is (480×800).

The screen is a vertical flex layout. The header and bottom navigation reserve their own space; only the middle content scrolls. Shared horizontal insets are the inset token; content uses the gap token. Cards and status grids stay in document flow. At heights up to (850px), dock padding and tab height become compact while all four labels remain visible. Account for the bottom safe area.

The Home composition remains status pair, printer hero with overlaid temperature chips, three statistics, full-width Print, then Move / Preheat / Extrude rows. Control remains XYZ coordinates, Homing, Axis Controls, Cooling / Fan Speeds and macros. Do not promote this page order into a requirement for unrelated screens.

**The Reserved Navigation Rule.** Content must scroll above the dock rather than disappear beneath it; preserve reserved flex space at every supported text size.

## Elevation & Depth

Dark tonal layering and fine borders carry most structure. Existing diffuse black shadows lift cards, the printer hero, dock and dialogs; do not introduce bright glass effects or decorative gradients beyond the incumbent treatment. The hero uses a quiet dark vertical gradient and a separate image drop shadow.

Cards use (0 8px 18px rgba(0, 0, 0, 0.28)); the hero uses (0 10px 22px rgba(0, 0, 0, 0.38)); the dock uses (0 -8px 24px rgba(8, 10, 16, 0.42)); dialogs use (0 10px 30px rgba(0, 0, 0, 0.42)). These values live in the sidecar because the frontmatter component schema has no shadow field.

Motion is limited to state feedback, toast entrance/exit and progress updates. Honor reduced motion; the existing media query reduces transition and animation durations.

## Shapes

Use softly rounded rectangles, pill-shaped temperature/theme chips and the distinctive circular jog control. Cards use the medium radius; ordinary buttons use the button radius; the primary action uses its own radius. Keep these observed distinctions instead of imposing one radius everywhere. Fine borders remain visible between dark surfaces. Separate tall Z buttons sit beside the radial XY geometry.

## Components

### Buttons

Ordinary controls use the strong surface, semibold text, and a minimum height of (56px). Inputs and temperature targets have a minimum height of (44px). The Home Print action is prominent with a minimum height of (86px) and a (34px) label. Quick actions remain full-width text/icon rows.

Selected buttons use the subdued accent blend; pressed buttons use the stronger blend. Disabled controls reduce opacity and use the disabled cursor. Interactive elements expose a visible companion-accent focus outline; jog segments instead emphasize their stroke. Do not invent lift-on-hover behavior: the incumbent touchscreen system emphasizes pressed and keyboard-focus feedback.

### Chips

Temperature chips sit over the printer hero, use dark translucent pill surfaces and separate current/target text. Status chips use smaller rounded rectangles, muted labels and bold readings. Theme chips show a swatch and a selected accent border.

### Cards / Containers

Cards group related operations with surface fill, fine border, medium corners and inset padding. Uppercase muted labels identify sections; larger semibold titles are used where the source includes them. Preserve the printer hero and its existing K3 image rather than substituting decorative imagery.

### Inputs / Fields

Fields use a near-black inset fill, fine border, small corners and readable foreground text. Custom accent uses a native color input. Appearance import/export controls sit with the text-size choices and reset action. The version-1 profile contains only `version`, `accent` and `textScale`; imports reject unknown keys and files over (4 KB). Settings persist in browser-local storage and do not modify printer credentials or machine configuration.

### Navigation

The rounded dock always exposes Home / Print / Control / Settings with both icons and text. Muted inactive tabs become white on a translucent accent selection surface. Print leads to the active print view during printing/paused jobs, otherwise the file list. Compact navigation at short heights retains the same information structure.

### Motion controls and dialogs

The annular XY jog uses four direction segments around a central Home XY control, with independent Z+ / Z− buttons. SVG jog buttons support Enter and Space and have visible keyboard focus. Keep the explicit Homing / Axis Controls / Cooling labels and All / XY / Z homing actions.

Confirmation dialogs use the existing modal overlay with dialog semantics, labeled title and action buttons. They initially focus the final cancel action, wrap Tab among enabled action buttons and restore prior focus on close. This implementation uses an ARIA dialog on a div; it is not an HTML `<dialog>`. Its focus handling is button-specific, so do not assume a general focus trap for future arbitrary form content.

Browser review captures live in `.impeccable/review/400x1280/` and `.impeccable/review/480x800/` for Home, Control, appearance, a bright accent and large text. Physical Waveshare touch behavior and live-printer operation remain unverified.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied K3 screenshots and existing printer render as the visual authority.
- **Do** keep the header and all four labeled tabs reachable while the middle scrolls.
- **Do** retain the prominent Print action, quick-action rows, radial XY jog and separate Z buttons.
- **Do** verify custom accents, largest text and short portrait viewports when changing shared controls.
- **Do** keep appearance imports restricted to the versioned accent and text-size profile.

### Don't:

- **Don't** substitute the rejected native HelixScreen dashboard or an icon-only grid.
- **Don't** shrink the entire interface to fit a shorter viewport; allow the middle to scroll.
- **Don't** treat disconnected readings as live printer telemetry.
- **Don't** mix printer credentials, machine state or printer configuration into appearance exports.
