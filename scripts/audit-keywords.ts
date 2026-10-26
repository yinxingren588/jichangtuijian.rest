import fs from 'node:fs';
import {pages,origin,report} from './common';
import {coreKeywordTargets} from '../src/data/core-keywords';

const normalize=(value:string)=>value.toLowerCase().replace(/\s+/g,'');
const all=pages(),indexed=all.filter(p=>p.$('meta[name="robots"]').attr('content')==='index, follow');
const errors:string[]=[];
const rows=coreKeywordTargets.map(target=>{
 const page=indexed.find(p=>p.url===target.url);
 if(!page){errors.push(target.keyword+' 缺少可索引目标页面');return {...target,checks:{},incomingPages:[] as string[]};}
 const $=page.$;
 const primary=$('main').clone();primary.find('script,style,nav,aside,h1,.page-intro,.core-reading-routes,.reading-context,.reading-position,.reading-utility,.article-pagination,[data-related-reading]').remove();
 const checks={title:normalize($('title').text()).includes(normalize(target.keyword)),description:normalize($('meta[name="description"]').attr('content')||'').includes(normalize(target.keyword)),h1:normalize($('h1').text()).includes(normalize(target.keyword)),keywords:normalize($('meta[name="keywords"]').attr('content')||'').includes(normalize(target.keyword)),content:normalize(primary.text()).includes(normalize(target.keyword)),canonical:$('link[rel="canonical"]').attr('href')===origin+target.url};
 for(const [field,pass]of Object.entries(checks))if(!pass)errors.push(target.keyword+' 的 '+field+' 未落实');
 const incomingPages=indexed.filter(p=>p.url!==target.url&&p.$('main a[href]').toArray().some(el=>{
  const href=p.$(el).attr('href')!;const text=p.$(el).text();
  try{const url=new URL(href,origin+p.url);return url.origin===origin&&url.pathname===target.url&&normalize(text).includes(normalize(target.keyword));}catch{return false;}
 })).map(p=>p.url);
 if(incomingPages.length<2)errors.push(target.keyword+' 少于两个具有相关锚文本的正文入站来源');
 return {...target,title:$('title').text(),h1:$('h1').text(),description:$('meta[name="description"]').attr('content')!,checks,incomingPages};
});
fs.writeFileSync('docs/core-keyword-coverage.json',JSON.stringify({updated:'2026-10-26',scope:'实际构建HTML的关键词落地与正文内链检查，不等于收录、排名或流量测量。',htmlPages:all.length,indexablePages:indexed.length,keywordCount:rows.length,passed:errors.length===0,rows},null,2)+'\n');
report('audit-core-keywords',[{name:'原始8个核心关键词与落地页',status:errors.length?'FAIL':'PASS',detail:errors.join('；')||'8个关键词分别落实到7个目标页；Title、Description、H1、Keywords、主要内容与Canonical匹配，每个目标至少有两个相关正文内链来源。'}]);
