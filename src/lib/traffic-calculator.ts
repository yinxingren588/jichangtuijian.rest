export interface TrafficInput {
 days:number;people:number;videoHours:number;videoGBPerHour:number;
 meetingHours:number;meetingMbps:number;otherGBPerDay:number;filesGB:number;
 multiplier:number;reservePercent:number;monthlyBudget:number|null;
}
export const trafficDefaults:TrafficInput={days:30,people:1,videoHours:1,videoGBPerHour:3,meetingHours:.5,meetingMbps:2,otherGBPerDay:.2,filesGB:20,multiplier:1,reservePercent:20,monthlyBudget:null};
export const trafficPresets:Record<string,TrafficInput>={
 light:{...trafficDefaults,videoHours:.25,videoGBPerHour:.7,meetingHours:0,otherGBPerDay:.15,filesGB:10},
 everyday:{...trafficDefaults},
 household:{...trafficDefaults,people:3,filesGB:60},
};
export const trafficFields={
 days:{label:'使用天数',min:1,max:31,integer:true},
 people:{label:'共享额度人数',min:1,max:20,integer:true},
 videoHours:{label:'每人每天看视频',min:0,max:24},
 videoGBPerHour:{label:'视频每小时用量',min:.01,max:100},
 meetingHours:{label:'每人每天会议',min:0,max:24},
 meetingMbps:{label:'会议上下行合计码率',min:0,max:100},
 otherGBPerDay:{label:'每人每天其他用量',min:0,max:100},
 filesGB:{label:'本月全体文件与更新',min:0,max:1_000_000},
 multiplier:{label:'规划用计费倍率',min:.1,max:10},
 reservePercent:{label:'额外预留比例',min:0,max:100},
} as const;
export interface TrafficEstimate {video:number;meeting:number;other:number;files:number;transferred:number;billed:number;reserve:number;recommended:number}
export function estimateTraffic(input:TrafficInput):TrafficEstimate {
 for(const [key,rule] of Object.entries(trafficFields)){
  const value=input[key as keyof typeof trafficFields];
  if(!Number.isFinite(value)||value<rule.min||value>rule.max||('integer' in rule&&!Number.isInteger(value)))throw new RangeError(`${rule.label}需为${rule.min}–${rule.max}${'integer' in rule?'之间的整数':'之间的数值'}。`);
 }
 if(input.monthlyBudget!==null&&(!Number.isFinite(input.monthlyBudget)||input.monthlyBudget<0||input.monthlyBudget>1_000_000))throw new RangeError('月付预算应在0–1000000元之间，或留空。');
 const personDays=input.days*input.people;
 const video=input.videoHours*input.videoGBPerHour*personDays;
 // Decimal GB: Mbps × 1e6 × 3600 ÷ 8 ÷ 1e9 = GB/hour.
 const meeting=input.meetingHours*input.meetingMbps*.45*personDays;
 const other=input.otherGBPerDay*personDays,files=input.filesGB;
 const transferred=video+meeting+other+files,billed=transferred*input.multiplier,reserve=billed*input.reservePercent/100;
 return {video,meeting,other,files,transferred,billed,reserve,recommended:Math.ceil(billed+reserve)};
}
export function directoryUrlForEstimate(estimate:TrafficEstimate,budget:number|null):string|null {
 if(!Number.isSafeInteger(estimate.recommended)||estimate.recommended<=0||estimate.recommended>1_000_000)return null;
 if(budget!==null&&(!Number.isFinite(budget)||budget<0||budget>1_000_000))return null;
 const params=new URLSearchParams({period:'month',traffic:String(estimate.recommended)});
 if(budget!==null)params.set('max',String(budget));
 return '/airport/?'+params.toString()+'#brand-filters';
}
export function trafficSummary(input:TrafficInput,estimate:TrafficEstimate):string {
 const n=(value:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(value);
 return `流量需求估算：${input.days}天，${input.people}人\n传输量约${n(estimate.transferred)} GB；规划倍率${input.multiplier}倍；预留${input.reservePercent}%\n建议准备约${estimate.recommended} GB计费额度${input.monthlyBudget===null?'':`；月付预算上限${input.monthlyBudget}元`}\n按本次输入演算，不代表品牌倍率、结算或实际扣量已核实。`;
}
