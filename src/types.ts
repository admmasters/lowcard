/**
 * Configuration options for toLowCardinalityPath
 */
export interface LowCardinalityOptions {
  /**
   * List of resource names that should be preserved in the path
   * For example: 'users', 'articles', 'products'
   */
  resourceNames?: string[];

  /**
   * List of segments that should be preserved as-is and not converted to slugs
   * For example: 'contract', 'key-facts'
   */
  preserveSegments?: string[];

  /**
   * Whether to include a query placeholder in the processed path
   * Default: true
   */
  includeQueryPlaceholder?: boolean;

  /**
   * The placeholder to use for query parameters
   * Default: '?:query'
   */
  queryPlaceholder?: string;
}
