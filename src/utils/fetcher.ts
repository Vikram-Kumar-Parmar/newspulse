const cache = new Map();

export async function safeFetch(url: string, timeout = 6000) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    cache.set(url, data);
    return data;
  } finally {
    clearTimeout(timer);
  }
}
