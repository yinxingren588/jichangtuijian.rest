import {airports,costPerGB,type Airport,type Plan} from './airports';
export type Ranking='overall'|'value'|'budget'|'stable';
export interface Ranked {brand:Airport;plan?:Plan;metric:number;rank:number;basis:string}
// A verified public URL alone is insufficient to establish an airport's identity.
export function rankBrands(kind:Ranking,data:Airport[]=airports,currency='CNY',cohort=''){ 
 const eligible=data.filter(a=>a.kind==='airport'&&a.identityVerified&&a.testStatus!=='unverified'&&a.sources.length&&a.lastVerified);
 const rows:Omit<Ranked,'rank'>[]=[];
 for(const brand of eligible){
  const plans=brand.plans.filter(p=>p.verified&&p.period==='month'&&p.currency===currency&&p.price>=0);
  if(kind==='value'||kind==='budget'){
   const sorted=plans.filter(p=>kind==='budget'||costPerGB(p)!==null).sort((a,b)=>(kind==='value'?costPerGB(a)!-costPerGB(b)!:a.price-b.price));
   if(sorted.length){const plan=sorted[0];rows.push({brand,plan,metric:kind==='value'?costPerGB(plan)!:plan.price,basis:kind==='value'?`${currency}/GB，按倍率折算`:`${currency}/月，实付金额`});}
  }else if(kind==='overall'){
   // Transparency only: no speed or quality points are inferred from official statements.
   const metric=Number(plans.length>0)+Number(brand.protocols.length>0)+Number(brand.regions.length>0)+Number(Boolean(brand.deviceLimit));
   rows.push({brand,metric,basis:'资料透明度 0–4 项：月付、协议、地区、设备；不评价实测体验'});
  }else{
   const e=brand.stabilityEvidence;
   if(brand.testStatus==='tested'&&e&&e.cohort===cohort&&e.days>=7&&e.requests>=100&&e.failures>=0&&e.failures<=e.requests&&e.rawSource){rows.push({brand,metric:e.failures/e.requests,basis:`同环境 ${e.days} 天 / ${e.requests} 次请求失败率；原始记录 ${e.rawSource}`});}
  }
 }
 rows.sort((a,b)=>kind==='overall'?b.metric-a.metric:a.metric-b.metric);
 return rows.map((row,i)=>({...row,rank:i>0&&row.metric===rows[i-1].metric?rows.findIndex(r=>r.metric===row.metric)+1:i+1}));
}
