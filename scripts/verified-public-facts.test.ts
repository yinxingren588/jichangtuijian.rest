import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports} from '../src/data/airports';
import {questionsForBrand} from '../src/data/brand-faq';
test('newly read public VPN fields retain currency, complete periods and monthly quota conditions',()=>{
 const brand=(slug:string)=>airports.find(b=>b.slug===slug)!;
 const hide=brand('hide-me');assert.ok(hide.plans.every(p=>p.currency==='USD'));assert.equal(hide.plans.find(p=>p.period==='month')?.price,11.99);
 const wind=brand('windscribe');assert.equal(wind.plans.find(p=>p.period==='month')?.price,9);assert.equal(wind.plans.find(p=>p.period==='year')?.price,69);assert.equal(wind.plans.find(p=>p.period==='year')?.priceKind,'total');assert.equal(wind.plans.find(p=>p.period==='free')?.trafficGB,2);assert.equal(wind.plans.find(p=>p.period==='free')?.trafficPeriod,'month');
 assert.match(wind.plans[0].note!,/验证邮箱.*10GB/);assert.match(wind.deviceLimit!,/禁止账号共享/);
 const bear=brand('tunnelbear');assert.equal(bear.plans[0].trafficPeriod,'month');assert.match(bear.plans[0].note!,/创建.*重置/);assert.match(bear.plans[0].note!,/不结转/);
 assert.ok(questionsForBrand(hide).some(q=>q.answer.includes('美元')));assert.ok(questionsForBrand(bear).some(q=>q.answer.includes('不结转')));
 for(const slug of ['windscribe','tunnelbear','hide-me']){const $=load(fs.readFileSync(`dist/airport/${slug}/index.html`,'utf8'));assert.ok($('main').text().includes('2026-10-24'));assert.equal($('h1').length,1);assert.ok($('[data-chart-download]').attr('href'));}
});
