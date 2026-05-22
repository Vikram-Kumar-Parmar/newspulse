import { motion } from 'framer-motion';
import { PackageResult } from '../types/package';

export function PackageCard({ item }: { item: PackageResult }) {
  return (
    <motion.div
      layout
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <span className="text-sm text-slate-400">v{item.version}</span>
      </div>

      <p className="mt-3 text-sm text-slate-300">
        {item.description || 'No package description available.'}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{item.weeklyDownloads.toLocaleString()} weekly downloads</span>

        {item.homepage && (
          <a
            href={item.homepage}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400"
          >
            Homepage
          </a>
        )}
      </div>
    </motion.div>
  );
}
