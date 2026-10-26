import fs from 'node:fs';
import {load} from 'cheerio';
import {airports} from '../src/data/airports';
import {buyingGuideFor,buyingGuideUpdated} from '../src/data/brand-buying-guides';
import {historyForBrand} from '../src/data/brand-fact-history';
import {site} from '../src/data/site';

const records=airports.map(brand=>{
 const guide=buyingGuideFor(brand),history=historyForBrand(brand);
 const $=load(fs.readFileSync(`dist/airport/${brand.slug}/index.html`,'utf8'));
 const panel=$('[data-brand-buying-guide]');
 for(const text of Object.values(guide))if(!panel.text().includes(text))throw Error('Built guide differs: '+brand.slug);
 if($('[data-brand-fact-history] [data-history-id]').length!==history.length)throw Error('Built history differs: '+brand.slug);
 return {brand:brand.name,slug:brand.slug,url:`${site.url}/airport/${brand.slug}/`,preview:`http://127.0.0.1:4321/airport/${brand.slug}/#selection-heading`,guide,history};
});
const labels=[['summary','站长结论'],['forWhom','适合哪些需求'],['notFor','哪些需求不宜直接选择'],['choice','两档套餐怎样选'],['advantage','资料中可比较的优势'],['tradeoff','需要接受或确认的取舍'],['evidenceFocus','实测怎样支持判断']] as const;
const report=[`# 28个品牌选购结论与维护记录 · ${buyingGuideUpdated}`,'',
 '本报告逐项对照构建后的28个品牌独立页，列出本轮写入的完整选购结论。套餐表、优惠码、推广链接、实测原图和六专题排序保持原资料；本轮没有重新核验商家当前结算，也未执行网站部署。',
 '', '每个品牌均提供独立结论、适用与不适用需求、档位选择、可比较优势、取舍和实测阅读重点；价格与流量使用同一套餐资料字段。原有简短选择段落已由本轮内容替换，核心解读、问答和延伸阅读保留。',
 '', '维护记录包含28份2026-10-26资料建档快照和12条2026-10-24站长永久优惠确认，共40条。资料来源读取日期仍为2026-10-24；建档不是调价，也不是重新核验商家报价。',
 '', ...records.flatMap((r,i)=>[`## ${i+1}. ${r.brand}`,'',`[查看品牌选购结论](${r.preview}) · [查看维护记录](${r.preview.replace('#selection-heading','#brand-fact-history')})`,'',`**${r.guide.headline}**`,'',...labels.flatMap(([key,label])=>[`### ${label}`,'',r.guide[key],'']),'### 已保存的维护记录','',...r.history.map(event=>`- ${event.date}｜${event.title}：${event.note}`),'']),
 '## 维护方式','',
 '品牌结论集中在src/data/brand-buying-guides.json，金额与流量通过事实占位符从套餐资料库读取。价格、流量或优惠更新后，先追加资料变更记录，再检查独立结论中付款模型与适用需求是否仍然准确；记录工具保留旧快照，但不会替代编辑审阅或商家核验。完整维护流程见docs/brand-history-maintenance.md。',''];
fs.writeFileSync('docs/brand-decisions.md',report.join('\n'));
fs.writeFileSync('docs/brand-decisions-export.json',JSON.stringify({updated:buyingGuideUpdated,brands:records.length,editorialFields:records.length*8,baselineSnapshots:records.length,events:records.reduce((sum,r)=>sum+r.history.length,0),records},null,2)+'\n');
console.log(`Verified and exported ${records.length} brand decisions and ${records.reduce((sum,r)=>sum+r.history.length,0)} history events.`);
