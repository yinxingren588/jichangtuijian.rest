import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {files,type Result} from './common';
export const evidenceFile='docs/mobile-lighthouse-summary.json';
export function buildFingerprint(){const hash=createHash('sha256');for(const file of files('dist').sort()){hash.update(path.relative('dist',file).split(path.sep).join('/'));hash.update('\0');hash.update(fs.readFileSync(file));}return hash.digest('hex');}
type Scores=Record<'performance'|'accessibility'|'best-practices'|'seo',number>;
export interface LabPage {name:string;path:string;url:string;expectedNoindex:boolean;scores:Scores;metrics:Record<string,{value:number;display:string}>;version:string;fetchedAt:string;reportSha256:string}
export interface LabEvidence {generatedAt:string;method:string;buildFingerprint:string;pages:LabPage[];limits:string[]}
export function lighthouseResult():Result {
 const name='Lighthouse手机实验室检测（四个代表页面）';
 if(!fs.existsSync(evidenceFile))return {name,status:'NOT TESTED',detail:'尚未导入当前构建对应的实际Lighthouse结果，不提供推测分数。'};
 const evidence=JSON.parse(fs.readFileSync(evidenceFile,'utf8')) as LabEvidence;
 if(evidence.buildFingerprint!==buildFingerprint())return {name,status:'NOT TESTED',detail:'已有实验室结果与当前构建指纹不同，需要对当前产物重新检测。'};
 const passed=evidence.pages.length===4&&evidence.pages.every(p=>p.scores.performance>=90&&p.scores.accessibility>=90&&p.scores['best-practices']>=90&&(p.expectedNoindex||p.scores.seo>=95));
 return {name,status:passed?'PASS':'FAIL',detail:evidence.pages.map(p=>`${p.path}：性能${p.scores.performance} / 可访问性${p.scores.accessibility} / 最佳实践${p.scores['best-practices']} / ${p.expectedNoindex?'搜索页有意noindex，SEO分数不作为开放索引目标':'SEO'+p.scores.seo}`).join('；')+'。本地模拟手机检测，绑定当前构建；不代表正式托管速度、真实用户核心网页指标或Bing排名。'};
}
