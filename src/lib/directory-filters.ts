export type PaymentPeriod='all'|'month'|'year'|'one-time';
export interface DirectoryPlan {name:string;price:number;currency:string;period:string;priceKind?:string;trafficGB?:number;unlimited?:boolean;priceText:string;trafficText:string}
export interface DirectoryBrand {slug:string;name:string;searchText:string;hasCoupon:boolean;plans:DirectoryPlan[]}
export interface DirectoryFilters {query:string;period:PaymentPeriod;maxPrice:number|null;minTraffic:number|null;couponOnly:boolean}
export const emptyDirectoryFilters:DirectoryFilters={query:'',period:'all',maxPrice:null,minTraffic:null,couponOnly:false};
export function filterNumber(value:string|null):number|null{
 if(!value?.trim())return null;const n=Number(value);return Number.isFinite(n)&&n>=0&&n<=1_000_000?n:null;
}
export function filtersFromParams(params:URLSearchParams):DirectoryFilters{
 const period=params.get('period');return {query:(params.get('q')||'').slice(0,100),period:period==='month'||period==='year'||period==='one-time'?period:'all',maxPrice:filterNumber(params.get('max')),minTraffic:filterNumber(params.get('traffic')),couponOnly:params.get('coupon')==='1'};
}
export function matchingDirectoryPlan(brand:DirectoryBrand,filters:DirectoryFilters):DirectoryPlan|undefined{
 if(filters.couponOnly&&!brand.hasCoupon||!brand.searchText.includes(filters.query.trim().toLowerCase()))return;
 // All constraints apply to ONE plan, never a cheap plan's price plus a larger plan's quota.
 return brand.plans.find(plan=>(filters.period==='all'||plan.period===filters.period)
  &&(filters.maxPrice===null||(plan.currency==='CNY'&&plan.priceKind!=='monthly-equivalent'&&plan.price<=filters.maxPrice))
  &&(filters.minTraffic===null||plan.unlimited===true||(plan.trafficGB!==undefined&&plan.trafficGB>=filters.minTraffic)));
}
