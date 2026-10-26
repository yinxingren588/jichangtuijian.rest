import type {Airport,Plan} from '../data/airports';

export interface BrandFactSnapshot {plans:Plan[];coupon:Airport['coupon']|null;sources:string[];referenceChecked:string|null}
export interface BrandHistoryEvent {id:string;date:string;kind:'baseline'|'catalogue-change'|'coupon-confirmation';title:string;note:string;snapshot?:BrandFactSnapshot;changedGroups?:string[]}
export type BrandHistory=Record<string,BrandHistoryEvent[]>;
export function factSnapshot(brand:Airport):BrandFactSnapshot {
 return structuredClone({plans:brand.plans,coupon:brand.coupon??null,sources:brand.sources,referenceChecked:brand.referenceChecked??brand.lastVerified??null});
}
function canonical(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
 return JSON.stringify(value);
}
export function changedFactGroups(before:BrandFactSnapshot,after:BrandFactSnapshot):string[] {
 const groups:[keyof BrandFactSnapshot,string][]=[['plans','套餐资料'],['coupon','优惠资料'],['sources','引用页面'],['referenceChecked','来源读取日期']];
 return groups.filter(([key])=>canonical(before[key])!==canonical(after[key])).map(([,label])=>label);
}
export function latestFactEvent(events:BrandHistoryEvent[]):BrandHistoryEvent|undefined {
 return events.filter(event=>event.snapshot).sort((a,b)=>b.date.localeCompare(a.date))[0];
}
export function assertHistoryCurrent(brand:Airport,events:BrandHistoryEvent[]):void {
 const last=latestFactEvent(events);
 if(!last?.snapshot)throw Error('Missing fact baseline: '+brand.slug);
 const changed=changedFactGroups(last.snapshot,factSnapshot(brand));
 if(changed.length)throw Error(`${brand.slug}: ${changed.join('、')}已修改，请先使用 brand:record 保存变更记录再构建。`);
}
export function appendFactRecord(history:BrandHistory,brand:Airport,date:string,note:string):BrandHistory {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('请输入有效的 YYYY-MM-DD 资料记录日期');
 if(!note.trim())throw Error('变更说明不能为空');
 const events=history[brand.slug];
 const last=latestFactEvent(events??[]);
 if(!last?.snapshot)throw Error('Missing fact baseline: '+brand.slug);
 if(date<events.reduce((max,event)=>event.date>max?event.date:max,''))throw Error('不能将新记录写在已有记录日期之前');
 const snapshot=factSnapshot(brand);
 const changedGroups=changedFactGroups(last.snapshot,snapshot);
 if(!changedGroups.length)throw Error('资料未变化，不生成虚构的调价或核验记录');
 const event:BrandHistoryEvent={id:`facts-${date}-${events.length+1}`,date,kind:'catalogue-change',title:'资料变更：'+changedGroups.join('、'),note:note.trim(),changedGroups,snapshot};
 return {...structuredClone(history),[brand.slug]:[event,...structuredClone(events)]};
}
