import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
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
  if(r){assert.equal(compared.values.chartAverage,r.averageDownloadMBps.toFixed(2)+' MB/s');assert.equal(compared.values.chartTls,r.averageTlsMs.toFixed(1)+' ms');assert.equal(compared.values.chartNetflix,r.greenCounts[1]+' / 60（绿色节点数）');assert.ok(compared.values.chartTime.startsWith(r.time));assert.match(compared.values.chartStatus,/站长本人实测/);}
  else for(const f of comparisonFields.filter(f=>f.group==='charts'))assert.equal(compared.values[f.key],'未提供图表');
 }
 assert.equal(comparisonMode(null),'plans');assert.equal(comparisonMode('charts'),'charts');assert.equal(comparisonMode('all'),'all');assert.equal(comparisonMode('unknown'),'plans');
 assert.deepEqual(selectedBrandSlugs('bad,yinxingren,yinxingren,muguang,breezenet,feiv,lingmao',airports),['yinxingren','muguang','breezenet','feiv']);
});

test('all 12 coupon offers show owner-confirmed permanent validity without inventing checkout or discount amounts',()=>{
 assert.deepEqual(Object.keys(couponNotes).sort(),partnerAirports.filter(a=>a.coupon).map(a=>a.slug).sort());
 for(const [slug,note]of Object.entries(couponNotes)){assert.equal(note.checkoutVerified,false);assert.equal(note.checked,'2026-10-24');assert.equal(note.validityConfirmedBy,'site-owner');assert.equal(note.validityConfirmedAt,'2026-10-24');const $=load(fs.readFileSync('dist/airport/'+slug+'/index.html','utf8'));const panel=$('[data-coupon-research]');
  assert.equal(panel.length,1);assert.equal(panel.attr('data-coupon-research'),note.status);assert.ok(panel.text().includes(note.discount));assert.ok(panel.text().includes(note.conditions));assert.ok(panel.text().includes(note.validity));assert.ok(panel.text().includes('站长确认'));assert.equal(panel.find('a[href^="https://"]').length,0);
 }
 for(const note of Object.values(couponNotes)){assert.equal(note.status,'owner-confirmed');assert.equal(note.validity,'永久有效（站长确认）');}
});

test('28 brands have distinct chart-reading and checkout checkpoints rendered in their own pages',()=>{
 assert.deepEqual(Object.keys(brandCheckpoints).sort(),partnerAirports.map(a=>a.slug).sort());
 assert.equal(new Set(Object.values(brandCheckpoints).map(n=>n.chart)).size,28);assert.equal(new Set(Object.values(brandCheckpoints).map(n=>n.checkout)).size,28);
 for(const brand of partnerAirports){const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));const text=$('.brand-checkpoints').text();assert.ok(text.includes(brandCheckpoints[brand.slug].chart));assert.ok(text.includes(brandCheckpoints[brand.slug].checkout));}
});

test('tutorial screenshots match their captured files, dimensions and descriptive captions',()=>{
 const shots=JSON.parse(fs.readFileSync('docs/guide-screenshots.json','utf8'));
 assert.equal(shots.length,4);
 for(const shot of shots){
  const bytes=fs.readFileSync('dist/guides/'+shot.file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),shot.sha256);
  for(const slug of shot.guides){
   const $=load(fs.readFileSync('dist/guides/'+slug+'/index.html','utf8'));
   const img=$('.guide-interface img').filter((_,el)=>$(el).attr('src')==='/guides/'+shot.file);
   assert.equal(img.length,1);assert.equal(img.attr('width'),String(shot.width));assert.equal(img.attr('height'),String(shot.height));assert.equal(img.attr('loading'),'lazy');
   assert.ok(img.attr('alt')!.includes('本站'));assert.ok(img.closest('figure').find('figcaption').text().includes('本站'));
   assert.equal(img.closest('a').attr('href'),img.attr('src'));
  }
 }
});

test('Markdown tables keep all cells within a focusable horizontal reading region',()=>{
 let tables=0;
 for(const slug of ['prepare-comparison-sheet','read-source-price-conflict','check-coupon-without-payment']){
  const $=load(fs.readFileSync('dist/guides/'+slug+'/index.html','utf8'));
  assert.ok($('.page-intro').text().includes('更新 2026-10-24'));
  assert.equal($('.prose h3').filter((_,el)=>/^第[1-6]步/.test($(el).text())).length,6);
  $('.prose table').each((_,el)=>{tables++;const parent=$(el).parent();assert.ok(parent.hasClass('article-table-scroll'));assert.equal(parent.attr('tabindex'),'0');assert.equal(parent.attr('role'),'region');assert.ok(parent.attr('aria-label')!.includes('横向滚动'));assert.ok($(el).find('th').length>=2);assert.ok($(el).find('td').length>=3);});
 }
 assert.ok(tables>=2);
});
