import { describe, it, expect } from 'vitest';
import { toLowCardinalityPath } from '../toLowCardinalityPath';

describe('toLowCardinalityPath', () => {
  it('should handle empty paths', () => {
    expect(toLowCardinalityPath('')).toBe('');
    expect(toLowCardinalityPath(null as unknown as string)).toBe('');
    expect(toLowCardinalityPath(undefined as unknown as string)).toBe('');
  });

  it('should convert resource paths with IDs correctly', () => {
    // UUID ID test
    expect(toLowCardinalityPath('/application/d6a8998d-23cf-9c85-2935-e56baca43dd4')).toBe('/application/:id');

    // Hash ID test
    expect(toLowCardinalityPath('/quote/d6a8998d23cf9c852935e56baca43dd44e3f23d4')).toBe('/quote/:id');

    // Numeric ID test
    expect(toLowCardinalityPath('/applications/12345')).toBe('/applications/:id');
  });

  it('should preserve nested known paths', () => {
    expect(toLowCardinalityPath('/applications/d6a8998d23cf9c852935e56baca43dd44e3f23d4/contract/key-facts')).toBe(
      '/applications/:id/contract/key-facts',
    );
  });

  it('should handle random paths with hashes and slugs', () => {
    expect(toLowCardinalityPath('/random/d6a8998d23cf9c852935e56baca43dd44e3f23d4')).toBe('/random/:hash');

    expect(toLowCardinalityPath('/random/abcd-efgh')).toBe('/random/:slug');
  });

  it('should handle URL paths with protocols', () => {
    expect(toLowCardinalityPath('https://example.com/applications/12345/contract')).toBe('/applications/:id/contract');
  });

  it('should handle query parameters', () => {
    expect(toLowCardinalityPath('/search?query=test&page=1')).toBe('/search?:query');

    // With option to disable query placeholder
    expect(toLowCardinalityPath('/search?query=test&page=1', { includeQueryPlaceholder: false })).toBe('/search');
  });

  it('should allow custom resource names', () => {
    expect(
      toLowCardinalityPath('/products/12345', {
        resourceNames: ['products', 'categories'],
      }),
    ).toBe('/products/:id');
  });

  it('should allow custom preserved segments', () => {
    expect(
      toLowCardinalityPath('/products/12345/details/specs', {
        resourceNames: ['products'],
        preserveSegments: ['details', 'specs'],
      }),
    ).toBe('/products/:id/details/specs');
  });

  it('should allow custom query placeholder', () => {
    expect(
      toLowCardinalityPath('/search?query=test&page=1', {
        queryPlaceholder: '?:params',
      }),
    ).toBe('/search?:params');
  });
});
