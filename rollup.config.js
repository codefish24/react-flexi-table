import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: true, exports: 'named' },
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true, exports: 'named' }
  ],
  plugins: [
    postcss({ extract: true, modules: false, minimize: true, sourceMap: true }),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**', presets: ['@babel/preset-react'] }),
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    terser()
  ],
  external: ['react', 'react-dom']
};