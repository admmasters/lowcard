// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov", "html"],
			exclude: ["**/__tests__/**", "**/*.test.ts"],
		},
	},
});
