import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {trafficDefaults,trafficPresets,estimateTraffic,directoryUrlForEstimate,trafficSummary} from '../src/lib/traffic-calculator';
import {filtersFromParams,matchingDirectoryPlan,type DirectoryBrand} from '../src/lib/directory-filters';
import {partnerAirports,planPriceText,planTrafficText} from '../src/data/airports';
import {lowMonthlyExamples} from '../src/data/selection-examples';

const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);
const directory:DirectoryBrand[]=partnerAirports.map(b=>({slug:b.slug,name:b.name,searchText:b.name.toLowerCase(),hasCoupon:Boolean(b.coupon),plans:b.plans.map(p=>({...p,priceText:planPriceText(p),trafficText:planTrafficText(p)}))}));

test('traffic estimates distinguish transmitted data, charged quota and reserve, with Mbps conversion',()=>{
 const result=estimateTraffic({...trafficDefaults});
 close(result.video,90);close(result.meeting,13.5);close(result.other,6);close(result.files,20);close(result.transferred,129.5);close(result.reserve,25.9);assert.equal(result.recommended,156);
 const isolated=estimateTraffic({...trafficDefaults,days:1,people:1,videoHours:0,meetingHours:1,meetingMbps:1,otherGBPerDay:0,filesGB:0,reservePercent:0});close(isolated.transferred,.45);assert.equal(isolated.recommended,1);
 const doubled=estimateTraffic({...trafficDefaults,multiplier:2});close(doubled.transferred,result.transferred);close(doubled.billed,259);assert.equal(doubled.recommended,311);
});

test('people multiply daily tasks, while household files are counted only once',()=>{
 const household=estimateTraffic({...trafficPresets.household});close(household.transferred,388.5);assert.equal(household.recommended,467);
 assert.equal(estimateTraffic({...trafficPresets.light}).recommended,24);
 const zero=estimateTraffic({...trafficDefaults,videoHours:0,meetingHours:0,otherGBPerDay:0,filesGB:0});assert.equal(zero.recommended,0);assert.equal(directoryUrlForEstimate(zero,null),null);
 const tiny=estimateTraffic({...trafficDefaults,days:1,people:1,videoHours:.25,videoGBPerHour:.01,meetingHours:0,otherGBPerDay:0,filesGB:0,multiplier:.1,reservePercent:0});assert.equal(tiny.recommended,1);
});

test('invalid, fractional counts, blank numeric input and unsafe budgets cannot produce estimates',()=>{
 for(const change of [{days:0},{days:32},{days:1.5},{people:0},{people:2.5},{videoHours:-1},{meetingMbps:Infinity},{filesGB:NaN},{multiplier:0},{reservePercent:101},{monthlyBudget:-1},{monthlyBudget:NaN}])assert.throws(()=>estimateTraffic({...trafficDefaults,...change}),RangeError);
 const tooLarge=estimateTraffic({...trafficDefaults,filesGB:1_000_000,multiplier:10,reservePercent:100});assert.equal(directoryUrlForEstimate(tooLarge,null),null);
 assert.equal(directoryUrlForEstimate(estimateTraffic(trafficDefaults),Infinity),null);
});

test('calculator hands its quota and optional budget to existing same-plan directory filters',()=>{
 const result=estimateTraffic(trafficDefaults),url=directoryUrlForEstimate(result,10)!;
 const parsed=new URL(url,'https://jichangtuijian.rest'),filters=filtersFromParams(parsed.searchParams);
 assert.equal(parsed.pathname,'/airport/');assert.equal(parsed.hash,'#brand-filters');assert.equal(filters.period,'month');assert.equal(filters.maxPrice,10);assert.equal(filters.minTraffic,156);
 const matches=directory.filter(b=>matchingDirectoryPlan(b,filters));assert.deepEqual(matches.map(b=>b.slug),['breezenet']);
 for(const b of matches){const p=matchingDirectoryPlan(b,filters)!;assert.ok(p.price<=10);assert.ok(p.trafficGB!>=156);assert.equal(p.period,'month');assert.notEqual(p.priceKind,'monthly-equivalent');}
 const noBudget=directoryUrlForEstimate(result,null)!;assert.ok(!new URL(noBudget,'https://jichangtuijian.rest').searchParams.has('max'));
 const summary=trafficSummary(trafficDefaults,result);assert.ok(summary.includes('129.5'));assert.ok(summary.includes('156'));assert.ok(summary.includes('不代表品牌倍率'));
});

test('static calculator is indexable, self-contained and usable as a readable example without JavaScript',()=>{
 const $=load(fs.readFileSync('dist/tools/traffic-calculator/index.html','utf8'));
 assert.equal($('h1').length,1);assert.ok($('h1').text().includes('流量需求计算器'));assert.equal($('meta[name="robots"]').attr('content'),'index, follow');assert.equal($('link[rel="canonical"]').attr('href'),'https://jichangtuijian.rest/tools/traffic-calculator/');
 assert.equal($('#traffic-form input').length,11);assert.equal($('#traffic-form input[name="monthlyBudget"]').attr('required'),undefined);assert.equal($('[data-traffic-preset]').length,3);
 assert.equal($('[data-traffic-value="recommended"]').text(),'156');assert.ok($('noscript').text().includes('默认示例'));
 const url=new URL($('#calculator-directory-link').attr('href')!,'https://jichangtuijian.rest');assert.equal(url.searchParams.get('traffic'),'156');
 const graphs=JSON.parse($('script[type="application/ld+json"]').first().text())['@graph'];assert.ok(graphs.some((g:Record<string,unknown>)=>g['@type']==='WebApplication'));
 const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');assert.ok(sitemap.includes('https://jichangtuijian.rest/tools/traffic-calculator/'));
 const client=fs.readFileSync('src/scripts/traffic-calculator.ts','utf8');assert.ok(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest/.test(client));
});

test('selection examples use catalogue fields and preserve all six existing topic leaderboards',()=>{
 const $=load(fs.readFileSync('dist/recommend/budget/index.html','utf8'));assert.ok($('title').text().includes('月付10元以内'));assert.equal($('[data-budget-example]').length,lowMonthlyExamples.length);
 for(const {brand,plan}of lowMonthlyExamples){const row=$(`[data-budget-example="${brand.slug}"]`);assert.equal(row.length,1);assert.ok(row.text().includes(planPriceText(plan)));assert.ok(row.text().includes(planTrafficText(plan)));assert.equal(plan.period,'month');assert.ok(plan.price<=10);assert.notEqual(plan.priceKind,'monthly-equivalent');}
 const home=load(fs.readFileSync('dist/index.html','utf8'));assert.equal(home('[data-home-selection] a[href^="/airport/"]').first().attr('href'),'/airport/yinxingren/');
 const cost=load(fs.readFileSync('dist/blog/plan-cost/index.html','utf8'));assert.equal(cost('[data-cost-examples] .selection-card').length,3);assert.ok(cost('[data-cost-examples]').text().includes('一次性总额度'));
 for(const slug of ['node-name-labels','nearby-node']){const page=load(fs.readFileSync(`dist/blog/${slug}/index.html`,'utf8'));assert.equal(page('[data-node-task-guide] tbody tr').length,4);}
});
