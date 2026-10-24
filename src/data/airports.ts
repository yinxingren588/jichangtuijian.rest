import brandCatalogue from './brand-catalogue.json';
export interface Plan {name:string;price:number;currency:string;period:'month'|'year'|'one-time'|'free';priceKind?:'total'|'monthly-equivalent';trafficPeriod?:'month'|'year'|'one-time'|'unknown';note?:string;trafficGB?:number;unlimited?:boolean;multiplier?:number;verified:boolean;source:string}
export interface Airport {id:string;name:string;slug:string;kind:'airport'|'vpn';sourceType?:'reference';referenceChecked?:string;coupon?:{code:string;status:'user-provided';discount:string;conditions:string};identityVerified?:boolean;stabilityEvidence?:{cohort:string;days:number;requests:number;failures:number;rawSource:string};description:string;officialUrl?:string;affiliateUrl?:string;startingPrice?:number;currency?:string;plans:Plan[];protocols:string[];regions:string[];deviceLimit?:string;aiSupport?:string[];streamingSupport?:string[];advantages:string[];disadvantages:string[];suitableFor:string[];sources:string[];lastVerified?:string;testStatus:'tested'|'official-data'|'unverified'}
// The live catalogue contains only the 28 brands provided by the site owner.
export const airports:Airport[]=brandCatalogue as Airport[];
export function costPerGB(p:Plan):number|null {return p.verified && p.multiplier && p.multiplier>0 && p.trafficGB && p.trafficGB>0 && !p.unlimited && p.period==='month' && p.priceKind!=='monthly-equivalent' ? p.price/(p.trafficGB/p.multiplier) : null;}
export const airportCandidates=airports.filter(a=>a.kind==='airport'&&a.identityVerified&&a.testStatus!=='unverified');
export const partnerAirports=airports.filter(a=>a.kind==='airport'&&a.sourceType==='reference');
export const sourceLabel=(a:Airport)=>a.sourceType==='reference'?'第三方参考资料':a.testStatus==='tested'?'有实测记录':a.testStatus==='official-data'?'官方资料':'尚未核实';
export const planPriceText=(p:Plan)=>p.priceKind==='monthly-equivalent'?`${p.currency} ${p.price}/月均（年付折算，总额待确认）`:`${p.currency} ${p.price} / ${p.period==='month'?'月付':p.period==='free'?'免费方案':p.period==='year'?'年付':'不限时一次性'}`;
export const planTrafficText=(p:Plan)=>p.unlimited?'官方不限流量':p.trafficGB?`${p.trafficGB} GB${p.trafficPeriod==='month'?'/月（来源标示）':p.trafficPeriod==='one-time'?'（一次性总额度）':p.trafficPeriod==='year'?'/年':'（重置周期尚未核实）'}`:'尚未核实';
export const priceText=(a:Airport)=>a.plans.length?a.plans.map(planPriceText).join('；'):'尚未核实';
export const trafficText=(a:Airport)=>a.plans.length?a.plans.map(p=>`${p.name}：${planTrafficText(p)}`).join('；'):'尚未核实';
