import type { LowCardinalityOptions } from "./types";

/**
 * Default resource names that should be preserved in the path
 */
const DEFAULT_RESOURCE_NAMES = [
	"quote",
	"quotes",
	"application",
	"applications",
];

/**
 * Default segments that should be preserved as-is
 */
const DEFAULT_PRESERVE_SEGMENTS = ["contract", "key-facts"];

/**
 * Default placeholder for query parameters
 */
const DEFAULT_QUERY_PLACEHOLDER = "?:query";

/**
 * Converts a high-cardinality path to a low-cardinality pattern by replacing dynamic
 * segments with placeholders.
 *
 * @param path - The path to convert
 * @param options - Configuration options
 * @returns A low-cardinality version of the path
 */
export function toLowCardinalityPath(
	path: string,
	options: LowCardinalityOptions = {},
): string {
	if (!path) return "";

	const {
		resourceNames = DEFAULT_RESOURCE_NAMES,
		preserveSegments = DEFAULT_PRESERVE_SEGMENTS,
		includeQueryPlaceholder = true,
		queryPlaceholder = DEFAULT_QUERY_PLACEHOLDER,
	} = options;

	// Handle both URLs and file paths
	let processedPath = path;

	// Extract and remove query parameters and hash
	const [pathWithoutQuery, queryAndHash] = processedPath.split("?");
	processedPath = pathWithoutQuery || "";

	// Remove protocol and domain for URLs
	if (processedPath.includes("://")) {
		try {
			const url = new URL(path);
			processedPath = url.pathname;
		} catch {
			throw new Error("Invalid URL format");
		}
	}

	// First split the path into segments for processing
	const segments = processedPath.split("/").filter(Boolean);
	const processedSegments = [];

	let i = 0;
	while (i < segments.length) {
		const segment = segments[i];

		// If this segment is a resource name, preserve it and handle the ID in the next segment
		if (resourceNames.includes(segment.toLowerCase())) {
			processedSegments.push(segment);

			// If there is a next segment, it's likely an ID - replace it
			if (i + 1 < segments.length) {
				const nextSegment = segments[i + 1];

				// Check if it's a hash/UUID pattern or numeric ID
				if (
					/^[0-9a-f]{16,64}$/i.test(nextSegment) ||
					/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
						nextSegment,
					) ||
					/^\d+$/.test(nextSegment)
				) {
					processedSegments.push(":id");
					i += 2; // Skip the next segment since we've processed it
					continue;
				}
			}

			i++;
			continue;
		}

		// Preserve specific segments we want to keep as-is
		if (preserveSegments.includes(segment.toLowerCase())) {
			processedSegments.push(segment);
		}
		// Replace UUIDs
		else if (
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				segment,
			)
		) {
			processedSegments.push(":uuid");
		}
		// Replace long hex hashes
		else if (/^[0-9a-f]{16,64}$/i.test(segment)) {
			processedSegments.push(":hash");
		}
		// Replace numeric IDs
		else if (/^\d+$/.test(segment)) {
			processedSegments.push(":id");
		}
		// Apply slug replacement for remaining segments that match the pattern
		else if (/^[a-z0-9](?:[a-z0-9-]+[a-z0-9])?$/i.test(segment)) {
			// Preserve the first segment (route name)
			if (i === 0) {
				processedSegments.push(segment);
			}
			// For non-first segments that match slug pattern, convert to :slug
			else {
				processedSegments.push(":slug");
			}
		}
		// Keep any other segments as-is
		else {
			processedSegments.push(segment);
		}

		i++;
	}

	// Reconstruct the path
	processedPath = `/${processedSegments.join("/")}`;

	// Handle query parameters if we need to preserve them in a low cardinality way
	if (queryAndHash && includeQueryPlaceholder) {
		processedPath += queryPlaceholder;
	}

	return processedPath;
}
