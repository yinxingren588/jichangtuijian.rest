import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {coreKeywordTargets,coreReadingRoutes} from '../src/data/core-keywords';
import {airports,priceText,trafficText} from '../src/data/airports';
import {readLibrary} from './library';

test('the original eight search themes have explicit owners and pass the rendered coverage audit',()=>{
 assert.deepEqual(coreKeywordTargets.map(k=>k.keyword.toLowerCase()),['机场推荐','机场节点','性价比机场','梯子推荐','vpn','vpn机场','vpn节点','vpn推荐']);
 assert.equal(new Set(coreKeywordTargets.map(k=>k.url)).size,7);
 const audit=JSON.parse(fs.readFileSync('docs/core-keyword-coverage.json','utf8'));
 assert.equal(audit.passed,true);assert.equal(audit.rows.length,8);
 for(const row of audit.rows){assert.ok(Object.values(row.checks).every(Boolean),row.keyword);assert.ok(row.incomingPages.length>=2,row.keyword);}
});

test('home and blog reading paths expose six useful guides and keep the existing article library',()=>{
 for(const file of ['dist/index.html','dist/blog/index.html']){const $=load(fs.readFileSync(file,'utf8'));assert.equal($('[data-core-reading] .core-reading-grid>a').length,6);for(const route of coreReadingRoutes)assert.equal($('[data-core-reading] a[href="'+route.url+'"]').length,1);}
 const all=readLibrary();assert.equal(all.filter(a=>a.meta.section==='blog').length,200);assert.equal(all.filter(a=>a.meta.section==='guides').length,30);
 for(const slug of ['node-name-labels','nearby-node','vpn']){const entry=all.find(a=>a.slug===slug)!;assert.ok(entry.body.length>=1200,slug);assert.equal(entry.meta.updated,'2026-10-24');}
 const home=load(fs.readFileSync('dist/index.html','utf8'));assert.ok(home('h1').text().startsWith('机场推荐'));assert.equal(home('.plan-card').first().attr('href'),'/airport/yinxingren/');
 const beginner=load(fs.readFileSync('dist/recommend/beginner/index.html','utf8'));assert.equal(beginner('[data-beginner-guide] ol>li').length,3);assert.ok(beginner('[data-beginner-guide]').text().includes('隐形人固定首位'));
});

test('the VPN guide uses all five existing VPN records and does not substitute airport charts',()=>{
 const $=load(fs.readFileSync('dist/vpn/index.html','utf8'));const brands=airports.filter(b=>b.kind==='vpn');assert.equal($('[data-vpn-brand]').length,brands.length);
 for(const b of brands){const card=$('[data-vpn-brand="'+b.slug+'"]');assert.equal(card.length,1);const text=card.text();assert.ok(text.includes(priceText(b)));assert.ok(text.includes(trafficText(b)));assert.ok(text.includes('本站暂无该品牌图表'));assert.equal(card.find('a[href="/airport/'+b.slug+'/"]').length,2);assert.equal(card.find('a[href="/compare/?brands='+b.slug+'"]').length,1);}
 assert.equal($('[data-evidence-state="provided"]').length,0);assert.equal($('h1').length,1);assert.ok($('h1').text().includes('VPN推荐'));assert.ok($('a[href="/glossary/vpn/"]').length);assert.ok($('a[href="/blog/nearby-node/"]').length);
});
