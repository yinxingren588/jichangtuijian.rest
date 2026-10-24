import {type Airport,type Plan} from '../data/airports';
import {planComparison} from './brand-content';

// Keep compact metadata and editorial answers on the same plan records as the tables.
export function compactQuota(p:Plan):string {
 if(p.unlimited)return '官方不限流量';
 if(p.trafficGB===undefined)return '流量额度尚未核实';
 return `${p.trafficGB} GB${p.trafficPeriod==='month'?'/月':p.trafficPeriod==='year'?'/年':p.trafficPeriod==='one-time'?'一次性总额度':'（重置周期尚未核实）'}`;
}
export function compactPlan(p:Plan):string {
 const amount=p.currency==='CNY'?`${p.price}元`:p.currency==='EUR'?`${p.price}欧元`:p.currency==='USD'?`${p.price}美元`:`${p.currency} ${p.price}`;
 const price=p.priceKind==='monthly-equivalent'?`年付折算${amount}/月均`:p.period==='free'?`${amount}免费档`:p.period==='month'?`${amount}/月`:p.period==='year'?`${amount}/年`:`${amount}不限时`;
 return `${price}、${compactQuota(p)}`;
}
export function renderBrandFacts(template:string,brand:Airport):string {
 const tokens:Record<string,string>={
  plans:brand.plans.length?brand.plans.map(compactPlan).join('；'):'套餐价格、流量额度尚未录入',
  coupon:brand.coupon?(brand.coupon.validity==='permanent'?`优惠码${brand.coupon.code}对应优惠价永久有效；折扣与适用范围按方案确认。`:`优惠码${brand.coupon.code}的折扣、适用范围与有效期须核对。`):'未记录可用优惠码，折扣条件待核对。',
  couponCode:brand.coupon?.code||'',
  devices:brand.deviceLimit||'设备限制尚未核实',
  protocols:brand.protocols.join('、')||'协议尚未核实',
  billing:brand.plans.some(p=>p.priceKind==='monthly-equivalent')?'完整年费总额待确认，月均不能当月付。':'',
  comparison:planComparison(brand),
 };
 return template.replace(/\{\{([^{}]+)\}\}/g,(_,key:string)=>{
  if(Object.hasOwn(tokens,key))return tokens[key];
  const match=/^(plan|quota):(\d+)$/.exec(key);
  if(match){const p=brand.plans[Number(match[2])];return p?(match[1]==='plan'?compactPlan(p):compactQuota(p)):'该档方案尚未录入';}
  throw new Error(`Unknown brand fact token ${key} for ${brand.slug}`);
 });
}
