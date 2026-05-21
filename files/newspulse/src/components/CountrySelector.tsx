import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Country } from "../types";

interface CountrySelectorProps {
  countries: Country[];
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function CountrySelector({
  countries,
  selected,
  onChange,
  disabled = false,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.code === selected);

  const filtered = search
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countries;

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  // Close on outside click
  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div
      className="country-selector"
      ref={ref}
      onBlur={handleBlur}
    >
      <button
        className="country-selector__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        type="button"
      >
        {selectedCountry ? (
          <>
            <img
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              className="country-selector__flag"
              width={20}
              height={14}
            />
            <span>{selectedCountry.name}</span>
          </>
        ) : (
          <span className="country-selector__placeholder">Select country</span>
        )}
        <ChevronDown
          size={14}
          className={`country-selector__chevron ${open ? "country-selector__chevron--open" : ""}`}
        />
      </button>

      {open && (
        <div className="country-selector__dropdown" role="listbox">
          <div className="country-selector__search-wrap">
            <input
              className="country-selector__search"
              type="text"
              placeholder="Filter countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              aria-label="Filter countries"
            />
          </div>
          <ul className="country-selector__list">
            {filtered.length === 0 && (
              <li className="country-selector__empty">No countries found</li>
            )}
            {filtered.map((country) => (
              <li
                key={country.code}
                className={`country-selector__option ${
                  country.code === selected ? "country-selector__option--selected" : ""
                }`}
                role="option"
                aria-selected={country.code === selected}
                onClick={() => handleSelect(country.code)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(country.code)}
                tabIndex={0}
              >
                <img
                  src={country.flag}
                  alt=""
                  className="country-selector__flag"
                  width={18}
                  height={13}
                />
                <span>{country.name}</span>
                {country.region && (
                  <span className="country-selector__region">{country.region}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
