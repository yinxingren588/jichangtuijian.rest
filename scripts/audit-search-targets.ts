import fs from 'node:fs';
import {pages,origin,report} from './common';
import {searchIntentTargets} from '../src/data/search-intents';
const all=pages(),byPath=new Map(all.map(p=>[p.url,p]));
const incoming=new Map<string,Set<string>>(),errors:string[]=[],keywords=new Set<string>();
for(const page of all)for(const el of page.$('main a[href]').toArray()){
 const href=page.$(el).attr('href')!;try{const url=new URL(href,origin+page.url);if(url.origin===origin&&url.pathname!==page.url){const set=incoming.get(url.pathname)||new Set<string>();set.add(page.url);incoming.set(url.pathname,set);}}catch{}
}
const rows=searchIntentTargets.map(target=>{
 const key=target.keyword.toLowerCase().replace(/\s+/g,'');if(keywords.has(key))errors.push('重复关键词 '+target.keyword);keywords.add(key);
 const page=byPath.get(target.url);if(!page){errors.push('目标页缺失 '+target.url);return {...target,title:'',h1:'',incomingPages:0};}
 const $=page.$;
 if($('meta[name="robots"]').attr('content')!=='index, follow'||$('link[rel="canonical"]').attr('href')!==origin+target.url)errors.push('目标不可索引或Canonical不匹配 '+target.url);
 if(!incoming.get(target.url)?.size)errors.push('无正文入站链接 '+target.url);
 return {...target,title:$('title').text(),h1:$('h1').text(),incomingPages:incoming.get(target.url)?.size||0};
});
fs.writeFileSync('docs/search-intent-targets.json',JSON.stringify({updated:'2026-10-24',scope:'编辑规划与实际目标页核对；未获取搜索量、排名、展现或点击数据。',passed:!errors.length,keywords:rows.length,pages:new Set(rows.map(r=>r.url)).size,rows},null,2)+'\n');
const csv=(value:unknown)=>'"'+String(value??'').replaceAll('"','""')+'"';
fs.writeFileSync('docs/search-performance-tracker.csv','\uFEFF'+[
 ['关键词','主要目标URL','需求','优先级','分组','实际Title','实际H1','正文入站页数','Bing展现','Bing点击','Bing平均位置','观察周期'].map(csv).join(','),
 ...rows.map(r=>[r.keyword,origin+r.url,r.intent,r.priority,r.group,r.title,r.h1,r.incomingPages,'','','',''].map(csv).join(',')),
].join('\r\n')+'\r\n');
report('audit-search-targets',[{name:'关键词意图与实际目标页',status:errors.length?'FAIL':'PASS',detail:errors.join('；')||`${rows.length}个规划词映射至${new Set(rows.map(r=>r.url)).size}个现有页面；可索引状态、Canonical与正文入站链接通过。排名跟踪数据保留空白，不将规划视为排名或搜索量测量。`}]);
