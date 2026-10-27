import fs from 'node:fs';
import {load} from 'cheerio';
import {airports} from '../src/data/airports';
import {questionsForBrand} from '../src/data/brand-faq';
const records=airports.map(brand=>{
 const questions=questionsForBrand(brand),$=load(fs.readFileSync(`dist/airport/${brand.slug}/index.html`,'utf8'));
 questions.forEach((q,i)=>{if($('.brand-faq summary').eq(i).text()!==q.question||$('.brand-faq p').eq(i).text()!==q.answer)throw Error('Built FAQ differs: '+brand.slug);});
 return {brand:brand.name,slug:brand.slug,preview:`http://127.0.0.1:4321/airport/${brand.slug}/#brand-faq`,questions};
});
fs.writeFileSync('docs/brand-faq-export.json',JSON.stringify({updated:'2026-10-27',records},null,2)+'\n');
fs.writeFileSync('docs/brand-faq.md',[
 '# 全部品牌专属问答清单','',
 '2026-10-27 · 28个品牌，每家6条，共168条。当前专属问答已与构建后的页面逐项比对，本轮仅保留维护者指定品牌。套餐、优惠码及差额使用同一资料库字段，测速与解锁图为站长确认的本人实测，优惠价永久有效；具体折扣及商家结算分别核对。','',
 ...records.flatMap((r,i)=>[`## ${i+1}. ${r.brand}`,'',`[打开品牌问答](${r.preview})`,'',...r.questions.flatMap((q,n)=>[`### ${n+1}. ${q.question}`,'',q.answer,...(q.links||[]).map(link=>'- '+link.title+'：'+link.url),''])]),
 '## 后续维护','',
 '品牌问答在 src/data/brand-faq.json，本轮新增内容在 src/data/brand-faq-extra.json；原有首条问答在 src/data/brand-editorials.json。双花括号占位符从套餐资料库取值；修改资料后重新构建，并运行 npm run export:faq 生成实际页面清单。没有独立测速证据的品牌不补写性能结论。',''
 ].join('\n'));
console.log(`Exported ${records.length} brand pages and ${records.reduce((n,r)=>n+r.questions.length,0)} rendered answers.`);
