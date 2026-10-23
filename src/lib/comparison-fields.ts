export type CompareMode='plans'|'charts'|'all';
export const comparisonFields=[
 {key:'kind',label:'服务类别',group:'plans'},
 {key:'price',label:'价格 / 付款周期',group:'plans'},
 {key:'traffic',label:'流量 / 发放方式',group:'plans'},
 {key:'coupon',label:'优惠码 / 条件状态',group:'plans'},
 {key:'cost',label:'每 GB 成本（月付）',group:'plans'},
 {key:'regions',label:'已核实节点地区',group:'plans'},
 {key:'protocols',label:'协议',group:'plans'},
 {key:'devices',label:'设备限制',group:'plans'},
 {key:'ai',label:'已核实 AI 支持',group:'plans'},
 {key:'streaming',label:'已核实流媒体支持',group:'plans'},
 {key:'advantages',label:'已收录优点',group:'plans'},
 {key:'limitations',label:'注意事项',group:'plans'},
 {key:'source',label:'资料状态 / 查看日期',group:'plans'},
 {key:'chartStatus',label:'图表状态',group:'charts'},
 {key:'chartTime',label:'图示场景时间',group:'charts'},
 {key:'chartNodes',label:'图示样本',group:'charts'},
 {key:'chartAverage',label:'平均下载（MB/s）',group:'charts'},
 {key:'chartPeak',label:'最高峰值（MB/s）',group:'charts'},
 {key:'chartTls',label:'平均 TLS RTT（ms）',group:'charts'},
 {key:'chartHttps',label:'平均 HTTPS Ping（ms）',group:'charts'},
 {key:'chartYoutube',label:'YouTube 绿色节点',group:'charts'},
 {key:'chartNetflix',label:'Netflix 绿色节点',group:'charts'},
 {key:'chartDisney',label:'Disney+ 绿色节点',group:'charts'},
 {key:'chartTiktok',label:'TikTok 绿色节点',group:'charts'},
 {key:'chartOpenai',label:'OpenAI 绿色节点',group:'charts'}
] as const;
export interface ComparisonBrand {slug:string;name:string;kind:string;hasCharts:boolean;values:Record<string,string>}
export function comparisonMode(value:string|null):CompareMode{return value==='charts'||value==='all'?value:'plans';}
export function selectedBrandSlugs(value:string|null,brands:Pick<ComparisonBrand,'slug'>[]):string[]{return [...new Set((value||'').split(',').filter(slug=>brands.some(b=>b.slug===slug)))].slice(0,4);}
