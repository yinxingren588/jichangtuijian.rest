import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {airports,planPriceText,planTrafficText} from '../src/data/airports';
import {topics} from '../src/data/site';
import {topicRanking,type TopicSlug} from '../src/data/topic-rankings';
import {brandFit} from '../src/data/brand-fit';

test('six overview tables retain all ten ranked brands, matching billing terms, coupon data and static navigation',()=>{
 for(const topic of topics){const $=load(fs.readFileSync('dist/recommend/'+topic.slug+'/index.html','utf8'));const rows=topicRanking(topic.slug as TopicSlug);
  assert.deepEqual($('[data-overview-brand]').map((_,e)=>$(e).attr('data-overview-brand')).get(),rows.map(r=>r.brand.slug));
  for(const row of rows){const record=$('[data-overview-brand="'+row.brand.slug+'"]');assert.ok(record.text().includes(planPriceText(row.plan)));assert.ok(record.text().includes(planTrafficText(row.plan)));
   assert.equal(record.find('[data-topic-select]').attr('value'),row.brand.slug);assert.equal(record.find('a[href="#rank-'+row.brand.slug+'"]').length,1);
   if(row.brand.coupon)assert.equal(record.find('[data-coupon]').attr('data-coupon'),row.brand.coupon.code);else assert.equal(record.find('[data-coupon]').length,0);
  }
  assert.equal($('.topic-overview-scroll[tabindex="0"][role="region"]').length,1);
  assert.equal($('[data-topic-selection-submit]').is('[disabled]'),true);
  assert.equal($('[data-topic-selection-toolbar]').attr('action'),'/compare/');assert.equal($('[data-topic-selected-values]').attr('name'),'brands');
  assert.equal($('.topic-mobile-bar a[href="#topic-overview"]').length,2);assert.equal($('.topic-mobile-bar a[href="#topic-ranking-heading"]').length,1);
  assert.equal($('[data-topic-panel-toggle]').attr('aria-controls'),'topic-mobile-panel');assert.equal($('#topic-mobile-panel nav a').length,6);
  assert.equal($('#topic-mobile-panel nav a[aria-current="page"]').attr('href'),'/recommend/'+topic.slug+'/');
 }
 const ai=load(fs.readFileSync('dist/recommend/ai/index.html','utf8'));
 assert.ok(ai('[data-overview-brand="edgenova"]').text().includes('CNY 86 / 年付'));
 assert.ok(!ai('[data-overview-brand="edgenova"]').text().includes('CNY 86 / 月付'));
});

test('all 33 brand first-screen cues remain distinct and preserve the existing plan and evidence summaries',()=>{
 assert.deepEqual(Object.keys(brandFit).sort(),airports.map(a=>a.slug).sort());
 assert.equal(new Set(Object.values(brandFit).map(f=>f.audience)).size,33);
 for(const brand of airports){const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));const fit=$('[data-brand-fit="'+brand.slug+'"]');
  assert.equal(fit.length,1);assert.equal(fit.find('div').length,3);
  for(const text of Object.values(brandFit[brand.slug])){assert.ok(fit.text().includes(text));assert.ok(text.length<40);assert.doesNotMatch(text,/保证|实测第一|百分之百|全平台解锁/);}
  assert.equal($('[data-brand-snapshot] .snapshot-grid>div').length,4);assert.equal($('.brand-mobile-actions').length,1);
 }
 assert.match(brandFit.feimaoyun.caution,/年付月均/);assert.match(brandFit.edgenova.caution,/年付/);assert.match(brandFit.windscribe.caution,/尚未核实/);
});
