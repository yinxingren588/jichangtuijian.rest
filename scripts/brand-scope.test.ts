import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports} from '../src/data/airports';
import {files} from './common';
import {parseBrandMemory} from '../src/lib/brand-memory';
import {selectedBrandSlugs} from '../src/lib/comparison-fields';
const removed=['proton-vpn','mullvad','windscribe','tunnelbear','hide-me'];
const outsideBrand=/proton(?:[ -]?vpn)?|mullvad|windscribe|tunnelbear|hide[.-]me/i;

test('only the owner-provided 28 brands remain in live pages, search, structured data and sitemap',()=>{
 const supplied=JSON.parse(fs.readFileSync('src/data/brand-catalogue.json','utf8'));
 assert.equal(airports.length,28);assert.deepEqual(airports.map(b=>b.slug),supplied.map((b:{slug:string})=>b.slug));
 assert.equal(airports[0].slug,'yinxingren');
 for(const file of files('dist').filter(f=>/\.(html|js|json|xml)$/.test(f)))assert.doesNotMatch(fs.readFileSync(file,'utf8'),outsideBrand,file);
 for(const slug of removed)assert.ok(!fs.existsSync('dist/airport/'+slug+'/index.html'),slug);
 const $=load(fs.readFileSync('dist/airport/index.html','utf8'));
 assert.ok(!$('main').text().includes('商业 VPN · 独立类别'));
 const schema=JSON.parse($('script[type="application/ld+json"]').text());
 const list=schema['@graph'].find((x:{'@type':string})=>x['@type']==='ItemList');assert.equal(list.itemListElement.length,28);
});

test('saved candidates and comparison URLs discard removed brands while retaining valid owner brands',()=>{
 const old=[...removed,'yinxingren','muguang'];
 const memory=parseBrandMemory(JSON.stringify({version:1,candidates:old,recent:old,comparison:{brands:old,view:'plans'}}),airports);
 assert.deepEqual(memory.candidates,['yinxingren','muguang']);assert.deepEqual(memory.recent,['yinxingren','muguang']);assert.deepEqual(memory.comparison?.brands,['yinxingren','muguang']);
 assert.deepEqual(selectedBrandSlugs(old.join(','),airports),['yinxingren','muguang']);
});
