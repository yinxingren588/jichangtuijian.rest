import {priceText,trafficText,costPerGB,sourceLabel,type Airport} from '../data/airports';
import {evidenceFor} from '../data/evidence';
import {couponNotes} from '../data/coupon-notes';
import type {ComparisonBrand} from './comparison-fields';
export function comparisonBrand(a:Airport):ComparisonBrand{
 const r=evidenceFor(a.slug);const unknown='未提供图表';const coupon=couponNotes[a.slug];
 const green=(index:number)=>r?r.greenCounts[index]+' / '+r.nodeCount+'（绿色节点数）':unknown;
 return {slug:a.slug,name:a.name,kind:a.kind,hasCharts:!!r,values:{
  kind:a.kind==='vpn'?'商业 VPN':'订阅机场',price:priceText(a),traffic:trafficText(a),
  coupon:a.coupon?a.coupon.code+' · '+(coupon?.short||'条件待核实')+'（未验证结算）':'未提供',
  cost:a.plans.map(p=>{const n=costPerGB(p);return n===null?'不适用 / 未核实倍率或周期':p.currency+' '+n.toFixed(3)+'/GB';}).join('；')||'尚未核实',
  regions:a.regions.join('、')||'尚未核实',protocols:a.protocols.join('、')||'尚未核实',devices:a.deviceLimit||'尚未核实',
  ai:a.aiSupport?.join('、')||'尚未核实',streaming:a.streamingSupport?.join('、')||'尚未核实',
  advantages:a.advantages.join('；')||'尚未独立实测',limitations:a.disadvantages.join('；'),source:sourceLabel(a)+' / '+(a.referenceChecked||a.lastVerified||'尚未核实'),
  chartStatus:r?'维护者提供 · 未独立复测':unknown,chartTime:r?r.time+'（时区未注明）':unknown,chartNodes:r?r.nodeCount+' 个节点 · 港 / 日 / 新 / 美 / 台':unknown,
  chartAverage:r?r.averageDownloadMBps.toFixed(2)+' MB/s':unknown,chartPeak:r?r.peakDownloadMBps.toFixed(2)+' MB/s':unknown,
  chartTls:r?r.averageTlsMs.toFixed(1)+' ms':unknown,chartHttps:r?r.averageHttpsMs.toFixed(1)+' ms':unknown,
  chartYoutube:green(0),chartNetflix:green(1),chartDisney:green(2),chartTiktok:green(4),chartOpenai:green(8)
 }};
}
