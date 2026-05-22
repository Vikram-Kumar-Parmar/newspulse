import { safeFetch } from '../utils/fetcher';
import { PackageResult } from '../types/package';

export async function searchPackage(query: string): Promise<PackageResult[]> {
  const normalized = query.trim();

  if (!normalized) {
    throw new Error('Search query cannot be empty.');
  }

  const search = await safeFetch(
    `https://registry.npmjs.org/-/v1/search?text=${normalized}&size=5`
  );

  const packages = await Promise.all(
    search.objects.map(async (item: any) => {
      const name = item.package.name;

      try {
        const downloads = await safeFetch(
          `https://api.npmjs.org/downloads/point/last-week/${name}`
        );

        return {
          name,
          description: item.package.description,
          version: item.package.version,
          homepage: item.package.links?.homepage,
          weeklyDownloads: downloads.downloads || 0
        };
      } catch {
        return {
          name,
          description: item.package.description,
          version: item.package.version,
          homepage: item.package.links?.homepage,
          weeklyDownloads: 0
        };
      }
    })
  );

  return packages;
}
