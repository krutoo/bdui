import preset from '@krutoo/presets/eslint';
import type { Config } from 'eslint/config';

const config: Config[] = [
  ...preset,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default config;
