// build.mjs
import { build } from 'esbuild';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const outDirs = ['./dist/esm', './dist/cjs'];

// Ensure output directories exist
for (const dir of outDirs) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ESM Build
await build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/esm/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  minify: false,
  external: [], // Add external dependencies here if any
  target: ['node18'],
});

// CJS Build
await build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/cjs/index.js',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  minify: false,
  external: [], // Add external dependencies here if any
  target: ['node18'],
});

// Generate TypeScript declaration files
console.log('Generating TypeScript declaration files...');
await generateDeclarationFiles();

console.log('Build complete!');

async function generateDeclarationFiles() {
  const { execa } = await import('execa');

  try {
    // ESM declarations
    console.log('Generating ESM declarations...');
    await execa('tsc', ['--emitDeclarationOnly', '--declaration', '--project', './tsconfig.json'], {
      stdio: 'inherit',
    });

    // CJS declarations
    console.log('Generating CJS declarations...');
    await execa(
      'tsc',
      ['--emitDeclarationOnly', '--declaration', '--project', './tsconfig.cjs.json'],
      {
        stdio: 'inherit',
      },
    );
  } catch (error) {
    console.error('Error generating declaration files:', error.message);
    process.exit(1);
  }
}
