import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {readLibrary} from './library';
import {airports} from '../src/data/airports';
import {brandEditorials} from '../src/data/brand-editorials';
import {planComparison} from '../src/lib/brand-content';

const library=readLibrary();
test('every published article, guide and glossary entry belongs to one complete reciprocal reading cycle',()=>{
 const edges=new Map<string,{section:string;previous:string;next:string}>();
 for(const entry of library){
  const route='/'+entry.meta.section+'/'+entry.slug+'/';
  const $=load(fs.readFileSync('dist'+route+'index.html','utf8'));
  const previous=$('[data-reading-direction="prev"]');const next=$('[data-reading-direction="next"]');
  assert.equal(previous.length,1,route+' previous');assert.equal(next.length,1,route+' next');
  const before=previous.attr('href')!;const after=next.attr('href')!;
  assert.notEqual(before,route);assert.notEqual(after,route);
  assert.equal($('[data-related-reading]').length,4,route+' related reading');
  edges.set(route,{section:entry.meta.section,previous:before,next:after});
 }
 assert.equal(edges.size,235);
 for(const [route,edge] of edges){assert.ok(edges.has(edge.next),route);assert.ok(edges.has(edge.previous),route);assert.equal(edges.get(edge.next)!.previous,route);assert.equal(edges.get(edge.previous)!.next,route);assert.equal(edges.get(edge.next)!.section,edge.section);}
 for(const section of ['blog','guides','glossary']){
  const start=[...edges.keys()].find(route=>edges.get(route)!.section===section)!;const seen=new Set<string>();let route=start;
  while(!seen.has(route)){seen.add(route);route=edges.get(route)!.next;}
  assert.equal(route,start);assert.equal(seen.size,library.filter(a=>a.meta.section===section).length,section+' cycle reaches every entry');
 }
});

test('all 33 brand pages have individually authored analysis, relevant reading, comparisons and explicit evidence provenance',()=>{
 assert.deepEqual(Object.keys(brandEditorials).sort(),airports.map(a=>a.slug).sort());
 const focuses=new Set<string>();const questions=new Set<string>();
 for(const brand of airports){
  const editorial=brandEditorials[brand.slug];focuses.add(editorial.focus);questions.add(editorial.question);
  const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));
  assert.equal($('[data-brand-editorial]').attr('data-brand-editorial'),brand.slug);
  const text=$('[data-brand-editorial]').text();
  for(const value of [editorial.focus,editorial.analysis,editorial.scenario,editorial.caution,editorial.verdict,editorial.question,editorial.answer])assert.ok(text.includes(value),brand.slug+' authored content');
  for(const id of ['brand-overview','plans-heading','selection-heading','coupon-heading','profile-heading','performance-evidence','brand-faq','brand-reading','brand-alternatives','sources-heading'])assert.equal($('[id="'+id+'"]').length,1,brand.slug+' '+id);
  assert.equal($('[data-evidence-state]').attr('data-evidence-state'),brand.kind==='airport'?'provided':'pending');
  assert.equal($('.brand-reading-list>a').length,3);
  assert.equal($('.brand-crosslinks>div').length,2);
  for(const peer of editorial.comparisons){assert.notEqual(peer,brand.slug);assert.equal(airports.find(a=>a.slug===peer)!.kind,brand.kind);assert.ok($('.brand-crosslinks a').toArray().some(e=>$(e).attr('href')==='/compare/?brands='+brand.slug+','+peer));}
 }
 assert.equal(focuses.size,33);assert.equal(questions.size,33);
});

test('brand next and previous links form separate complete airport and VPN cycles',()=>{
 const edges=new Map<string,{previous:string;next:string}>();
 for(const brand of airports){const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));edges.set('/airport/'+brand.slug+'/',{previous:$('[data-brand-direction="prev"]').attr('href')!,next:$('[data-brand-direction="next"]').attr('href')!});}
 for(const [route,edge]of edges){assert.notEqual(route,edge.next);assert.equal(edges.get(edge.next)?.previous,route);assert.equal(edges.get(edge.previous)?.next,route);}
 for(const kind of ['airport','vpn']){const start='/airport/'+airports.find(a=>a.kind===kind)!.slug+'/';const seen=new Set<string>();let route=start;while(!seen.has(route)){seen.add(route);route=edges.get(route)!.next;}assert.equal(route,start);assert.equal(seen.size,airports.filter(a=>a.kind===kind).length);}
});

test('new plan narratives keep annual totals, monthly equivalents, one-time quotas and free plans distinct',()=>{
 const brand=(slug:string)=>airports.find(a=>a.slug===slug)!;
 assert.match(planComparison(brand('feimaoyun')),/完整年付总额/);
 assert.match(planComparison(brand('edgenova')),/年付周期多 CNY 82/);
 assert.match(planComparison(brand('edgenova')),/每月额度多 250 GB/);
 assert.match(planComparison(brand('feiv')),/一次性总量/);
 assert.match(planComparison(brand('hide-me')),/免费与付费/);
 assert.doesNotMatch(planComparison(brand('hide-me')),/一次性/);
 assert.match(planComparison(brand('windscribe')),/不能用空白价格推断免费/);
});
