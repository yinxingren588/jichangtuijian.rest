import raw from './measurement-sessions.json';
import environmentRaw from './test-environment.json';
import {evidenceRecords,type EvidenceRecord} from './evidence';

export interface TestEnvironment {id:string;label:string;sameEnvironmentConfirmed:boolean;confirmedBy:string;confirmedAt:string;operator:string|null;bandwidthMbps:number|null;device:string|null;operatingSystem:string|null;client:string|null;clientVersion:string|null;protocol:string|null;timeZone:string|null;note:string}
export interface MeasurementSession {id:string;brandSlug:string|null;chartSlug:string;kind:string;testedAt:string;environmentId:string;testTarget:string|null;sampleScope:string|null;method:string;note:string}
export const testEnvironment=environmentRaw as TestEnvironment;
export const measurementSessions=raw as MeasurementSession[];
export function chartForSession(session:MeasurementSession):EvidenceRecord {
 const record=evidenceRecords.find(item=>item.slug===session.chartSlug);
 if(!record)throw Error('Unknown measurement chart: '+session.chartSlug);
 return record;
}
export const sessionsForBrand=(slug:string)=>measurementSessions.filter(session=>session.brandSlug===slug);
export function seriesReadiness(sessions:MeasurementSession[],environment:TestEnvironment=testEnvironment):{ready:boolean;reason:string} {
 if(sessions.length<2)return {ready:false,reason:'当前仅有一次图表记录，后续真实复测后再观察跨日期变化。'};
 if(new Set(sessions.map(s=>s.testedAt)).size<2)return {ready:false,reason:'同一图表时间不重复计为连续复测，需补充不同时间的真实记录。'};
 if(new Set(sessions.map(s=>s.brandSlug)).size!==1||sessions.some(s=>s.brandSlug===null))return {ready:false,reason:'不同品牌的图表不合并为同品牌连续记录。'};
 if(sessions.some(s=>s.environmentId!==environment.id)||!environment.sameEnvironmentConfirmed)return {ready:false,reason:'测试环境尚未确认一致，应分别阅读。'};
 if(!environment.operator||!environment.bandwidthMbps||!environment.device||!environment.operatingSystem||!environment.client||!environment.clientVersion||!environment.timeZone)return {ready:false,reason:'同一环境已由站长确认；具体环境参数尚待补齐，暂不生成跨日期性能结论。'};
 if(sessions.some(s=>!s.testTarget||!s.sampleScope)||new Set(sessions.map(s=>[s.testTarget,s.sampleScope,s.method].join('|'))).size!==1)return {ready:false,reason:'测试目标、节点样本或方法未确认一致，不能直接作同条件变化判断。'};
 return {ready:true,reason:'环境、目标、样本及方法已记录一致；可描述这些记录的变化，仍不代表长期可用率。'};
}
