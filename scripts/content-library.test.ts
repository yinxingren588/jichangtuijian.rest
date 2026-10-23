import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {readLibrary,shingles,similarity} from './library';
const all=readLibrary();
test('requested library contains 200 articles and 30 tutorials, with glossary separate',()=>{
 const target:Record<string,number>=JSON.parse(fs.readFileSync('docs/content-target.json','utf8'));
 for(const [section,count]of Object.entries(target))assert.equal(all.filter(a=>a.meta.section===section).length,count,section);
 assert.equal(new Set(all.map(a=>a.meta.title)).size,all.length);
 const routes=new Set(all.map(a=>'/'+a.meta.section+'/'+a.slug+'/'));
 for(const a of all){assert.ok(a.body.length>=450,a.slug);assert.ok(a.meta.sources.length,a.slug);assert.ok(a.meta.published<=a.meta.updated,a.slug);for(const route of a.meta.related||[])assert.ok(routes.has(route),a.slug+' related '+route);}
});
test('new procedural tutorials include preparation, six real steps, outcomes and recovery',()=>{
 for(const a of all.filter(a=>a.meta.section==='guides')){assert.equal((a.body.match(/^### 第\d步/gm)||[]).length,6,a.slug);for(const title of ['开始前准备','完成后应该得到什么','无改善时怎样恢复','何时停止继续操作'])assert.ok(a.body.includes(title),a.slug+' '+title);}
});
test('article bodies do not duplicate or exceed the lexical near-duplicate threshold',()=>{
 const documents=all.map(a=>({...a,set:shingles(a.body)}));let max=0;let pair='';
 for(let i=0;i<documents.length;i++)for(let j=i+1;j<documents.length;j++){const value=similarity(documents[i].set,documents[j].set);if(value>max){max=value;pair=documents[i].slug+' / '+documents[j].slug;}}
 assert.ok(max<.78,'near duplicate '+pair+' '+max.toFixed(3));
 console.log('Maximum 8-character shingle Jaccard similarity:',max.toFixed(3),pair,'(lexical check, not human editorial review)');
});
test('all content has built HTML and pagination exposes the entire article library',()=>{
 for(const a of all)assert.ok(fs.existsSync('dist/'+a.meta.section+'/'+a.slug+'/index.html'),a.slug);
 const linked=new Set<string>();for(let n=1;n<=9;n++){const file=n===1?'dist/blog/index.html':`dist/blog/page/${n}/index.html`;const $=load(fs.readFileSync(file,'utf8'));$('article h2 a').each((_,e)=>{linked.add($(e).attr('href')!);});}
 assert.equal(linked.size,200);for(const a of all.filter(a=>a.meta.section==='blog'))assert.ok(linked.has('/blog/'+a.slug+'/'),a.slug);
 const $=load(fs.readFileSync('dist/guides/index.html','utf8'));assert.equal($('article h3 a').length,30);
});
