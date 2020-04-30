import copy from 'rollup-plugin-copy';
import babel from 'rollup-plugin-babel';
import rimraf from 'rimraf';
import { terser } from 'rollup-plugin-terser';
import createHTMLPlugin from './lib/create-html';
import createServiceWorkerPlugin from './lib/create-service-worker';

const distDir = 'public';
rimraf.sync(distDir);

function buildConfig({ watch, isProduction } = {}) {
  const isDev = watch;

  return {
    input: {
      main: 'src/index.js',
    },
    output: {
      dir: distDir,
      format: 'iife',
      sourcemap: watch || 'hidden',
      entryFileNames: '[name]-[hash].js',
      chunkFileNames: '[name]-[hash].js',
    },
    watch: { clearScreen: false },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      !isDev && terser(), // uglify the code if not dev mode
      createHTMLPlugin({ isDev }), // create the index.html
      copy({
        targets: [
          { src: 'src/static/*', dest: distDir, dot: true },
        ],
      }),
      createServiceWorkerPlugin(),
    ].filter(item => item), // filter out unused plugins by filtering out false and null values
  };
}

export default function ({ watch }) {
  return [
    buildConfig({ watch, isProduction: !!process.env.PRODUCTION }),
  ];
}
