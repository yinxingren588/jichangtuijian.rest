import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
export const origin='https://jichangtuijian.rest';
export function files(dir:string):string[]{return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
export function pages(){return files('dist').filter(f=>f.endsWith('.html')).map(file=>{let url='/'+path.relative('dist',file).split(path.sep).join('/').replace(/index\.html$/,'');if(url==='/404.html')url='/404/';return{file,url,$:load(fs.readFileSync(file,'utf8'))};});}
export type Result={name:string;status:'PASS'|'FAIL'|'NOT TESTED';detail:string};
export function report(part:string,results:Result[]){fs.mkdirSync('.state',{recursive:true});fs.writeFileSync('.state/'+part+'.json',JSON.stringify(results,null,2));const all=fs.readdirSync('.state').filter(f=>/^audit-.*\.json$/.test(f)).flatMap(f=>JSON.parse(fs.readFileSync('.state/'+f,'utf8')) as Result[]);fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/final-audit.md','# 验收报告\n\n报告检查实际构建产物；PASS 仅表示所列自动规则通过，不表示人工事实审计完成。\n\n| 检查 | 状态 | 证据与限制 |\n|---|---|---|\n'+all.map(r=>`| ${r.name} | ${r.status} | ${r.detail.replace(/\|/g,'/').replace(/\n/g,'；')} |`).join('\n')+'\n');for(const r of results)console.log(`${r.status} ${r.name}: ${r.detail}`);if(results.some(r=>r.status==='FAIL'))process.exitCode=1;}
