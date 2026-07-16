import { describe, it, expect } from 'vitest';
import { cn, siteConfig } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('ignores falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('dedupes conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('siteConfig', () => {
  it('exposes the expected identity fields', () => {
    expect(siteConfig.name).toBe('Brian Kramer');
    expect(siteConfig.url).toMatch(/^https:\/\//);
    expect(siteConfig.author.email).toContain('@');
  });
});
