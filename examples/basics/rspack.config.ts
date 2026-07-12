import fs from 'node:fs/promises';
import path from 'node:path';
import * as utils from '@krutoo/utils/rspack';
import type { Configuration } from '@rspack/core';

await fs.rm('dist', { recursive: true, force: true });

const config: Configuration[] = [
  {
    name: 'client',
    entry: {
      index: './src/index.tsx',
    },
    output: {
      path: path.resolve(import.meta.dirname, 'dist/client'),
      filename: '[name].js',
      publicPath: '/',
      module: true,
    },
    plugins: [
      //
      utils.pluginTypeScript(),
      utils.pluginCSS(),
      utils.pluginHTML({
        template: './src/index.html',
      }),
    ],
    devServer: {
      port: 1234,
      hot: false,
      static: false,
      liveReload: true,
      host: '0.0.0.0',
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3200',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      ],
      devMiddleware: {
        writeToDisk: true,
      },
    },
  },
  {
    name: 'server',
    entry: {
      index: './src/server/index.tsx',
    },
    output: {
      path: path.resolve(import.meta.dirname, 'dist/server'),
      filename: '[name].js',
      publicPath: '/server',
      module: true,
    },
    externalsPresets: {
      node: true,
    },
    externals: [
      //
      utils.nodeExternals({
        importType: 'module',
        allow: [/css-loader/],
      }),
    ],
    plugins: [
      //
      utils.pluginTypeScript(),
      utils.pluginCSS({
        extract: false,
      }),
      utils.pluginExec({
        when: 'always',
        script: 'node dist/server/index.js',
        blocking: false,
      }),
    ],
    devServer: false,
  },
];

export default config;
