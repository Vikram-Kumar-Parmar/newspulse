import { COUNTRIES_API_BASE, SUPPORTED_COUNTRY_CODES } from "../constants";
import type { Country, RawCountry } from "../types";
import { fetchWithRetry } from "../utils/http";
import { cache } from "../utils/cache";

const COUNTRIES_CACHE_KEY = "countries:all";
const COUNTRIES_CACHE_TTL = 60 * 60 * 1000; // 1 hour — country data is stable

function normalizeCountry(raw: RawCountry): Country | null {
  const code = raw.cca2?.toLowerCase();
  if (!code || !SUPPORTED_COUNTRY_CODES.has(code)) return null;

  return {
    code,
    name: raw.name?.common ?? raw.name?.official ?? code.toUpperCase(),
    flag: raw.flags?.svg ?? raw.flags?.png ?? "",
    region: raw.region ?? "Unknown",
    subregion: raw.subregion ?? "",
    population: raw.population ?? 0,
    languages: Object.values(raw.languages ?? {}),
    capital: raw.capital?.[0] ?? "",
  };
}

/**
 * Fetch all countries that NewsAPI supports.
 * Results are cached for an hour since country data doesn't change.
 */
export async function fetchSupportedCountries(): Promise<Country[]> {
  const cached = cache.get<Country[]>(COUNTRIES_CACHE_KEY);
  if (cached) return cached;

  const url = `${COUNTRIES_API_BASE}/all?fields=name,cca2,flags,region,subregion,population,languages,capital`;
  const raw = await fetchWithRetry<RawCountry[]>(url);

  const countries = raw
    .map(normalizeCountry)
    .filter((c): c is Country => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  cache.set(COUNTRIES_CACHE_KEY, countries, COUNTRIES_CACHE_TTL);
  return countries;
}
