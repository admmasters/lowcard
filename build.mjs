// build.mjs
import { build } from "esbuild";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const outDirs = ["./dist/esm", "./dist/cjs"];

// Ensure output directories exist
for (const dir of outDirs) {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

// ESM Build
await build({
	entryPoints: ["./src/index.ts"],
	outfile: "./dist/esm/index.js",
	bundle: true,
	platform: "node",
	format: "esm",
	sourcemap: true,
	minify: false,
	external: [], // Add external dependencies here if any
	target: ["node18"],
});

// Generate TypeScript declaration files for ESM
await runTypeScript("./tsconfig.json");

// CJS Build
await build({
	entryPoints: ["./src/index.ts"],
	outfile: "./dist/cjs/index.js",
	bundle: true,
	platform: "node",
	format: "cjs",
	sourcemap: true,
	minify: false,
	external: [], // Add external dependencies here if any
	target: ["node18"],
});

// Generate TypeScript declaration files for CJS
await runTypeScript("./tsconfig.cjs.json");

console.log("Build complete!");

async function runTypeScript(configPath) {
	const { execa } = await import("execa");

	try {
		await execa("tsc", ["-p", configPath], {
			stdio: "inherit",
		});
	} catch (error) {
		console.error(
			`Error running TypeScript with config ${configPath}:`,
			error.message,
		);
		process.exit(1);
	}
}
