import fs from 'node:fs/promises';
import { $ } from './utils.ts';

// cleanup
await fs.rm('dist', { recursive: true, force: true });

// compile
await $('tsc -p tsconfig.build.json');

// fix import paths
await $('tsc-alias -p tsconfig.build.json');

// format
await $('npx prettier "dist/**/*.{js,ts}" -w --log-level=error --ignore-path=./.nonexistent');
