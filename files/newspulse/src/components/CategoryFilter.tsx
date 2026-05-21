import { CATEGORIES } from "../constants";
import type { NewsCategory } from "../types";

interface CategoryFilterProps {
  selected: NewsCategory;
  onChange: (category: NewsCategory) => void;
  disabled?: boolean;
}

export function CategoryFilter({ selected, onChange, disabled = false }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="tablist" aria-label="News categories">
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={selected === value}
          className={`category-filter__tab ${
            selected === value ? "category-filter__tab--active" : ""
          }`}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
