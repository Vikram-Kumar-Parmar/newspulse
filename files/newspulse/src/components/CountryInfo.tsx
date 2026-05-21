import type { Country } from "../types";

interface CountryInfoProps {
  country: Country | undefined;
}

function formatPop(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function CountryInfo({ country }: CountryInfoProps) {
  if (!country) return null;

  return (
    <aside className="country-info">
      <div className="country-info__flag-wrap">
        <img
          src={country.flag}
          alt={`Flag of ${country.name}`}
          className="country-info__flag"
        />
      </div>
      <div className="country-info__details">
        <h2 className="country-info__name">{country.name}</h2>
        <dl className="country-info__stats">
          {country.capital && (
            <>
              <dt>Capital</dt>
              <dd>{country.capital}</dd>
            </>
          )}
          <dt>Region</dt>
          <dd>{country.subregion || country.region}</dd>
          <dt>Population</dt>
          <dd>{formatPop(country.population)}</dd>
          {country.languages.length > 0 && (
            <>
              <dt>Languages</dt>
              <dd>{country.languages.slice(0, 3).join(", ")}</dd>
            </>
          )}
        </dl>
      </div>
    </aside>
  );
}
