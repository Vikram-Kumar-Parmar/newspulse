import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PackageCard } from './components/PackageCard';
import { usePackageSearch } from './hooks/usePackageSearch';

export default function App() {
  const [query, setQuery] = useState('react');
  const { data, loading, error } = usePackageSearch(query);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest text-cyan-400">
            Public API Consumer Assessment
          </p>

          <h1 className="text-5xl font-bold">
            DevPulse Explorer
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Search npm packages and instantly inspect adoption signals,
            metadata quality, and download velocity through resilient public API orchestration.
          </p>
        </header>

        <SearchBar value={query} onChange={setQuery} />

        {loading && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
            Fetching package intelligence...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <section className="mt-8 grid gap-4">
            {data.map((item) => (
              <PackageCard key={item.name} item={item} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
