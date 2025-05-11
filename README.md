# lowcard

Convert high-cardinality paths to low-cardinality patterns for logging and metrics.

## Installation

```sh
npm install lowcard
# or
yarn add lowcard
# or
pnpm add lowcard
```

## Usage

```typescript
import { toLowCardinalityPath } from 'lowcard';

// Basic usage - convert a high-cardinality path to a low-cardinality pattern
const path = '/applications/d6a8998d23cf9c852935e56baca43dd44e3f23d4/contract/key-facts';
const lowCardPath = toLowCardinalityPath(path);
console.log(lowCardPath); // '/applications/:id/contract/key-facts'

// URL paths are also supported
const urlPath = 'https://example.com/quote/12345?token=abc123';
const lowCardUrlPath = toLowCardinalityPath(urlPath);
console.log(lowCardUrlPath); // '/quote/:id?:query'

// Custom configuration
const customPath = '/products/12345/details';
const lowCardCustomPath = toLowCardinalityPath(customPath, {
  resourceNames: ['products', 'categories'],
  preserveSegments: ['details', 'specs'],
  includeQueryPlaceholder: false,
});
console.log(lowCardCustomPath); // '/products/:id/details'
```

## How It Works

lowcard helps you reduce the cardinality of paths by replacing dynamic segments with placeholders:

- Recognizes common resource patterns like `/resource/id/...`
- Replaces UUIDs, numeric IDs, and hash strings with `:id`, `:uuid`, or `:hash`
- Preserves the first segment of a path (typically the route name)
- Replaces slug-like segments with `:slug`
- Handles query parameters with a placeholder
- Allows customization of resource names and segments to preserve

## Configuration Options

You can customize the behavior using options:

```typescript
type LowCardinalityOptions = {
  /**
   * List of resource names that should be preserved in the path
   * Default: ['quote', 'quotes', 'application', 'applications']
   */
  resourceNames?: string[];

  /**
   * List of segments that should be preserved as-is
   * Default: ['contract', 'key-facts']
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
};
```

## Use Cases

- Reduce cardinality in metrics and monitoring systems
- Make log aggregation more efficient
- Improve OpenTelemetry span names
- Create consistent routing patterns for analytics

## License

MIT
