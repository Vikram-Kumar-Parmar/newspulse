import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../hooks";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search news…" }: SearchBarProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 400);
  const prevDebounced = useRef(debouncedValue);

  useEffect(() => {
    if (debouncedValue !== prevDebounced.current) {
      prevDebounced.current = debouncedValue;
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="search-bar">
      <Search className="search-bar__icon" size={18} aria-hidden />
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search news"
        // Prevent form submission on Enter — we debounce, not submit
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
