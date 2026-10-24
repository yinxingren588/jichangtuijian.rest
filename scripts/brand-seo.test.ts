import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,partnerAirports} from '../src/data/airports';
import {brandSeo,brandSeoUpdated} from '../src/data/brand-seo';
import {evidenceFor} from '../src/data/evidence';
import {site} from '../src/data/site';

test('every published brand has independently editable, distinct TDK and a separate visible heading',()=>{
 assert.equal(airports.length,33);
 assert.deepEqual(Object.keys(brandSeo).sort(),airports.map(b=>b.slug).sort());
 for(const field of ['title','description','heading'] as const)assert.equal(new Set(Object.values(brandSeo).map(s=>s[field])).size,airports.length,field);
 assert.equal(new Set(Object.values(brandSeo).map(s=>s.keywords.join(','))).size,airports.length);
 for(const b of airports){const seo=brandSeo[b.slug];
  assert.ok(seo.heading.endsWith('怎么样？'),b.slug);
  for(const term of ['价格','流量','测速'])assert.ok(seo.title.includes(term),b.slug+' '+term);
  assert.ok(seo.title.length>seo.heading.length);assert.ok(seo.description.length>=90&&seo.description.length<=180,b.slug+' description length');
  assert.ok(seo.keywords.length>=6&&seo.keywords.length<=9,b.slug);assert.equal(new Set(seo.keywords).size,seo.keywords.length);
 }
});

test('built brand head, social metadata, H1 and canonical use that brand own values',()=>{
 const map=load(fs.readFileSync('dist/sitemap-0.xml','utf8'),{xml:true});
 for(const b of airports){const seo=brandSeo[b.slug],$=load(fs.readFileSync('dist/airport/'+b.slug+'/index.html','utf8'));
  assert.equal($('title').text(),seo.title+' · '+site.name,b.slug);
  assert.equal($('meta[name="description"]').attr('content'),seo.description);
  assert.equal($('meta[name="keywords"]').length,1);assert.equal($('meta[name="keywords"]').attr('content'),seo.keywords.join(', '));
  for(const type of ['title','description'] as const){assert.equal($('meta[property="og:'+type+'"]').attr('content'),seo[type]);assert.equal($('meta[name="twitter:'+type+'"]').attr('content'),seo[type]);}
  assert.equal($('h1').length,1);assert.equal($('h1').text(),seo.heading);assert.equal($('link[rel="canonical"]').attr('href'),site.url+'/airport/'+b.slug+'/');
  assert.ok($('.page-intro').text().includes('页面更新：'+brandSeoUpdated));
  const item=map('url').filter((_,el)=>map(el).find('loc').text()===site.url+'/airport/'+b.slug+'/');assert.equal(item.length,1);assert.ok(item.find('lastmod').text().startsWith(brandSeoUpdated));
 }
 const home=load(fs.readFileSync('dist/index.html','utf8'));assert.equal(home('meta[name="keywords"]').length,0);
});

test('descriptions preserve reference plan amounts, exact coupon case and available chart status',()=>{
 for(const b of partnerAirports){const text=brandSeo[b.slug].description;
  for(const p of b.plans){assert.ok(text.includes(String(p.price)),b.slug+' price');assert.ok(text.includes(String(p.trafficGB)+' GB'),b.slug+' traffic');}
  if(b.coupon)assert.ok(text.includes(b.coupon.code),b.slug+' coupon');
  assert.ok(evidenceFor(b.slug));assert.match(text,/未独立复测|不代表独立复测/,b.slug);assert.ok(text.includes('图'));
 }
 for(const slug of ['feimaoyun','firefly','kuaili']){const text=brandSeo[slug].description;assert.ok(text.includes('月均'));assert.ok(text.includes('总额')||text.includes('年费'));assert.ok(text.includes('确认')||text.includes('核对'));}
 assert.match(brandSeo.feiv.description,/200 GB一次性总额度/);assert.match(brandSeo.edgenova.description,/86元\/年、200 GB\/月/);
 for(const b of airports.filter(b=>b.kind==='vpn')){assert.equal(evidenceFor(b.slug),undefined);assert.match(brandSeo[b.slug].description,/暂无.*测速/);}
 assert.match(brandSeo.windscribe.description,/价格、流量额度尚未录入/);assert.match(brandSeo.tunnelbear.description,/重置周期尚未核实/);
});
