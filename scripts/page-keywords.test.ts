import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {pages} from './common';
import {subjectKeywords} from '../src/lib/page-keywords';
import {coreKeywordTargets} from '../src/data/core-keywords';
import {airports} from '../src/data/airports';
import {brandSeo} from '../src/data/brand-seo';

test('every indexable page has complete TDK and one H1 without overwriting brand or primary keyword settings',()=>{
 const all=pages();
 for(const page of all.filter(p=>p.$('meta[name="robots"]').attr('content')==='index, follow')){
  const $=page.$;
  assert.ok($('title').text().trim(),page.url);assert.ok($('meta[name="description"]').attr('content')?.trim(),page.url);
  assert.equal($('meta[name="keywords"]').length,1,page.url);assert.ok($('meta[name="keywords"]').attr('content')?.trim(),page.url);
  assert.equal($('h1').length,1,page.url);
 }
 for(const brand of airports){const $=load(fs.readFileSync(`dist/airport/${brand.slug}/index.html`,'utf8'));assert.equal($('meta[name="keywords"]').attr('content'),brandSeo[brand.slug].keywords.join(', '));}
 for(const target of coreKeywordTargets){
  const page=all.find(p=>p.url===target.url)!;assert.ok(page.$('meta[name="keywords"]').attr('content')!.toLowerCase().includes(target.keyword.toLowerCase()));
  const main=page.$('main').clone();main.find('script,style,nav,aside,h1,.page-intro,.core-reading-routes,.reading-context,.reading-position,.reading-utility,.article-pagination,[data-related-reading]').remove();
  assert.ok(main.text().toLowerCase().replace(/\s+/g,'').includes(target.keyword.toLowerCase()),target.keyword+' must also appear in primary content outside the intro and navigation');
 }
 const home=load(fs.readFileSync('dist/index.html','utf8'));assert.equal(home('meta[name="keywords"]').attr('content'),'机场推荐');
});

test('fallback keyword subjects stay tied to each title, deduplicate case and exclude pagination labels',()=>{
 assert.deepEqual(subjectKeywords('账户到期与流量耗尽，怎样区分',['账户','账户']),['账户到期与流量耗尽','账户']);
 assert.deepEqual(subjectKeywords('VPN与VPN机场有什么区别',['vpn与vpn机场有什么区别','协议']),['VPN与VPN机场有什么区别','协议']);
 assert.deepEqual(subjectKeywords('网络连接知识文章 · 第 2 页'),['网络连接知识文章']);
 assert.ok(subjectKeywords('A1｜A2｜A3｜A4｜A5｜A6｜A7').length<=6);
 assert.ok(!subjectKeywords('根证书与客户端信任').includes('机场推荐'));
});
