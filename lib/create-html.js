// Custom rollup plugin for creating html pages
import { readFileSync } from 'fs';
import mustache from 'mustache';
import { findHashFromName } from './bundle-utils';
import { version, name } from '../package.json';

function generateShell(bundle, { templatePath, isDev }) {
  const template = readFileSync(templatePath, 'utf8');
  return mustache.render(template, {
    isProduction: !isDev,
    isDev,
    scriptFile: findHashFromName(bundle, 'main'),
    title: name,
    version,
  });
}

export default function createHTMLPlugin({ isDev }) {
  const templatePath = 'src/index.mustache';
  return {
    name: 'create-html-plugin',
    buildStart() {
      this.addWatchFile(templatePath);
    },
    async generateBundle(options, bundle) {
      this.emitFile({
        fileName: 'index.html',
        type: 'asset',
        source: await generateShell(bundle, { templatePath, isDev, name, version }),
      });
      // 404.html is a 'magic' file for http-server so local dev
      // SPA works
      if(isDev) {
        this.emitFile({
          fileName: '404.html',
          type: 'asset',
          source: await generateShell(bundle, { templatePath, isDev, title, version }),
        });
      }
    },
  };
}
