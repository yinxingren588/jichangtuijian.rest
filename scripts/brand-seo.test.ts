import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,partnerAirports} from '../src/data/airports';
import {brandSeo,brandSeoUpdated,brandSeoTemplates,resolveBrandSeo} from '../src/data/brand-seo';
import {questionsForBrand,brandFaqTemplates} from '../src/data/brand-faq';
import {renderBrandFacts} from '../src/lib/brand-facts';
import {evidenceFor} from '../src/data/evidence';
import {site} from '../src/data/site';

test('every published brand has independently editable, distinct TDK and a separate visible heading',()=>{
 assert.equal(airports.length,28);
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

test('changing catalogue facts updates metadata and authored FAQ without editing their templates',()=>{
 const brand=structuredClone(partnerAirports[0]);
 brand.plans[0].price=31.25;brand.plans[0].trafficGB=211;brand.coupon!.code='CaseSensitiveNEW';
 const seo=resolveBrandSeo(brand),faq=questionsForBrand(brand).map(q=>q.question+' '+q.answer).join(' ');
 for(const text of [seo.description,faq]){
  assert.ok(text.includes('31.25元/月'));assert.ok(text.includes('211 GB/月'));assert.ok(text.includes('CaseSensitiveNEW'));
  assert.ok(!text.includes('24元/月'));assert.ok(!text.includes('144 GB'));assert.ok(!text.includes('yxr888'));
 }
 assert.ok(seo.keywords.includes('CaseSensitiveNEW'));assert.ok(!seo.keywords.includes('yxr888'));
 delete brand.coupon;
 const without=resolveBrandSeo(brand);assert.ok(!without.description.includes('CaseSensitiveNEW'));assert.ok(!without.keywords.includes(''));assert.ok(!without.keywords.includes('{{couponCode}}'));
 brand.plans=[];
 assert.match(resolveBrandSeo(brand).description,/价格、流量额度尚未录入/);
 assert.ok(!resolveBrandSeo(brand).description.includes('31.25'));
 assert.equal(resolveBrandSeo(brand).title,brandSeoTemplates[brand.slug].title);
});

test('fact rendering keeps payment period, quota period, unknowns and unlimited separate',()=>{
 const brand=structuredClone(partnerAirports[0]);
 brand.plans=[{...brand.plans[0],price:9,period:'year',priceKind:'monthly-equivalent',trafficGB:50,trafficPeriod:'month'}];
 assert.match(renderBrandFacts('{{plans}} {{billing}}',brand),/年付折算9元\/月均、50 GB\/月.*完整年费总额待确认/);
 brand.plans[0].priceKind='total';assert.match(renderBrandFacts('{{plans}} {{billing}}',brand),/9元\/年、50 GB\/月 $/);
 brand.plans[0].period='one-time';brand.plans[0].trafficPeriod='one-time';assert.match(renderBrandFacts('{{plans}}',brand),/9元不限时、50 GB一次性总额度/);
 delete brand.plans[0].trafficGB;assert.match(renderBrandFacts('{{plans}}',brand),/流量额度尚未核实/);
 brand.plans[0].unlimited=true;assert.match(renderBrandFacts('{{plans}}',brand),/官方不限流量/);
 assert.throws(()=>renderBrandFacts('{{typo}}',brand),/Unknown brand fact token/);
 const sample=structuredClone(partnerAirports[0]);sample.plans[0].trafficGB=3;
 const template={...brandSeoTemplates[sample.slug],description:'{{quota:0}} {{devices}}',keywords:['{{quota:0}}']};
 const seo=resolveBrandSeo(sample,template);assert.match(seo.description,/3 GB\/月/);assert.ok(seo.keywords.some(k=>k.includes('3 GB')));
 delete sample.plans[0].trafficPeriod;assert.match(resolveBrandSeo(sample,template).description,/3 GB（重置周期尚未核实）/);
 sample.deviceLimit='最多 2 台';assert.ok(resolveBrandSeo(sample,template).description.includes('最多 2 台'));
});

test('all 28 brand pages render four distinct authored questions and resolved answers',()=>{
 assert.deepEqual(Object.keys(brandFaqTemplates).sort(),airports.map(b=>b.slug).sort());
 const questionSet=new Set<string>();
 for(const brand of airports){
  const questions=questionsForBrand(brand),$=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));
  assert.equal(questions.length,4,brand.slug);assert.equal($('.brand-faq').length,4);assert.equal($('.brand-faq[open]').length,1);
  questions.forEach((q,i)=>{questionSet.add(q.question);assert.equal($('.brand-faq summary').eq(i).text(),q.question);assert.equal($('.brand-faq p').eq(i).text(),q.answer);assert.ok(q.answer.length>45,brand.slug);assert.ok(!q.answer.includes('{{'),brand.slug);});
 }
 assert.equal(questionSet.size,112);
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
 const home=load(fs.readFileSync('dist/index.html','utf8'));assert.equal(home('meta[name="keywords"]').attr('content'),'机场推荐');
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
});
