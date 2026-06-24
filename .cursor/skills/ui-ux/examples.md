# UI / UX examples — LinkedIn Events Hub

Styles live in **`app/globals.css` only**. Copy values from linkedin.com DevTools before adding rules.

## Person row (Connections page)

```tsx
// components/AttendeeModal.tsx — uses globals.css .li-person-row
<li className="li-person-row">
  <Avatar alt={name} src={photoUrl} />
  <div className="li-person-row__content">
    <span className="li-person-row__name">{name}</span>
    <p className="li-person-row__headline">{headline}</p>
    <ul className="li-person-row__meta-list">
      <li className="li-person-row__meta">
        <span className="li-person-row__meta-label">Also attended</span>
        <TextLink href="#">{eventName}</TextLink>
      </li>
    </ul>
  </div>
  <Button variant="secondary" size="sm" className="li-person-row__action">
    Nudge
  </Button>
</li>
```

## Message-style button (no icon)

```tsx
// Outlined pill — matches linkedin.com/mynetwork Message button
<Button variant="secondary" size="sm">Nudge</Button>
```

## Text link (always blue)

```tsx
<TextLink href="/events/123">Breaking Into DevOps Roles</TextLink>
```

```css
/* app/globals.css */
.li-text-link {
  color: var(--li-blue-interactive);
  font-weight: 600;
  text-decoration: none;
}
.li-text-link:hover {
  color: var(--li-blue-hover);
  text-decoration: underline;
}
```

## DevTools workflow

1. Open reference page (e.g. Connections)
2. Inspect element → **Computed** tab
3. Copy `color`, `font-size`, `font-weight`, `padding`, `border`, `border-radius`
4. Add as `--li-*` token or `.li-*` class in `app/globals.css`
5. Re-check localhost against live site
