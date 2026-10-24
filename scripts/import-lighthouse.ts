import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildFingerprint,evidenceFile,type LabEvidence,type LabPage} from './lighthouse-evidence';
const reportDir=process.argv[2];
if(!reportDir)throw Error('Provide a directory containing home.json, brand.json, article.json and search.json from actual mobile Lighthouse runs.');
const targets=[{name:'home',path:'/',expectedNoindex:false},{name:'brand',path:'/airport/yinxingren/',expectedNoindex:false},{name:'article',path:'/blog/video-bitrate-budget/',expectedNoindex:false},{name:'search',path:'/search/',expectedNoindex:true}];
const pages:LabPage[]=targets.map(target=>{
 const bytes=fs.readFileSync(path.join(reportDir,target.name+'.json'));const r=JSON.parse(bytes.toString('utf8'));
 if(r.runtimeError||r.configSettings?.formFactor!=='mobile'||new URL(r.finalDisplayedUrl||r.finalUrl).pathname!==target.path)throw Error('Invalid, failed or non-mobile report: '+target.name);
 const scores=Object.fromEntries(['performance','accessibility','best-practices','seo'].map(k=>{const score=r.categories[k]?.score;if(typeof score!=='number')throw Error('Missing category '+k);return[k,Math.round(score*100)];})) as LabPage['scores'];
 const metrics=Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'].map(k=>[k,{value:r.audits[k].numericValue,display:r.audits[k].displayValue}]));
 return {...target,url:r.finalDisplayedUrl||r.finalUrl,scores,metrics,version:r.lighthouseVersion,fetchedAt:r.fetchTime,reportSha256:createHash('sha256').update(bytes).digest('hex')};
});
const evidence:LabEvidence={generatedAt:new Date().toISOString(),method:'Lighthouse默认手机模拟，独立无界面Chrome、本地Astro预览，四条指定路径各一次加载；非线上用户测量。',buildFingerprint:buildFingerprint(),pages,limits:['单次实验室运行可能波动，未采集线上真实用户数据。','搜索页有意noindex，保留原始SEO分数但不为提高分数取消noindex。','不把四个代表页的结果扩展为全站每一页得分；未测INP真实用户分布。']};
fs.writeFileSync(evidenceFile,JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({pages:pages.map(p=>({path:p.path,scores:p.scores})),buildFingerprint:evidence.buildFingerprint}));
