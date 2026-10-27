import fs from 'node:fs';
import sharp from 'sharp';
import {evidenceRecords} from '../src/data/evidence';
import {evidencePageUrl,shareEvidenceText} from '../src/lib/share-evidence';
const dir='public/share-cards';fs.mkdirSync(dir,{recursive:true});
const esc=(text:string)=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const record of evidenceRecords){
 const values=[['平均下载',record.averageDownloadMBps.toFixed(2),'MB/s'],['图示最高峰值',record.peakDownloadMBps.toFixed(2),'MB/s'],['平均 TLS RTT',record.averageTlsMs.toFixed(1),'ms'],['平均 HTTPS Ping',record.averageHttpsMs.toFixed(1),'ms']];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720"><rect width="1200" height="720" fill="#080f1d"/><rect x="30" y="30" width="1140" height="660" rx="24" fill="#101d32" stroke="#3d5579"/><g font-family="Microsoft YaHei, PingFang SC, sans-serif"><text x="75" y="98" fill="#91b3e4" font-size="18" letter-spacing="3">航线笔记 / 站长实测摘要</text><text x="75" y="170" fill="#e0ebff" font-size="42" font-weight="700">${esc(record.name)}</text><text x="75" y="218" fill="#aec5e4" font-size="20">图示时间 ${record.time} · ${record.nodeCount} 个节点 · 时区未标注</text>${values.map((v,i)=>`<g transform="translate(${75+i*275},282)"><text fill="#a6bfdf" font-size="18">${v[0]}</text><text y="67" fill="#e0edff" font-size="43" font-weight="700">${v[1]}</text><text y="103" fill="#89a9d7" font-size="20">${v[2]}</text></g>`).join('')}<path d="M75 442H1125" stroke="#354c6c"/><text x="75" y="486" fill="#b4cce9" font-size="19">本期统一测试环境（站长确认）；运营商、带宽、设备等参数待补充。</text><text x="75" y="522" fill="#b4cce9" font-size="19">结果对应图示节点与日期；峰值不代表持续速度，不同日期不作同一时点排名。</text><text x="75" y="577" fill="#d0e0f7" font-size="19">原图与完整说明</text><text x="75" y="614" fill="#8db6ef" font-size="18">${esc(evidencePageUrl(record))}</text><text x="75" y="653" fill="#859fbe" font-size="16">分享时请保留日期、单位和原文链接 · jichangtuijian.rest</text></g></svg>`;
 fs.writeFileSync(`${dir}/${record.slug}.svg`,svg);
 await sharp(Buffer.from(svg)).png().toFile(`${dir}/${record.slug}.png`);
 fs.writeFileSync(`${dir}/${record.slug}.txt`,shareEvidenceText(record)+'\n');
}
console.log(`Generated ${evidenceRecords.length} PNG/SVG share summaries using existing chart values only.`);
