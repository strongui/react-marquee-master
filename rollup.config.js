import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' with { type: 'json' };
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';

/* postCSS plugins */
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const defaultConfig = {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    peerDepsExternal(),
    postcss({
      plugins: [simplevars(), nested()],
      modules: true,
    }),
    svgr(),
    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
    // Allows node_modules resolution
    resolve({ preferBuiltins: false, extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),
  ],

  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      exports: 'named',
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};

export default defaultConfig;
