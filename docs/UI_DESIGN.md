# UI Design System

Design direction for the LinkedIn Events Hub hackathon. **The live LinkedIn website is the source of truth** — copy computed styles from DevTools into `app/globals.css`.

---

## Design philosophy

**Copy the live LinkedIn product.** For each feature, open the matching page in Chrome DevTools, inspect the target component, and mirror structure + computed CSS in our React components.

| Reference | Use for |
|-----------|---------|
| [linkedin.com/feed](https://www.linkedin.com/feed/) | Nav, page background, cards, typography |
| [linkedin.com/mynetwork/invite-connect/connections/](https://www.linkedin.com/mynetwork/invite-connect/connections/) | Person rows, Message button, filter pills, attendee modal |
| [linkedin.com/messaging](https://www.linkedin.com/messaging/) | Thread layout, compose box |
| [Figma board](https://www.figma.com/design/7317KbaaqvI7tnXJeSUGRd/LinkedIn-Hackathon?node-id=0-1) | Hackathon-only features (Gather, AI panel) |

**Styles live in one file:** `app/globals.css`. Do not add `components/linkedin/*.css`.

---

## Color tokens

All tokens are in `app/globals.css` `:root`. Values below are copied from linkedin.com computed styles.

| Token | Value | Use |
|-------|-------|-----|
| `--li-blue-interactive` | `#0a66c2` | Links, outlined buttons, focus rings |
| `--li-blue-hover` | `#004182` | Link/button hover |
| `--li-blue-tint` | `rgba(10,102,194,0.08)` | Active filters, secondary button hover |
| `--li-text-primary` | `rgba(0,0,0,0.9)` | Names, titles, body |
| `--li-placeholder` | `rgba(0,0,0,0.6)` | Headlines, metadata |
| `--li-border-hairline` | `rgba(0,0,0,0.08)` | Row dividers |
| `--li-bg` | `#f3f2ef` | Page background |
| `--li-surface` | `#ffffff` | Cards, modals |
| `--li-green-alt` | `#057642` | Success, "Nudged ✓" |
| `--li-connections` | `#915907` | "X connections" link on event detail |

**Links are blue (`--li-blue-interactive`), never green.**

---

## Typography

System stack (matches linkedin.com):

```css
font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
```

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Modal title | 20px | 600 | `--li-black` |
| Person name | 16px | 600 | `--li-text-primary` |
| Headline | 14px | 400 | `--li-placeholder` |
| Meta / past events | 12px | 400 | `--li-placeholder` |
| Text links | inherit | 600 | `--li-blue-interactive` |

---

## Layout patterns

### Person row (Connections page)

Class prefix: `.li-person-row`

```
┌────────┬──────────────────────────────────────┬──────────┐
│ Avatar │ Name (16px semibold)                 │  Nudge   │
│  48px  │ Headline (14px gray)                 │ (outline │
│        │ Also attended · Event (12px + link)  │   pill)  │
└────────┴──────────────────────────────────────┴──────────┘
```

- Row padding: `12px 0`, hairline bottom border
- Action button: `Button variant="secondary" size="sm"` — no icon
- **No** 1st/2nd/3rd connection badges in attendee modal

### Message / Nudge button

Copied from Connections **Message** button:

- Outlined pill (`border-radius: 24px`)
- `border: 1px solid #0a66c2`
- White/transparent background, blue text
- `padding: 4px 16px`, `font-size: 14px`, `font-weight: 600`
- No icon inside the button

### Filter bar

Filter pills with hairline border; active state uses blue tint. **Clear filters** link on the right when filters are applied.

---

## Components — reuse vs custom

### Copied from live LinkedIn

| Pattern | Primitive | Where used |
|---------|-----------|------------|
| Person row | `.li-person-row` | Attendee modal |
| Outlined pill button | `Button secondary sm` | Nudge |
| Filled blue CTA | `Button primary` | RSVP, Send |
| Text link | `TextLink` | Event names, inline links |
| Filter pills | `FilterBar`, `FilterDropdown` | Attendee modal |
| Avatar stack | `AvatarStack` | Event detail |
| Modal shell | `Modal` | Attendee modal, calendar |

### Hackathon-only (Figma)

| Pattern | Where |
|---------|-------|
| Gather nav + calendar overlay | App shell |
| Enhanced attendee section | Event detail |
| Nudge / Nudged ✓ flow | Attendee rows |
| AI connection panel | Messaging |

---

## Component organization

```
components/
├── linkedin/     # React primitives only — NO .css files here
└── *.tsx         # Feature components
```

All `.li-*` styles → `app/globals.css`

---

## Accessibility

- Focus rings: `--li-blue-interactive`
- Modals: `role="dialog"`, `aria-modal`, Escape + backdrop close
- Success states use text + color ("Nudged ✓")

---

## Visual verification checklist

Before shipping UI changes:

1. Open the reference linkedin.com page side-by-side with localhost
2. Compare name/headline/meta font sizes and colors in DevTools
3. Confirm links are blue, metadata is gray
4. Confirm row action buttons are outlined pills without icons
5. Confirm only `globals.css` was changed for shared styles
