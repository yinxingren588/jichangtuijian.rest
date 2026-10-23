import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
import {files} from './common';
const rows=files('dist').filter(f=>/\.(html|js|css)$/.test(f)).map(file=>{const body=fs.readFileSync(file);return {file:file.replaceAll('\\','/').replace(/^dist\//,''),bytes:body.length,gzipBytes:gzipSync(body).length};});
const largest=(extension:string)=>rows.filter(r=>r.file.endsWith(extension)).sort((a,b)=>b.gzipBytes-a.gzipBytes).slice(0,5);
const result={date:'2026-10-23',scope:'构建文件字节统计；gzip为本地估算，实际传输由托管设置决定。不是网络加载、Lighthouse或Core Web Vitals测量。',html:largest('.html'),javascript:largest('.js'),css:largest('.css'),thirdPartyCode:'没有新增第三方运行时脚本、远程字体或追踪请求。',imageLoading:'图表及两张教程界面截图使用loading=lazy，原始图按需打开。',thresholds:{htmlGzipBytes:80_000,javascriptGzipBytes:40_000,cssGzipBytes:40_000}};
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/asset-budget.json',JSON.stringify(result,null,2)+'\n');
const failed=rows.filter(r=>r.gzipBytes>(r.file.endsWith('.html')?result.thresholds.htmlGzipBytes:r.file.endsWith('.js')?result.thresholds.javascriptGzipBytes:result.thresholds.cssGzipBytes));
console.log(JSON.stringify({html:result.html[0],javascript:result.javascript[0],css:result.css[0],budget:failed.length?'FAIL':'PASS'}));if(failed.length){console.error(failed);process.exitCode=1;}
