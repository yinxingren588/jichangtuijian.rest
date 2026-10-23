import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {partnerAirports,planPriceText,planTrafficText,costPerGB} from '../src/data/airports';
const input: {slug:string;name:string;affiliateUrl:string;coupon?:string}[]=JSON.parse(fs.readFileSync('scripts/fixtures/brand-input.json','utf8'));
test('all 28 requested links retain their exact domains, fragment referral and coupon case',()=>{
 assert.equal(partnerAirports.length,28);assert.equal(partnerAirports.flatMap(a=>a.plans).length,56);assert.equal(partnerAirports.filter(a=>a.coupon).length,12);
 for(const b of input){const a=partnerAirports.find(a=>a.slug===b.slug)!;assert.ok(a,b.slug);assert.equal(a.name,b.name);assert.equal(a.affiliateUrl,b.affiliateUrl);assert.equal(a.coupon?.code,b.coupon);assert.equal(a.testStatus,'unverified');assert.equal(a.identityVerified,undefined);for(const p of a.plans){assert.equal(p.verified,false);assert.equal(costPerGB(p),null);}}
});
test('annual-equivalent conflicts and one-time traffic cannot become monthly payable offers',()=>{
 for(const slug of ['feimaoyun','firefly','kuaili']){const p=partnerAirports.find(a=>a.slug===slug)!.plans[0];assert.equal(p.period,'year');assert.equal(p.priceKind,'monthly-equivalent');assert.match(planPriceText(p),/年付折算，总额待确认/);assert.equal(costPerGB({...p,verified:true,multiplier:1}),null);}
 const edge=partnerAirports.find(a=>a.slug==='edgenova')!.plans[0];assert.equal(edge.price,86);assert.match(planPriceText(edge),/86 \/ 年付/);assert.match(planTrafficText(edge),/200 GB\/月/);
 const once=partnerAirports.find(a=>a.slug==='feiv')!.plans[1];assert.equal(once.price,29);assert.equal(once.period,'one-time');assert.match(planTrafficText(once),/一次性总额度/);assert.doesNotMatch(planTrafficText(once),/GB\/月/);
});
test('built brand pages show every plan and coupon with sponsored user-provided links',()=>{
 for(const a of partnerAirports){const $=load(fs.readFileSync('dist/airport/'+a.slug+'/index.html','utf8'));const links=$('a[href]').toArray().filter(e=>$(e).attr('href')===a.affiliateUrl);assert.ok(links.length>=1,a.slug);for(const e of links)assert.ok($(e).attr('rel')?.split(' ').includes('sponsored'),a.slug);const text=$('main').text();assert.match(text,/第三方参考资料/);assert.match(text,/可能获得佣金/);for(const p of a.plans){assert.ok(text.includes(planPriceText(p)),a.slug+' price');assert.ok(text.includes(planTrafficText(p)),a.slug+' traffic');}if(a.coupon)assert.equal($('.coupon-copy').attr('data-coupon'),a.coupon.code);else assert.equal($('.coupon-copy').length,0);}
});
