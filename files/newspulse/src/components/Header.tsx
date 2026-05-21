import { Rss } from "lucide-react";

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <Rss className="app-header__logo" size={22} strokeWidth={2} />
          <span className="app-header__name">NewsPulse</span>
        </div>
        <p className="app-header__tagline">
          World headlines, one dashboard
        </p>
      </div>
    </header>
  );
}
