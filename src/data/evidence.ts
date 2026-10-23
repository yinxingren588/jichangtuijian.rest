import raw from './evidence.json';

export interface ChartAsset {original:string;preview:string;width:number;height:number;previewWidth:number;previewHeight:number;bytes:number;previewBytes:number;sha256:string;source:string}
export interface EvidenceRecord {slug:string;name:string;brandSlug:string|null;sourceType:string;independentlyVerified:boolean;nodeCount:number;time:string;timeZone:string|null;averageTlsMs:number;averageHttpsMs:number;averageDownloadMBps:number;peakDownloadMBps:number;greenCounts:number[];speed:ChartAsset;unlock:ChartAsset}
export const evidenceRecords:EvidenceRecord[]=raw.records;
export const evidenceFor=(slug:string)=>evidenceRecords.find(record=>record.brandSlug===slug);
export const summaryCharts=raw.summaries;
export const platforms=['YouTube','Netflix','Disney+','Bilibili','TikTok','DAZN','Abema','巴哈姆特动画疯','OpenAI','Steam 货币区'];
export const chartSize=(asset:ChartAsset)=>(asset.bytes/1_000_000).toFixed(2)+' MB';
