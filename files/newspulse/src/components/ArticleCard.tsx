import { useState } from "react";
import type { Article } from "../types";
import { formatRelativeTime, truncate } from "../utils";

interface ArticleCardProps {
  article: Article;
  layout?: "grid" | "list";
}

export function ArticleCard({ article, layout = "grid" }: ArticleCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = article.imageUrl && !imgFailed;

  if (layout === "list") {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="article-card article-card--list"
      >
        {showImage && (
          <div className="article-card__thumb">
            <img
              src={article.imageUrl!}
              alt=""
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          </div>
        )}
        <div className="article-card__body">
          <div className="article-card__meta">
            <span className="article-card__source">{article.source}</span>
            <span className="article-card__dot" aria-hidden>·</span>
            <time className="article-card__time" dateTime={article.publishedAt.toISOString()}>
              {formatRelativeTime(article.publishedAt)}
            </time>
          </div>
          <h3 className="article-card__title">{article.title}</h3>
          {article.description && (
            <p className="article-card__desc">{truncate(article.description, 160)}</p>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card article-card--grid"
    >
      <div className="article-card__image">
        {showImage ? (
          <img
            src={article.imageUrl!}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="article-card__image-placeholder" aria-hidden>
            <span>{article.source.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="article-card__body">
        <div className="article-card__meta">
          <span className="article-card__source">{article.source}</span>
          <span className="article-card__dot" aria-hidden>·</span>
          <time className="article-card__time" dateTime={article.publishedAt.toISOString()}>
            {formatRelativeTime(article.publishedAt)}
          </time>
        </div>
        <h3 className="article-card__title">{truncate(article.title, 120)}</h3>
      </div>
    </a>
  );
}
