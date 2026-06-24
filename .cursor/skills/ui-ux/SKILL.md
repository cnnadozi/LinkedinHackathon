---
name: ui-ux
description: >-
  Build and refine UI for the LinkedIn Events Hub hackathon — pages, overlays,
  components, styling, layout, and interaction patterns. Use when implementing
  or changing any UI, UX, styling, components, pages, modals, navigation,
  accessibility, or visual design. Read before any frontend work.
---

# UI / UX

**Mandatory before any UI change.** Match the live LinkedIn product for the shell; limit custom UI to the four hackathon features. Do not ship one-off styles when a primitive already exists.

## Quick workflow

Copy this checklist and track progress:

```
UI work:
- [ ] Read docs/UI_DESIGN.md and PLEASEREADTHIS.md (page + component map)
- [ ] Reuse components/linkedin/* primitives before creating new UI
- [ ] Style with --li-* tokens and .li-* classes in app/globals.css
- [ ] Verify accessibility (focus, labels, keyboard, modal behavior)
- [ ] Run unit tests for behavior (see unit-testing skill)
```

## Required reading (in order)

| Doc | Why |
|-----|-----|
| [PLEASEREADTHIS.md](../../../PLEASEREADTHIS.md) | Routes, overlays, component inventory |
| [docs/UI_DESIGN.md](../../../docs/UI_DESIGN.md) | Tokens, typography, layout, reuse vs custom |
| [app/globals.css](../../../app/globals.css) | Source of truth for CSS variables and `.li-*` classes |

Visual references: [linkedin.com/feed](https://www.linkedin.com/feed/) (shell patterns) · [Figma board](https://www.figma.com/design/7317KbaaqvI7tnXJeSUGRd/LinkedIn-Hackathon?node-id=0-1) (hackathon features)

## Design rules

### Mirror LinkedIn for the shell

Global nav, page background, cards, typography, filters, messaging, avatars, and connection badges should feel like LinkedIn. Recreate patterns in our React + CSS — do not copy LinkedIn HTML, assets, or proprietary source.

### Custom UI is scoped to four features only

1. **Gather** nav icon + calendar overlay  
2. **Enhanced attendee section** on event detail  
3. **Attendee modal** with filters and **Nudge**  
4. **AI connection assistant** panel in messaging  

Everything else uses existing LinkedIn-like primitives.

## Styling conventions

### Tokens — always use CSS variables

Never hardcode hex colors in components. Use `var(--li-*)` from `globals.css`:

| Token | Typical use |
|-------|-------------|
| `--li-bg` | Page background |
| `--li-surface` | Cards, modals, panels |
| `--li-blue-interactive` | Primary buttons, links, focus |
| `--li-green` / `--li-green-alt` | Success, "Nudged ✓" |
| `--li-gray-dark` | Headlines, body |
| `--li-gray-medium` | Metadata, placeholders |
| `--li-gray-light` | Borders, dividers |
| `--li-cyan` | Calendar accents, info states |

Layout tokens: `--li-max-width`, `--li-nav-height`, `--li-radius`, `--li-radius-pill`.

### Class naming — `.li-*` BEM in globals.css

Components apply semantic classes; styles live in `app/globals.css`:

```tsx
// Good — thin component, styles in globals.css
<button className={`li-btn li-btn--primary li-btn--md ${className}`} {...props} />

// Bad — inline styles or ad-hoc Tailwind for LinkedIn primitives
<button style={{ background: "#0A66C2" }} />
```

Add new `.li-*` rules to `globals.css` when extending the design system. Keep component files as markup + props only.

### Typography

System stack only (no custom webfonts):

```css
font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
```

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Page title | 20–24px | 600 | `--li-black` / `--li-text-primary` |
| Card title | 16–18px | 600 | `--li-gray-dark` |
| Body | 14–16px | 400 | `--li-gray-dark` |
| Metadata | 12–14px | 400 | `--li-gray-medium` |
| Links | inherit | 600 | `--li-blue-interactive` |

## Component organization

```
components/
├── linkedin/     # Reusable primitives ONLY (Avatar, Button, Card, Modal, …)
└── *.tsx         # Feature components — one file per major UI block
```

| Need | Action |
|------|--------|
| Button, card, avatar, modal, chips | Import from `components/linkedin/` |
| Event feed, attendee modal, calendar | Create at `components/` root |
| New primitive used in 2+ places | Add to `components/linkedin/` + styles in `globals.css` |
| One-off styling | Extend nearest existing primitive; avoid new folders |

Existing primitives: `Avatar`, `AvatarStack`, `Button`, `Card`, `ConnectionBadge`, `FilterChips`, `Modal`, `SearchInput`, `TextInput`, `TextArea`.

## Pages vs overlays

| Type | Mechanism | Examples |
|------|-----------|----------|
| **Page** | Next.js route (URL changes) | `/`, `/events/[eventId]`, `/messages/[connectionId]` |
| **Overlay** | React state on current page | `CalendarOverlay`, `AttendeeModal` |

Overlays must use `linkedin/Modal.tsx` (backdrop click + Escape to close, focus trap, `aria-modal`).

## Interaction patterns

### Buttons (`Button.tsx`)

| Variant | Use |
|---------|-----|
| `primary` | RSVP, Send, main CTA |
| `secondary` | Cancel, alternate actions |
| `ghost` | Low-emphasis actions |
| `success` | "Nudged ✓" confirmed state |

### Nudge flow

Attendee row → **Nudge** (primary) → navigates to `/messages/[connectionId]` → button becomes **Nudged ✓** (`success` variant, `--li-green`).

### Calendar overlay (Gather)

- Trigger: Gather icon in `LinkedInNav`
- ~80% viewport; month / week / day views
- Color-coded event blocks by type
- Click event → navigate to `/events/[eventId]`
- Close: backdrop, Escape, or explicit close control

### AI connection panel

- Collapsible panel above compose on messaging page
- Sparkle icon; sections: shared themes, mutual events, tappable talking points
- Must not block compose on smaller viewports

## Layout defaults

| Element | Value |
|---------|-------|
| Max content width | `1128px` centered (`--li-max-width`) |
| Nav height | `52px` |
| Card padding | `sm` 12px · `md` 16–24px · `lg` 24px |
| Card radius | `8px` |
| Card surface | White on `--li-bg`; subtle border or shadow |
| Section gap | 8–16px between stacked cards |
| Page padding | 24px horizontal on desktop |

## Accessibility checklist

- [ ] Interactive elements have visible `:focus-visible` (use `--li-blue-interactive`)
- [ ] Buttons and links have accessible names (text or `aria-label`)
- [ ] Modals: `role="dialog"`, `aria-modal`, labelled title, Escape + backdrop close
- [ ] Images / avatars: meaningful `alt` or `aria-hidden` for decorative
- [ ] Color is not the only indicator of state (pair with text, e.g. "Nudged ✓")
- [ ] Keyboard: all actions reachable without mouse

## Anti-patterns

- Hardcoded colors or magic numbers instead of `--li-*` tokens
- New button/card/modal implementations when `components/linkedin/` has one
- Feature subfolders under `components/` unless a file becomes unwieldy
- Inline styles for reusable LinkedIn patterns
- Custom UI outside the four hackathon features
- Routes for content that should be overlays (calendar, attendee list)

## Feature completion gate

Before marking UI work done:

1. Visual check against LinkedIn feed + Figma for the affected area
2. Primitives reused where possible; new styles added to `globals.css`
3. Accessibility checklist passed
4. Unit tests for behavior (not pixel layout) — see [unit-testing](../unit-testing/SKILL.md)

## Additional resources

- Implementation examples: [examples.md](examples.md)
