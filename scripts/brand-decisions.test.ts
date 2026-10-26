import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,planPriceText,planTrafficText} from '../src/data/airports';
import {brandBuyingGuides,buyingGuideFor} from '../src/data/brand-buying-guides';
import {brandFactHistory,historyForBrand} from '../src/data/brand-fact-history';
import {appendFactRecord,assertHistoryCurrent,changedFactGroups,factSnapshot,latestFactEvent} from '../src/lib/brand-history';
import {compactPlan} from '../src/lib/brand-facts';
import {evidenceFor} from '../src/data/evidence';

test('every brand has a distinct decision, an evidence-backed reading route and exactly one visible anchor',()=>{
 assert.deepEqual(Object.keys(brandBuyingGuides).sort(),airports.map(b=>b.slug).sort());
 for(const field of ['headline','summary','forWhom','notFor','choice','advantage','tradeoff','evidenceFocus'] as const){
  assert.equal(new Set(Object.values(brandBuyingGuides).map(g=>g[field])).size,28,field);
 }
 for(const brand of airports){
  const $=load(fs.readFileSync(`dist/airport/${brand.slug}/index.html`,'utf8'));
  const guide=buyingGuideFor(brand),panel=$('[data-brand-buying-guide]');
  assert.equal(panel.length,1);assert.equal(panel.attr('data-brand-buying-guide'),brand.slug);
  for(const text of Object.values(guide))assert.ok(panel.text().includes(text),brand.slug);
  assert.equal($('#selection-heading').length,1);assert.equal($('#brand-fact-history').length,1);
  assert.equal($('.brand-section-nav a[href="#selection-heading"]').length,1);
  assert.equal($('.brand-section-nav a[href="#brand-fact-history"]').length,1);
  assert.ok(panel.find('a[href="#performance-evidence"]').length);
  const record=evidenceFor(brand.slug)!;
  assert.ok(panel.text().includes(record.time));assert.ok(panel.text().includes(record.averageDownloadMBps.toFixed(2)+' MB/s'));
  assert.ok(panel.text().includes('不代表购买档位保证速度'));
  assert.doesNotMatch(panel.text(),/\{\{/);
 }
});

test('buying choices follow edited plan fields without changing payment or quota models',()=>{
 for(const slug of ['yinxingren','feimaoyun','feiv','edgenova','kuaili']){
  const edited=structuredClone(airports.find(b=>b.slug===slug)!);
  edited.plans[0].price=123.45;edited.plans[0].currency='USD';edited.plans[0].trafficGB=987;
  const guide=buyingGuideFor(edited);
  assert.ok(guide.choice.includes(compactPlan(edited.plans[0])));
  assert.ok(guide.choice.includes(compactPlan(edited.plans[1])));
 }
});

test('28 baselines and 12 dated owner coupon confirmations keep independent snapshots with clear date scope',()=>{
 assert.deepEqual(Object.keys(brandFactHistory).sort(),airports.map(b=>b.slug).sort());
 let confirmations=0;
 for(const brand of airports){
  const events=historyForBrand(brand),baseline=events.find(e=>e.kind==='baseline')!;
  assert.equal(baseline.date,'2026-10-26');assert.deepEqual(baseline.snapshot,factSnapshot(brand));
  assert.equal(baseline.snapshot!.referenceChecked,'2026-10-24');
  assert.match(baseline.note,/未重新核验商家结算/);
  assert.equal(events.filter(e=>e.kind==='catalogue-change').length,0);
  const confirmationsForBrand=events.filter(e=>e.kind==='coupon-confirmation');
  assert.equal(confirmationsForBrand.length,brand.coupon?1:0);
  for(const event of confirmationsForBrand){confirmations++;assert.equal(event.date,brand.coupon!.validityConfirmedAt);assert.ok(event.note.includes(brand.coupon!.code));assert.equal(event.snapshot,undefined);}
  const $=load(fs.readFileSync(`dist/airport/${brand.slug}/index.html`,'utf8'));
  const panel=$('[data-brand-fact-history]');assert.equal(panel.length,1);
  assert.ok(panel.text().includes('建档不代表商家刚刚调价'));assert.equal(panel.find('[data-history-kind=baseline]').length,1);
  const snap=panel.find('.brand-history-snapshot');
  for(const p of brand.plans){assert.ok(snap.text().includes(planPriceText(p)));assert.ok(snap.text().includes(planTrafficText(p)));}
  if(brand.coupon)assert.ok(snap.text().includes(brand.coupon.code));else assert.ok(snap.text().includes('未录入优惠码'));
 }
 assert.equal(confirmations,12);
});

test('price, currency, billing model, traffic reset and coupon changes preserve before and after records',()=>{
 const brand=structuredClone(airports[0]),historyBefore=JSON.stringify(brandFactHistory);
 const prior=latestFactEvent(brandFactHistory[brand.slug])!.snapshot!;
 brand.plans[0]={...brand.plans[0],price:90,currency:'USD',period:'year',priceKind:'monthly-equivalent',trafficGB:12,trafficPeriod:'one-time'};
 brand.coupon={...brand.coupon!,code:'ChangedCase',conditions:'仅测试用新条件'};
 const next=appendFactRecord(brandFactHistory,brand,'2026-10-27','测试用资料更正，不修改真实品牌资料');
 assert.equal(JSON.stringify(brandFactHistory),historyBefore);
 assert.equal(next[brand.slug].length,brandFactHistory[brand.slug].length+1);
 assert.deepEqual(next[brand.slug][1].snapshot,prior);
 assert.deepEqual(next[brand.slug][0].snapshot,factSnapshot(brand));
 assert.deepEqual(next[brand.slug][0].changedGroups,['套餐资料','优惠资料']);
 assert.deepEqual(next.muguang,brandFactHistory.muguang);
 assert.doesNotThrow(()=>assertHistoryCurrent(brand,next[brand.slug]));
 assert.throws(()=>assertHistoryCurrent(brand,brandFactHistory[brand.slug]),/brand:record/);
 delete brand.coupon;
 const removed=appendFactRecord(next,brand,'2026-10-27','测试用移除优惠码');
 assert.equal(removed[brand.slug][0].snapshot!.coupon,null);
 assert.equal(removed[brand.slug][1].snapshot!.coupon!.code,'ChangedCase');
});

test('records reject fake updates and invalid dates, and source review dates remain a separate tracked field',()=>{
 const brand=structuredClone(airports[0]);
 assert.throws(()=>appendFactRecord(brandFactHistory,brand,'2026-10-27','没有修改'),/资料未变化/);
 brand.referenceChecked='2026-10-27';
 assert.deepEqual(changedFactGroups(factSnapshot(airports[0]),factSnapshot(brand)),['来源读取日期']);
 for(const date of ['2026-02-30','2026-13-01','2026-10-25','not-a-date'])assert.throws(()=>appendFactRecord(brandFactHistory,brand,date,'测试'));
 assert.throws(()=>appendFactRecord(brandFactHistory,brand,'2026-10-27','   '),/不能为空/);
 const next=appendFactRecord(brandFactHistory,brand,'2026-10-27','测试用重新读取来源');
 assert.equal(next[brand.slug][0].date,'2026-10-27');
 assert.equal(next[brand.slug][1].snapshot!.referenceChecked,'2026-10-24');
 assert.equal(next[brand.slug][0].snapshot!.referenceChecked,'2026-10-27');
});
