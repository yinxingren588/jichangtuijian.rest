import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {topics} from '../src/data/site';
import {partnerAirports,planPriceText,planTrafficText} from '../src/data/airports';
import {topicRanking,type TopicSlug} from '../src/data/topic-rankings';

test('six topic lists each contain ten unique airport brands and preserve the requested placements',()=>{
 assert.equal(topics.length,6);
 for(const topic of topics){const rows=topicRanking(topic.slug as TopicSlug);
  assert.equal(rows.length,10);assert.equal(new Set(rows.map(r=>r.brand.slug)).size,10);
  assert.ok(rows.every((r,i)=>r.rank===i+1&&r.brand.kind==='airport'));
  if(topic.slug!=='budget')assert.equal(rows[0].brand.slug,'yinxingren');
 }
 assert.deepEqual(topicRanking('premium').map(r=>r.brand.slug),partnerAirports.slice(0,10).map(a=>a.slug));
});

test('budget list uses actual monthly reference amounts and excludes cheaper annual equivalents',()=>{
 const rows=topicRanking('budget');
 assert.equal(rows[0].brand.slug,'feiv');assert.equal(rows[0].plan.price,4.9);
 assert.equal(rows.find(r=>r.brand.slug==='feimaoyun')!.plan.price,16);
 assert.equal(rows.find(r=>r.brand.slug==='firefly')!.plan.price,16);
 assert.ok(!rows.some(r=>r.brand.slug==='edgenova'));
 for(const [i,row]of rows.entries()){
  assert.equal(row.plan.period,'month');assert.notEqual(row.plan.priceKind,'monthly-equivalent');assert.equal(row.plan.currency,'CNY');
  if(i){assert.ok(row.plan.price>=rows[i-1].plan.price);if(row.plan.price===rows[i-1].plan.price)assert.ok((row.plan.trafficGB??0)<=(rows[i-1].plan.trafficGB??0));}
 }
});

test('topic cards, coupon controls, jump links and structured positions match their own brand records',()=>{
 const directory=load(fs.readFileSync('dist/recommend/index.html','utf8'));
 assert.equal(directory('[data-topic-preview]').length,6);
 for(const topic of topics){const rows=topicRanking(topic.slug as TopicSlug);const $=load(fs.readFileSync('dist/recommend/'+topic.slug+'/index.html','utf8'));
  assert.equal($('[data-ranked-brand]').length,10);assert.equal($('.topic-tabs a[aria-current="page"]').attr('href'),'/recommend/'+topic.slug+'/');
  const schema=JSON.parse($('script[type="application/ld+json"]').text())['@graph'].find((s:{'@type':string})=>s['@type']==='ItemList');
  assert.equal(schema.numberOfItems,10);assert.deepEqual(schema.itemListElement.map((r:{position:number;name:string})=>[r.position,r.name]),rows.map(r=>[r.rank,r.brand.name]));
  for(const row of rows){const card=$('[data-ranked-brand="'+row.brand.slug+'"]');
   assert.ok(card.text().includes(planPriceText(row.plan)));assert.ok(card.text().includes(planTrafficText(row.plan)));assert.ok(card.text().includes(row.metric.value));
   assert.equal(card.attr('id'),'rank-'+row.brand.slug);assert.equal($('.topic-rank-jumps a[href="#rank-'+row.brand.slug+'"]').length,1);
   assert.equal(card.find('a[href="/airport/'+row.brand.slug+'/#plans-heading"]').length,1);assert.equal(card.find('a[href="/airport/'+row.brand.slug+'/#performance-evidence"]').length,1);
   if(row.brand.coupon)assert.equal(card.find('[data-coupon]').attr('data-coupon'),row.brand.coupon.code);else assert.equal(card.find('[data-coupon]').length,0);
  }
  assert.deepEqual(directory('[data-topic-preview="'+topic.slug+'"] .topic-directory-preview li span').map((_,e)=>directory(e).text()).get(),rows.slice(0,3).map(r=>r.brand.name));
 }
});
