import preset from '@krutoo/presets/eslint';
import type { Config } from 'eslint/config';

const config: Config[] = [
  ...preset,

  // examples
  {
    files: ['examples/**/*.{ts,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
];

export default config;
