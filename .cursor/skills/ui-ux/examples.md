# UI / UX examples — LinkedIn Events Hub

Styles live in **`app/globals.css` only**. Copy values from linkedin.com DevTools before adding rules.

## Person row (Connections page)

```tsx
// components/AttendeeModal.tsx — uses globals.css .li-person-row
<li className="li-person-row">
  <Avatar alt={name} src={photoUrl} />
  <div className="li-person-row__content">
    <p className="li-person-row__name-row">
      <span className="li-person-row__name">{name}</span>
      <ConnectionBadge degree={2} />
    </p>
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

## Pagination (list footers)

```tsx
import { Pagination, LIST_PAGE_SIZE } from "@/components/linkedin";

const [page, setPage] = useState(1);
const totalPages = Math.max(1, Math.ceil(items.length / LIST_PAGE_SIZE));
const pageItems = items.slice((page - 1) * LIST_PAGE_SIZE, page * LIST_PAGE_SIZE);

<div className="list-panel">
  <div className="list-panel__scroll">{/* pageItems */}</div>
  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
</div>
```

Reset `page` to 1 when filters or search change the list. Copy footer styles from linkedin.com list pages (`.li-pagination` in `globals.css`).

## DevTools workflow

1. Open reference page (e.g. Connections)
2. Inspect element → **Computed** tab
3. Copy `color`, `font-size`, `font-weight`, `padding`, `border`, `border-radius`
4. Add as `--li-*` token or `.li-*` class in `app/globals.css`
5. Re-check localhost against live site
