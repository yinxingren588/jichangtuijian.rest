import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,partnerAirports,planPriceText,planTrafficText} from '../src/data/airports';
import {emptyDirectoryFilters,filterNumber,filtersFromParams,matchingDirectoryPlan,type DirectoryBrand} from '../src/lib/directory-filters';
import {emptyBrandMemory,parseBrandMemory,recordBrandVisit,toggleCandidate,comparisonSearch} from '../src/lib/brand-memory';
import {comparisonMode,selectedBrandSlugs} from '../src/lib/comparison-fields';
const brands=partnerAirports.map(a=>({slug:a.slug,name:a.name,searchText:(a.name+' '+(a.coupon?.code||'')).toLowerCase(),hasCoupon:Boolean(a.coupon),plans:a.plans.map(p=>({...p,priceText:planPriceText(p),trafficText:planTrafficText(p)}))})) satisfies DirectoryBrand[];
const find=(slug:string)=>brands.find(b=>b.slug===slug)!;

test('price and quota filters must be satisfied by the same plan, with exact boundary matches',()=>{
 const base={...emptyDirectoryFilters,period:'month' as const,minTraffic:300,maxPrice:30};
 assert.equal(matchingDirectoryPlan(find('yinxingren'),base),undefined);
 const matched=matchingDirectoryPlan(find('yinxingren'),{...base,maxPrice:48,minTraffic:350})!;
 assert.equal(matched.price,48);assert.equal(matched.trafficGB,350);
 assert.equal(matchingDirectoryPlan(find('yinxingren'),{...base,maxPrice:48,minTraffic:351}),undefined);
 assert.equal(matchingDirectoryPlan(find('yinxingren'),{...emptyDirectoryFilters,query:' YXR888 ',couponOnly:true})?.price,24);
 assert.equal(matchingDirectoryPlan(find('feiv'),{...emptyDirectoryFilters,couponOnly:true}),undefined);
});
test('annual equivalents never satisfy a cash budget, annual totals and one-time quotas keep their periods',()=>{
 assert.equal(matchingDirectoryPlan(find('feimaoyun'),{...emptyDirectoryFilters,maxPrice:10}),undefined);
 assert.equal(matchingDirectoryPlan(find('feimaoyun'),{...emptyDirectoryFilters,period:'month',maxPrice:16})?.trafficGB,350);
 assert.equal(matchingDirectoryPlan(find('edgenova'),{...emptyDirectoryFilters,period:'year',maxPrice:86})?.price,86);
 assert.equal(matchingDirectoryPlan(find('edgenova'),{...emptyDirectoryFilters,period:'month'}),undefined);
 assert.equal(matchingDirectoryPlan(find('feiv'),{...emptyDirectoryFilters,period:'one-time',minTraffic:200,maxPrice:29})?.period,'one-time');
 assert.equal(filterNumber('-1'),null);assert.equal(filterNumber('Infinity'),null);assert.equal(filterNumber(''),null);assert.equal(filterNumber('0'),0);
 assert.equal(filtersFromParams(new URLSearchParams('period=bad&max=-4&traffic=100&coupon=1')).period,'all');
});
test('local memory sanitizes corrupt data, deduplicates brands and bounds candidate, recent and comparison lists',()=>{
 assert.deepEqual(parseBrandMemory('broken',airports),emptyBrandMemory());
 assert.deepEqual(parseBrandMemory('{"version":99}',airports),emptyBrandMemory());
 const slugs=airports.map(a=>a.slug),parsed=parseBrandMemory(JSON.stringify({version:1,candidates:['bad',slugs[0],slugs[0],...slugs],recent:['bad',...slugs],comparison:{brands:['bad',...slugs],view:'invalid'}}),airports);
 assert.deepEqual(parsed.candidates,slugs.slice(0,4));assert.deepEqual(parsed.recent,slugs.slice(0,6));assert.deepEqual(parsed.comparison,{brands:slugs.slice(0,4),view:'plans'});
 assert.equal(parseBrandMemory('{"version":1,"comparison":{"brands":["yinxingren"]}}',airports).comparison,null);
});
test('candidate removal frees a slot; recent visits move to the front and never duplicate or accept unknown brands',()=>{
 let memory=emptyBrandMemory();for(const brand of airports.slice(0,4))memory=toggleCandidate(memory,brand.slug,airports).memory;
 assert.equal(toggleCandidate(memory,airports[4].slug,airports).full,true);assert.equal(memory.candidates.length,4);
 memory=toggleCandidate(memory,airports[0].slug,airports).memory;memory=toggleCandidate(memory,airports[4].slug,airports).memory;assert.equal(memory.candidates.length,4);assert.ok(memory.candidates.includes(airports[4].slug));
 for(const brand of airports.slice(0,8))memory=recordBrandVisit(memory,brand.slug,airports);
 memory=recordBrandVisit(memory,airports[3].slug,airports);assert.equal(memory.recent[0],airports[3].slug);assert.equal(memory.recent.length,6);assert.equal(new Set(memory.recent).size,6);
 assert.deepEqual(recordBrandVisit(memory,'not-a-brand',airports),memory);
});
test('comparison URLs restore all views, sanitize invalid brands and represent an intentionally empty selection',()=>{
 for(const view of ['plans','charts','all'] as const){const query=comparisonSearch(['yinxingren','bad','muguang','yinxingren'],view,airports),params=new URLSearchParams(query);
  assert.deepEqual(selectedBrandSlugs(params.get('brands'),airports),['yinxingren','muguang']);assert.equal(comparisonMode(params.get('view')),view);
 }
 assert.equal(comparisonSearch([],'plans',airports),'');assert.equal(comparisonSearch([],'charts',airports),'?view=charts');
});
test('rendered directory plans, shortlist controls, share tools and privacy text match the new local features',()=>{
 const $=load(fs.readFileSync('dist/airport/index.html','utf8')),data:DirectoryBrand[]=JSON.parse($('#directory-filter-data').text());assert.equal(data.length,28);
 assert.equal($('[data-directory-slug]').length,28);assert.equal($('#brand-period option').length,4);assert.equal($('#my-brands').length,1);
 for(const brand of partnerAirports){const item=data.find(b=>b.slug===brand.slug)!;assert.deepEqual(item.plans.map(p=>[p.priceText,p.trafficText]),brand.plans.map(p=>[planPriceText(p),planTrafficText(p)]));}
 for(const brand of airports){const page=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));assert.equal(page('[data-save-brand="'+brand.slug+'"]').length,1);}
 const compare=load(fs.readFileSync('dist/compare/index.html','utf8'));for(const id of ['copy-comparison','save-comparison','restore-comparison','clear-saved-comparison'])assert.equal(compare('#'+id).length,1);
 const privacy=load(fs.readFileSync('dist/privacy-policy/index.html','utf8'));assert.ok(privacy('main').text().includes('浏览器本地存储'));assert.ok(!privacy('main').text().includes('刷新后重置'));
});
