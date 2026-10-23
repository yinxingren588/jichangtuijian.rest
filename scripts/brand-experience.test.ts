import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,partnerAirports,planPriceText,planTrafficText} from '../src/data/airports';
import {evidenceFor} from '../src/data/evidence';
import {couponNotes} from '../src/data/coupon-notes';
import {brandCheckpoints} from '../src/data/brand-checkpoints';
import {comparisonBrand} from '../src/lib/comparison';
import {comparisonFields,comparisonMode,selectedBrandSlugs} from '../src/lib/comparison-fields';

test('brand first-screen summaries use matching plan terms and mobile shortcuts never invent codes',()=>{
 for(const brand of airports){const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));const snapshot=$('[data-brand-snapshot]');
  assert.equal(snapshot.length,1);assert.equal(snapshot.attr('data-brand-snapshot'),brand.slug);assert.equal(snapshot.find('dl>div').length,4);
  if(brand.plans[0]){assert.ok(snapshot.text().includes(planPriceText(brand.plans[0])));assert.ok(snapshot.text().includes(planTrafficText(brand.plans[0])));}else assert.ok(snapshot.text().includes('价格待核实'));
  const r=evidenceFor(brand.slug);if(r)assert.equal(snapshot.find('time').text(),r.time.slice(0,10));else assert.ok(snapshot.text().includes('尚无图表'));
  const mobile=$('.brand-mobile-actions');assert.equal(mobile.length,1);assert.equal(mobile.find('a[href="#plans-heading"]').length,1);assert.equal(mobile.find('a[href="#performance-evidence"]').length,1);
  if(brand.coupon)assert.equal(mobile.find('button[data-coupon]').attr('data-coupon'),brand.coupon.code);else{assert.equal(mobile.find('button[data-coupon]').length,0);assert.equal(mobile.find('a[href="#coupon-heading"]').length,1);}
 }
});

test('comparison exposes exact chart units and keeps absent data unknown across every brand',()=>{
 assert.equal(new Set(comparisonFields.map(f=>f.key)).size,comparisonFields.length);
 for(const brand of airports){const compared=comparisonBrand(brand);const r=evidenceFor(brand.slug);
  assert.deepEqual(Object.keys(compared.values).sort(),comparisonFields.map(f=>f.key).sort());
  if(r){assert.equal(compared.values.chartAverage,r.averageDownloadMBps.toFixed(2)+' MB/s');assert.equal(compared.values.chartTls,r.averageTlsMs.toFixed(1)+' ms');assert.equal(compared.values.chartNetflix,r.greenCounts[1]+' / 60（绿色节点数）');assert.ok(compared.values.chartTime.startsWith(r.time));assert.match(compared.values.chartStatus,/未独立复测/);}
  else for(const f of comparisonFields.filter(f=>f.group==='charts'))assert.equal(compared.values[f.key],'未提供图表');
 }
 assert.equal(comparisonMode(null),'plans');assert.equal(comparisonMode('charts'),'charts');assert.equal(comparisonMode('all'),'all');assert.equal(comparisonMode('unknown'),'plans');
 assert.deepEqual(selectedBrandSlugs('bad,yinxingren,yinxingren,muguang,breezenet,feiv,lingmao',airports),['yinxingren','muguang','breezenet','feiv']);
});

test('all 12 researched coupon records remain references and omit new research URLs from customer panels',()=>{
 assert.deepEqual(Object.keys(couponNotes).sort(),partnerAirports.filter(a=>a.coupon).map(a=>a.slug).sort());
 for(const [slug,note]of Object.entries(couponNotes)){assert.equal(note.checkoutVerified,false);assert.equal(note.checked,'2026-10-23');const $=load(fs.readFileSync('dist/airport/'+slug+'/index.html','utf8'));const panel=$('[data-coupon-research]');
  assert.equal(panel.length,1);assert.equal(panel.attr('data-coupon-research'),note.status);assert.ok(panel.text().includes(note.discount));assert.ok(panel.text().includes(note.conditions));assert.ok(panel.text().includes(note.validity));assert.ok(panel.text().includes('未验证商家结算'));assert.equal(panel.find('a[href^="https://"]').length,0);
 }
 for(const slug of ['breezenet','u1s1','v2yun','yuzhoucloud'])assert.equal(couponNotes[slug].status,'conflicting');
 assert.equal(couponNotes.quanqiuyun.status,'not-confirmed');
});

test('28 brands have distinct chart-reading and checkout checkpoints rendered in their own pages',()=>{
 assert.deepEqual(Object.keys(brandCheckpoints).sort(),partnerAirports.map(a=>a.slug).sort());
 assert.equal(new Set(Object.values(brandCheckpoints).map(n=>n.chart)).size,28);assert.equal(new Set(Object.values(brandCheckpoints).map(n=>n.checkout)).size,28);
 for(const brand of partnerAirports){const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));const text=$('.brand-checkpoints').text();assert.ok(text.includes(brandCheckpoints[brand.slug].chart));assert.ok(text.includes(brandCheckpoints[brand.slug].checkout));}
});

test('core comparison and coupon tutorials render their actual website screenshots with intrinsic sizes and captions',()=>{
 for(const [slug,file]of [['prepare-comparison-sheet','comparison-tool.jpg'],['check-coupon-without-payment','coupon-overview.jpg']]){
  const $=load(fs.readFileSync('dist/guides/'+slug+'/index.html','utf8'));const figure=$('.guide-interface');const img=figure.find('img');
  assert.equal(figure.length,1);assert.equal(img.attr('src'),'/guides/'+file);assert.equal(img.attr('loading'),'lazy');assert.equal(img.attr('width'),'1425');assert.ok(Number(img.attr('height'))>900);
  assert.ok(figure.find('figcaption').text().includes('本站'));assert.ok(fs.existsSync('dist/guides/'+file));
 }
});
