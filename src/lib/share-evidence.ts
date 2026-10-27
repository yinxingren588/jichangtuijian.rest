import type {EvidenceRecord} from '../data/evidence';
import {site} from '../data/site';
export function evidencePageUrl(record:EvidenceRecord):string {
 return record.brandSlug?`${site.url}/airport/${record.brandSlug}/#performance-evidence`:`${site.url}/evidence/#${record.slug}`;
}
export function shareEvidenceText(record:EvidenceRecord):string {
 return `${record.name}｜站长实测图表摘要\n测试时间：${record.time}（时区未标注）\n${record.nodeCount}个节点；图示平均下载${record.averageDownloadMBps.toFixed(2)} MB/s，平均HTTPS Ping ${record.averageHttpsMs.toFixed(1)} ms。\n站长确认本期图表使用同一测试环境，具体参数待补充。不同测试日期不作为同一时点竞速排名；结果仅对应图示条件。\n原图与说明：${evidencePageUrl(record)}`;
}
