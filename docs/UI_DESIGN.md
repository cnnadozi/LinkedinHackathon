# UI Design System

Design direction for the LinkedIn Events Hub hackathon build. Reference: [LinkedIn Hackathon Figma board](https://www.figma.com/design/7317KbaaqvI7tnXJeSUGRd/LinkedIn-Hackathon?node-id=0-1).

---

## Design philosophy

**Most of the UI mirrors the live LinkedIn product.** The global shell — navigation, page background, cards, typography, filters, messaging layout, avatars, and connection badges — should match patterns from [linkedin.com/feed](https://www.linkedin.com/feed/) as closely as practical for a demo.

**Minor additions** are limited to the four hackathon features defined in Figma:

1. **Gather** nav icon + calendar overlay  
2. **Enhanced attendee section** on event pages  
3. **Attendee popup** with filters and **Nudge**  
4. **AI connection assistant** panel in messaging  

We recreate LinkedIn patterns in our own React components and CSS — inspired by the live site and Figma mockups, not a literal copy of LinkedIn’s proprietary HTML, assets, or source.

---

## Color tokens

All colors below are defined in `app/globals.css` as `--li-*` CSS variables. Use these consistently across components.

### Figma palette (primary tokens)

| Token | Hex | Use |
|-------|-----|-----|
| LinkedIn Blue | `#0077B5` | Brand, links, active nav states |
| Black | `#000000` | Primary text, icons |
| Dark Gray | `#313335` | Headlines, strong secondary text |
| Medium Gray | `#86888A` | Muted labels, placeholders, metadata |
| Light Gray | `#CACCCE` | Borders, dividers, disabled UI |
| Cyan / Light Blue | `#00A0DC` | Accents, calendar highlights, info states |
| Green | `#427D5D` | Success, “Nudged ✓”, positive CTAs |

### Supporting tokens (LinkedIn UI + Figma specs)

| Token | Hex | Use |
|-------|-----|-----|
| Interactive Blue | `#0A66C2` | Primary buttons, links, focus rings (Figma spec accent) |
| Success Green (alt) | `#057642` | Alternate success / confirmation states |
| Page Background | `#F3F2EF` | Main app background (LinkedIn feed tone) |
| Surface White | `#FFFFFF` | Cards, modals, panels, compose areas |

### CSS variables

```css
:root {
  /* Figma palette */
  --li-blue: #0077B5;
  --li-black: #000000;
  --li-gray-dark: #313335;
  --li-gray-medium: #86888A;
  --li-gray-light: #CACCCE;
  --li-cyan: #00A0DC;
  --li-green: #427D5D;

  /* Supporting */
  --li-blue-interactive: #0A66C2;
  --li-green-alt: #057642;
  --li-bg: #F3F2EF;
  --li-surface: #FFFFFF;
}
```

---

## Typography

Match LinkedIn’s system stack — no custom webfont required for the hackathon:

```css
font-family: -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

| Role | Size (approx.) | Weight | Color |
|------|----------------|--------|-------|
| Page title | 20–24px | 600 | `--li-black` |
| Card title | 16–18px | 600 | `--li-gray-dark` |
| Body | 14–16px | 400 | `--li-gray-dark` |
| Metadata / labels | 12–14px | 400 | `--li-gray-medium` |
| Links | inherit | 600 | `--li-blue-interactive` |

---

## Layout & spacing

Borrow from the LinkedIn feed layout:

| Element | Guideline |
|---------|-----------|
| Max content width | ~1128px centered (nav + main) |
| Nav height | ~52px top global nav |
| Card padding | 12–24px |
| Card border radius | 8px |
| Card shadow | Subtle or 1px `#CACCCE` border on `--li-surface` |
| Page padding | 24px horizontal on desktop |
| Section gap | 8–16px between stacked cards |

---

## Components — reuse vs custom

### Copied from LinkedIn (reference implementation)

| Pattern | Where used |
|---------|------------|
| Global top nav (Home, Network, Jobs, Messaging, etc.) | `AppShell` / all pages |
| Page background + white card surfaces | All pages |
| Event list cards | `/` events feed |
| Filter chips + search bar | Attendee modal |
| Avatar + overlapping avatar stack | Event detail, attendee rows |
| Connection degree badge (1st / 2nd / 3rd) | Attendee list |
| Messaging thread + compose box | `/messages/[connectionId]` |
| Primary / secondary buttons | RSVP, Nudge, Send |

### Custom additions (hackathon features)

| Pattern | Where used | Notes |
|---------|------------|-------|
| **Gather** nav icon | Global nav | Calendar glyph; toggles overlay |
| **Calendar overlay** | App shell | ~80% viewport; month / week / day |
| **Calendar event blocks** | Calendar overlay | Color-coded by event type |
| **Enhanced attendee section** | Event detail | Hyperlinked count + connections strip |
| **“, X connections”** link | Event detail | Opens filtered attendee view |
| **Attendee modal** | Event detail overlay | Partiful-style list + filters |
| **Nudge / Nudged ✓** button | Attendee rows | `--li-green` for confirmed state |
| **AI connection panel** | Messaging page | Collapsible; sparkle icon; three sections |

---

## Component organization

Keep folders minimal — a hackathon doesn’t need a folder per feature.

```
components/
├── linkedin/              # Shared LinkedIn-like primitives only
│   ├── Avatar.tsx
│   ├── AvatarStack.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ConnectionBadge.tsx
│   ├── FilterChips.tsx
│   └── Modal.tsx
│
├── AppShell.tsx           # Nav + main + overlay slot
├── LinkedInNav.tsx        # Top nav + Gather icon
├── CalendarOverlay.tsx    # ~80% calendar overlay (Gather)
├── EventFeed.tsx          # Events list on `/`
├── EventCard.tsx
├── EventDetail.tsx        # Banner, RSVP, attendee section
├── AttendeeModal.tsx      # Guest list, filters, Nudge
├── MessageThread.tsx
├── MessageCompose.tsx
└── AiConnectionPanel.tsx  # Shared themes, mutual events, talking points
```

| Location | What goes here |
|----------|----------------|
| `components/linkedin/` | Reusable UI that mirrors LinkedIn (avatars, cards, buttons, modals, chips) |
| `components/` (root) | Feature-specific components — one file per major UI block; no subfolders unless something grows large |

Add a new subfolder only if a single file becomes unwieldy (unlikely for this scope).

---

## Visual references

1. **Live LinkedIn** — [linkedin.com/feed](https://www.linkedin.com/feed/) for nav, cards, spacing, filters, messaging  
2. **Figma board** — feature specs, mockups, and palette for custom additions  
3. **`app/globals.css`** — source of truth for color tokens once implemented  

---

## Accessibility & interaction

- Interactive elements use `--li-blue-interactive` with visible focus outlines.  
- Success / completed actions (e.g. “Nudged ✓”) use `--li-green` or `--li-green-alt`.  
- Modals trap focus; calendar overlay closes on backdrop click or Escape.  
- AI panel is collapsible so compose remains usable on smaller viewports.
