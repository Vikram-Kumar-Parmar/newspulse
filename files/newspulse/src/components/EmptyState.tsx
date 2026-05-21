import { Newspaper } from "lucide-react";

interface EmptyStateProps {
  query?: string;
  onClear?: () => void;
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Newspaper className="empty-state__icon" size={36} strokeWidth={1.2} />
      <h3 className="empty-state__title">
        {query ? `No results for "${query}"` : "No articles found"}
      </h3>
      <p className="empty-state__message">
        {query
          ? "Try a different search term or change the country."
          : "There are no headlines for this combination right now."}
      </p>
      {onClear && query && (
        <button className="btn btn--secondary" onClick={onClear} type="button">
          Clear search
        </button>
      )}
    </div>
  );
}
