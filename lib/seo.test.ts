import { describe, it, expect } from 'vitest';
import { absoluteUrl, pathFromCanonicalUrl } from './seo';
import { SITE_ORIGIN } from '@/content/publishing/records';

describe('absoluteUrl', () => {
  it('prefixes site origin for relative paths', () => {
    expect(absoluteUrl('/about')).toBe(`${SITE_ORIGIN}/about`);
  });

  it('adds a leading slash when missing', () => {
    expect(absoluteUrl('about')).toBe(`${SITE_ORIGIN}/about`);
  });

  it('passes through absolute URLs unchanged', () => {
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x');
  });
});

describe('pathFromCanonicalUrl', () => {
  it('strips the site origin', () => {
    expect(pathFromCanonicalUrl(`${SITE_ORIGIN}/writing/foo`)).toBe('/writing/foo');
  });

  it('returns / for the bare origin', () => {
    expect(pathFromCanonicalUrl(SITE_ORIGIN)).toBe('/');
  });
});
