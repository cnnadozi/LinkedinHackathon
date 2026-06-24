---
name: ui-ux
description: >-
  Build and refine UI for the LinkedIn Events Hub hackathon — pages, overlays,
  components, styling, layout, and interaction patterns. Use when implementing
  or changing any UI, UX, styling, components, pages, modals, navigation,
  accessibility, or visual design. Read before any frontend work.
---

# UI / UX

**Mandatory before any UI change.** Copy layout and computed styles from the **live LinkedIn website**. All styles live in **`app/globals.css` only** — no duplicate CSS files.

## Quick workflow

```
UI work:
- [ ] Open the matching linkedin.com page in Chrome DevTools
- [ ] Inspect target element → copy computed CSS (color, size, padding, border, radius)
- [ ] Read docs/UI_DESIGN.md + docs/APP_MAP.md
- [ ] Reuse components/linkedin/* primitives; add styles to app/globals.css
- [ ] Mirror DOM structure (avatar + content + action button for person rows)
- [ ] Visual check against live site before finishing
- [ ] Run unit tests (see unit-testing skill)
```

## Source of truth: live LinkedIn

| Feature area | Copy from |
|--------------|-----------|
| Nav, feed shell, cards | [linkedin.com/feed](https://www.linkedin.com/feed/) |
| Person rows, Message/Nudge button, filters | [linkedin.com/mynetwork/invite-connect/connections/](https://www.linkedin.com/mynetwork/invite-connect/connections/) |
| Messaging thread + compose | [linkedin.com/messaging](https://www.linkedin.com/messaging/) |
| Hackathon-only flows | [Figma board](https://www.figma.com/design/7317KbaaqvI7tnXJeSUGRd/LinkedIn-Hackathon?node-id=0-1) |

**Do:**
- Copy computed CSS values into `--li-*` tokens in `app/globals.css`
- Match flex layout, typography hierarchy, and pill button styles from DevTools
- Use semantic React components with `.li-*` classes from `globals.css`

**Do not:**
- Invent colors (especially green for links)
- Add styles to `components/linkedin/*.css` — that folder is components only
- Maintain a second stylesheet parallel to `globals.css`
- Hotlink LinkedIn CDN assets in production builds

## Required reading

| Doc | Why |
|-----|-----|
| [docs/APP_MAP.md](../../../docs/APP_MAP.md) | Routes, overlays, component map |
| [docs/UI_DESIGN.md](../../../docs/UI_DESIGN.md) | Tokens, page references, patterns |
| [app/globals.css](../../../app/globals.css) | **Only** stylesheet for `.li-*` classes |

## Styling conventions

### Single stylesheet

`app/layout.tsx` imports **`./globals.css` only**. Every `.li-*` rule belongs there.

### Tokens (from linkedin.com computed styles)

| Token | Value | Use |
|-------|-------|-----|
| `--li-blue-interactive` | `#0a66c2` | Links, outlined buttons, focus |
| `--li-blue-hover` | `#004182` | Hover states |
| `--li-blue-tint` | `rgba(10,102,194,0.08)` | Active filter / button hover fill |
| `--li-text-primary` | `rgba(0,0,0,0.9)` | Names, titles |
| `--li-placeholder` | `rgba(0,0,0,0.6)` | Headlines, metadata |
| `--li-border-hairline` | `rgba(0,0,0,0.08)` | Row dividers |
| `--li-bg` | `#f3f2ef` | Page background |
| `--li-green-alt` | `#057642` | Success / "Nudged ✓" only |

**Links are always `--li-blue-interactive`. Never green.**

### Typography (system stack)

```css
font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
```

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Person name | 16px | 600 | `--li-text-primary` |
| Headline | 14px | 400 | `--li-placeholder` |
| Meta / past events | 12px | 400 | `--li-placeholder` |
| Links | inherit | 600 | `--li-blue-interactive` |

## Key patterns (copied from live site)

### Person row (`.li-person-row`)

Used in attendee modal — matches Connections page:

```
[Avatar 48px] [Name → Headline → meta lines] [Outlined pill button]
```

Classes: `li-person-row`, `li-person-row__content`, `li-person-row__name`, `li-person-row__headline`, `li-person-row__meta-list`, `li-person-row__action`

**No connection degree badges** in the attendee list.

### Buttons (`Button.tsx`)

| Variant | Live LinkedIn equivalent |
|---------|--------------------------|
| `secondary` + `sm` | Connections **Message** / attendee **Nudge** (outlined blue pill, no icon) |
| `primary` | Filled blue CTA (RSVP, Send) |
| `success` | **Nudged ✓** confirmed state |
| `filter` | Filter dropdown pills |

### Past events in attendee rows

Each shared event on its own line:

```
Also attended · Event Name
```

Use `li-person-row__meta` + `TextLink` (blue). Headline always shown separately in `li-person-row__headline`.

### Attendee modal filters

Location, Company, Industry — filter pills + active tags + **Clear filters** (not "All filters").

## Custom UI (hackathon only)

1. Gather nav + calendar overlay  
2. Enhanced attendee section on event detail  
3. Attendee modal (filters + Nudge)  
4. AI connection assistant in messaging  

Everything else uses LinkedIn-copied primitives.

## Anti-patterns

- Green text links (`TextLink` must stay blue)
- Chat/message icon inside Nudge button
- Connection degree (1st/2nd/3rd) in attendee modal
- Duplicate CSS in `linkedin.css` or component-scoped link colors
- Hardcoded hex in TSX instead of `--li-*` tokens

## Feature completion gate

1. DevTools comparison against the reference linkedin.com page
2. Styles only in `app/globals.css`
3. Primitives reused; no one-off button/link implementations
4. Accessibility checklist (focus, labels, modal behavior)
5. Unit tests pass — see [unit-testing](../unit-testing/SKILL.md)

## Additional resources

- [examples.md](examples.md)
