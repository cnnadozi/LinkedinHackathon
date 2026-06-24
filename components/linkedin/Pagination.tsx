"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  "aria-label"?: string;
};

/** Default page size for LinkedIn-style list footers (events feed, attendee modal). */
export const LIST_PAGE_SIZE = 10;

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "…", total];
  }
  if (current >= total - 3) {
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "…", current - 1, current, current + 1, "…", total];
}

/** Pagination bar — matches linkedin.com list footers (page pills + Next). */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function goTo(p: number) {
    onPageChange(Math.max(1, Math.min(p, totalPages)));
  }

  const pages = pageRange(page, totalPages);

  return (
    <nav className={`li-pagination ${className}`.trim()} aria-label={ariaLabel}>
      <button
        type="button"
        className="li-pagination__btn li-pagination__prev"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="li-pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`li-pagination__btn li-pagination__page${page === p ? " li-pagination__page--active" : ""}`}
            onClick={() => goTo(p as number)}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className="li-pagination__btn li-pagination__next"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
