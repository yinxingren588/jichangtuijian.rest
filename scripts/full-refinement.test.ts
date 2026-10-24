import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {readLibrary} from './library';
test('all 200 requested articles match the substantive full-refinement manifest and keep their published URLs',()=>{
 const manifest=JSON.parse(fs.readFileSync('docs/full-article-refinement.json','utf8'));
 const all=readLibrary();const blogs=all.filter(a=>a.meta.section==='blog');
 assert.equal(manifest.count,200);assert.equal(manifest.articles.length,200);assert.equal(blogs.length,200);
 const map=new Map(blogs.map(a=>[a.slug,a]));const routes=new Set(all.map(a=>'/'+a.meta.section+'/'+a.slug+'/'));
 for(const row of manifest.articles){
  const article=map.get(row.slug)!;assert.ok(article,row.slug);
  assert.equal(row.url,'/blog/'+article.slug+'/');assert.equal(article.meta.title,row.title);assert.equal(article.meta.published,row.published);
  assert.notEqual(row.beforeBodySha256,row.afterBodySha256,row.slug+' substantive body change');
  assert.equal(createHash('sha256').update(article.body.replace(/\r\n/g,'\n')).digest('hex'),row.afterBodySha256,row.slug+' source matches reviewed draft');
  assert.equal(article.meta.description,row.description);assert.equal(article.meta.updated,row.updated);
  assert.equal(article.meta.related?.length,4);for(const url of article.meta.related!)assert.ok(routes.has(url),row.slug+' '+url);
  assert.ok(row.focus&&row.distinction,row.slug+' independent scope');
 }
});
test('all 200 rendered articles have valid decision tables, unique anchors and reciprocal reading controls',()=>{
 let tables=0;
 for(const article of readLibrary().filter(a=>a.meta.section==='blog')){
  const $=load(fs.readFileSync(`dist/blog/${article.slug}/index.html`,'utf8'));
  const ids=$('[id]').toArray().map(el=>$(el).attr('id'));assert.equal(ids.length,new Set(ids).size,article.slug+' duplicate anchors');
  assert.equal($('a[data-reading-direction]').length,2,article.slug);assert.equal($('[data-related-reading]').length,4,article.slug);
  $('.prose table').each((_,table)=>{tables++;const count=$(table).find('thead tr').first().children('th,td').length;assert.ok(count>=2,article.slug+' table header');$(table).find('tbody tr').each((_,row)=>assert.equal($(row).children('th,td').length,count,article.slug+' table cell alignment'));});
 }
 assert.ok(tables>=150,'the refined library has substantive comparison tables');
});
