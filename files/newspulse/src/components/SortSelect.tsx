import { SORT_OPTIONS } from "../constants";
import type { SortOrder } from "../types";

interface SortSelectProps {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
  disabled?: boolean;
  // Sort only makes visual sense for keyword search, not top-headlines
  visible?: boolean;
}

export function SortSelect({ value, onChange, disabled = false, visible = true }: SortSelectProps) {
  if (!visible) return null;

  return (
    <div className="sort-select">
      <label className="sort-select__label" htmlFor="sort-order">
        Sort
      </label>
      <select
        id="sort-order"
        className="sort-select__select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOrder)}
        disabled={disabled}
      >
        {SORT_OPTIONS.map(({ value: v, label }) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
