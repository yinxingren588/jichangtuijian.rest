import fs from 'node:fs';
import {load} from 'cheerio';
import {airports} from '../src/data/airports';
import {brandSeo,brandSeoUpdated} from '../src/data/brand-seo';
import {site} from '../src/data/site';

const records=airports.map(brand=>{
 const $=load(fs.readFileSync('dist/airport/'+brand.slug+'/index.html','utf8'));
 return {brand:brand.name,slug:brand.slug,kind:brand.kind,url:site.url+'/airport/'+brand.slug+'/',preview:'http://127.0.0.1:4321/airport/'+brand.slug+'/',title:$('title').text(),description:$('meta[name="description"]').attr('content')!,keywords:$('meta[name="keywords"]').attr('content')!,heading:$('h1').text()};
});
for(const r of records)if(r.description!==brandSeo[r.slug].description||!r.keywords||r.title!==brandSeo[r.slug].title+' · '+site.name)throw Error('Build and TDK configuration differ: '+r.slug);
const lines=[`# 全部品牌独立 TDK 完整清单 · ${brandSeoUpdated}`,'','本轮已为全部 33 个独立品牌页编写标题、描述和关键词，并单独设置页面大标题：28 个机场品牌与另外 5 个商业 VPN 品牌。以下 T、D、K 和 H1 均从本次构建的实际页面读取，不是待应用的文案。','',
'- T：网页标题，末尾由网站统一加上“ · 航线笔记”；搜索引擎展示文字可能与网页设置不同。',
'- D：页面描述，分别突出各品牌已有的套餐价格、流量、节点测速资料、优惠条件或待补充项目。',
'- K：关键词标签，各品牌独立写入，不在正文中重复堆放。',
'- H1：客户打开页面时看到的大标题，可与 SEO 标题分别修改。',
'','价格沿用现有参考记录，没有宣称已核验商家最新结算。28 家机场的维护者测速与解锁图未独立复测；5 家 VPN 没有本站测速图，描述明确说明。年付月均、完整年费和一次性额度分别处理，优惠码不自动计算折后价。','',
'## 28 个机场品牌','',...records.filter(r=>r.kind==='airport').flatMap((r,i)=>[`### ${i+1}. ${r.brand}`,'',`- 独立页面：[本地查看](${r.preview}) · [正式路径](${r.url})`,`- **T｜标题：** ${r.title}`,`- **D｜描述：** ${r.description}`,`- **K｜关键词：** ${r.keywords}`,`- **H1｜页面大标题：** ${r.heading}`,'']),
'## 另外 5 个商业 VPN 品牌','',...records.filter(r=>r.kind==='vpn').flatMap((r,i)=>[`### ${i+29}. ${r.brand}`,'',`- 独立页面：[本地查看](${r.preview}) · [正式路径](${r.url})`,`- **T｜标题：** ${r.title}`,`- **D｜描述：** ${r.description}`,`- **K｜关键词：** ${r.keywords}`,`- **H1｜页面大标题：** ${r.heading}`,'']),
'## 后续修改与本轮范围','','每个品牌的独立字段维护在 src/data/brand-seo.json，对应条目以 slug 区分。网站共享模板不会再用同一规则覆盖品牌标题；套餐和图表正文保留。修改后重新构建并运行 npm run export:tdk 可导出新清单。','',
'本轮应用范围为本地网站与交付压缩包；没有执行正式上线、域名配置或搜索引擎远端提交。正式路径表示网站配置中的品牌地址，不表示本轮已经部署。',''];
fs.writeFileSync('docs/brand-tdk.md',lines.join('\n'));
fs.writeFileSync('docs/brand-tdk-export.json',JSON.stringify({updated:brandSeoUpdated,records},null,2)+'\n');
console.log(`Exported ${records.length} actual brand TDK records (${records.filter(r=>r.kind==='airport').length} airports, ${records.filter(r=>r.kind==='vpn').length} VPNs).`);
