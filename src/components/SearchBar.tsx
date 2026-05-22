interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search npm packages..."
      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
    />
  );
}
