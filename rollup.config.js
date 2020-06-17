import { eslint } from 'rollup-plugin-eslint';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';

import sass from 'rollup-plugin-sass';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import stylelint from 'rollup-plugin-stylelint';
import svgr from '@svgr/rollup';

/* postCSS plugins */
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    peerDepsExternal(),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
    }),
    stylelint({
      throwOnError: true,
      throwOnWarning: true,
    }),
    postcss({
      plugins: [simplevars(), nested()],
      modules: true,
    }),
    sass({ insert: true }),
    url(),
    svgr(),
    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
    // Allows node_modules resolution
    resolve({ jsnext: true, extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),
  ],

  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
