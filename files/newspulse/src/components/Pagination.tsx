import { ChevronLeft, ChevronRight } from "lucide-react";
import { clamp } from "../utils";
import { PAGE_SIZE } from "../constants";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalResults,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  // NewsAPI caps results at 100 even if totalResults says more
  const maxResults = Math.min(totalResults, 100);
  const totalPages = Math.ceil(maxResults / PAGE_SIZE);

  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // Show at most 5 page numbers around the current page
  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "…")[] = [1];

    const start = clamp(currentPage - 2, 2, totalPages - 4);
    const end = clamp(currentPage + 2, 5, totalPages - 1);

    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");

    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Results pages">
      <button
        className="pagination__btn pagination__btn--nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev || disabled}
        aria-label="Previous page"
        type="button"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((p, idx) =>
        p === "…" ? (
          <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pagination__btn ${
              p === currentPage ? "pagination__btn--active" : ""
            }`}
            onClick={() => onPageChange(p)}
            disabled={disabled || p === currentPage}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            type="button"
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination__btn pagination__btn--nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext || disabled}
        aria-label="Next page"
        type="button"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
