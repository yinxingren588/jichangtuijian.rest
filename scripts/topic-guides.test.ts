import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {deepTopicSlugs,topicGuides} from '../src/data/topic-guides';
import {site} from '../src/data/site';

test('four task guides render distinct decision tables and working paths to their unchanged ten-brand lists',()=>{
 assert.equal(deepTopicSlugs.length,4);
 assert.equal(new Set(deepTopicSlugs.map(slug=>topicGuides[slug].heading)).size,4);
 for(const slug of deepTopicSlugs){
  const guide=topicGuides[slug];const $=load(fs.readFileSync(`dist/recommend/${slug}/index.html`,'utf8'));
  const section=$(`[data-topic-guide="${slug}"]`);assert.equal(section.length,1,slug);
  assert.equal(section.find('tbody tr').length,guide.rows.length,slug);
  assert.equal(section.find('.selection-card').length,3,slug);
  assert.equal(section.find('details').length,guide.questions.length,slug);
  for(const link of [...guide.links,...guide.steps.map(s=>s.link)])assert.ok(section.find(`a[href="${link.href}"]`).length,slug+' '+link.href);
  assert.equal(section.find('a[href="#topic-ranking-heading"]').length,1,slug);
  assert.equal($('#topic-ranking-heading').length,1,slug);
  assert.equal($('[data-ranked-brand]').length,10,slug);
  assert.equal($('[data-ranked-brand]').first().attr('data-ranked-brand'),'yinxingren',slug);
  assert.ok($('title').text().includes(guide.title),slug);
  assert.equal($('link[rel="canonical"]').attr('href'),site.url+`/recommend/${slug}/`,slug);
 }
});
