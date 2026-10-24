import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import { satteri } from '@astrojs/markdown-satteri';
import tableRegions from './src/lib/satteri-table-region.mjs';
const pageDates=JSON.parse(fs.readFileSync(new URL('./src/data/page-dates.json',import.meta.url),'utf8'));
for(const file of fs.readdirSync(new URL('./src/content/articles/',import.meta.url)).filter(f=>f.endsWith('.md'))){
 const text=fs.readFileSync(new URL('./src/content/articles/'+file,import.meta.url),'utf8');
 const section=JSON.parse(text.match(/^section: (.+)$/m)[1]);
 const updated=JSON.parse(text.match(/^updated: (.+)$/m)[1]);
 pageDates['/'+section+'/'+file.replace(/\.md$/,'')+'/']=updated;
}
export default defineConfig({
  site: 'https://jichangtuijian.rest', output: 'static', trailingSlash: 'always',
  markdown: {processor:satteri({hastPlugins:[tableRegions]})},
  integrations: [sitemap({ filter: url => !/\/(404|search)\/$/.test(url) && !/\/ranking\/(overall|value|budget|stable)\/$/.test(url), serialize: item => {const lastmod=pageDates[new URL(item.url).pathname];if(!lastmod)throw Error('Missing actual modification date for '+item.url);return {...item,lastmod};} })],
  vite: { plugins: [tailwindcss()] }
});
