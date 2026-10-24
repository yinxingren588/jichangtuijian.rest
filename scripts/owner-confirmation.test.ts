import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import confirmation from '../src/data/owner-confirmation.json';
import {airports} from '../src/data/airports';
import {evidenceRecords} from '../src/data/evidence';
import {couponNotes} from '../src/data/coupon-notes';

test('owner-confirmed authorship and permanent offer validity agree across data, brand pages and metadata',()=>{
 assert.equal(confirmation.confirmedBy,'site-owner');assert.equal(confirmation.chartEvidence.authenticityConfirmed,true);
 assert.equal(confirmation.couponOffer.validity,'permanent');assert.equal(confirmation.couponOffer.discountAmountsConfirmed,false);
 assert.deepEqual(airports.filter(a=>a.coupon).map(a=>a.coupon!.code).sort(),[...confirmation.couponOffer.codes].sort());
 for(const b of airports){
  const $=load(fs.readFileSync('dist/airport/'+b.slug+'/index.html','utf8'));
  assert.equal($('[data-test-author="site-owner"]').length,1,b.slug);assert.ok($('[data-test-author]').text().includes('真实测试数据'));
  assert.doesNotMatch($('main').text(),/未独立复测|尚未独立复测|当前没有独立实测|无已发布独立实测/);
  assert.match($('meta[name="description"]').attr('content')!,/站长.*实测/,b.slug);
  if(b.coupon){assert.equal(b.coupon.validity,'permanent');assert.equal(b.coupon.validityConfirmedBy,'site-owner');assert.equal(b.coupon.validityConfirmedAt,confirmation.confirmedAt);assert.equal(couponNotes[b.slug].checkoutVerified,false);assert.ok($('[data-coupon-research]').text().includes('永久有效'));assert.ok($('meta[name="description"]').attr('content')!.includes('永久有效'));}
 }
 for(const record of evidenceRecords){assert.equal(record.testedBy,'site-owner');assert.equal(record.ownerConfirmedAt,confirmation.confirmedAt);assert.equal(record.authenticityConfirmed,true);}
 for(const route of ['review','evidence','editorial-policy','disclaimer','about']){const $=load(fs.readFileSync('dist/'+route+'/index.html','utf8'));assert.doesNotMatch($('main').text(),/未独立复测|尚未独立复测|当前没有独立实测|无已发布独立实测/);assert.ok($('main').text().includes('站长'),route);}
});
