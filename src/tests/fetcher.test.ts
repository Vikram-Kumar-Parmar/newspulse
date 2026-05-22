import { describe, expect, it } from 'vitest';
import { safeFetch } from '../utils/fetcher';

describe('safeFetch', () => {
  it('throws on invalid endpoint', async () => {
    await expect(safeFetch('https://invalid.test')).rejects.toBeTruthy();
  });
});
