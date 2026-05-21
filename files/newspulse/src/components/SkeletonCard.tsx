export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden>
      <div className="skeleton-card__image skeleton-pulse" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__meta">
          <div className="skeleton-pulse skeleton-card__source-bar" />
          <div className="skeleton-pulse skeleton-card__time-bar" />
        </div>
        <div className="skeleton-pulse skeleton-card__title-bar skeleton-card__title-bar--1" />
        <div className="skeleton-pulse skeleton-card__title-bar skeleton-card__title-bar--2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="article-grid" aria-label="Loading articles…" aria-busy>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
