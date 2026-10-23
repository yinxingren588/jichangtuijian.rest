import {planPriceText,planTrafficText,type Airport,type Plan} from '../data/airports';
const number=(value:number)=>Number(value.toFixed(2)).toString();
export function explainPlan(plan:Plan){
 const price=planPriceText(plan);const traffic=planTrafficText(plan);
 const payment=plan.priceKind==='monthly-equivalent'?`价格记录为 ${price}。这里的数字是年付折算展示，不能理解成每月可支付的金额；完整年付总额没有核实，所以不据此反推商家账单。`:plan.period==='year'?`价格记录为 ${price}，对应一次支付完整年付周期的参考总额。若用于月均资金规划，应另行标明摊分计算，不能改变实际付款频率。`:plan.period==='one-time'?`价格记录为 ${price}，用于一次性购买对应总额度。要同时核对有效期、账户停用和流量耗尽后的处理，不将总量包当作每月续领的配额。`:plan.period==='free'?`价格记录为 ${price}。免费只说明当前方案的费用条件，仍需分别查看账户、设备、地区与功能范围，不能扩展成所有付费权益都已包含。`:`价格记录为 ${price}。每次续期的金额、到期日与是否自动续费，仍需在当前结算条款中确认；本页不把月付价改写成年付优惠。`;
 const quota=plan.unlimited?`流量记录为“${traffic}”，这是所引官方方案的声明；应继续核对其他权益与使用规则。`:plan.trafficPeriod==='month'?`流量记录为 ${traffic}。该字段按来源的月度标示保留，重置日期、上传扣量和线路倍率需要另外核对；没有这些条件时，不直接计算实际可用每GB成本。`:plan.trafficPeriod==='one-time'?`流量记录为 ${traffic}，消耗后不会因本页的月度比较习惯自动恢复。需要确认的重点是总量和有效条件，而不是每月余量。`:`流量记录为 ${traffic}。当前未确认的发放或重置周期保持未知，不默认按月重置，也不将未知额度当作不限流量。`;
 return {name:plan.name,payment,quota};
}
export function planComparison(brand:Airport){
 const [a,b]=brand.plans;
 if(!a)return '目前没有足够的套餐报价，不能用空白价格推断免费或不存在限制。先补齐对应官方方案、币种和额度，再进行费用比较。';
 if(!b)return '本档案仅录入一档已引用方案，不能把其他档位的金额或权益自动补齐。若需要额外设备、地区或功能，应回到对应来源核对实际方案，再决定是否满足自己的任务。';
 if(a.period==='free'||b.period==='free')return '免费与付费方案需要先按设备、地区、功能和账户条件分别核对。即使二者都标为不限流量，也不表示其余权益一致；不能把不限量作为分母，推导出可用于排名的零成本，也不把单月付费与多月促销混用。';
 if(a.priceKind==='monthly-equivalent'||b.priceKind==='monthly-equivalent')return '这两档的付款周期不同：年付折算展示与月付实付不能直接混为一种月价。先补齐完整年付总额、两档权益及重置规则，再讨论承诺时长是否符合自己的使用安排。';
 if(a.period!==b.period)return '这两档采用不同付款或发放模型。月度额度应按重置周期安排，一次性额度应按累计消耗和有效条件安排；不能把一次性总量改写成每月流量后比较，也不能仅凭较小的起价判断更划算。';
 if(a.currency===b.currency&&b.price>=a.price&&a.trafficGB&&b.trafficGB&&a.trafficPeriod===b.trafficPeriod&&b.trafficGB>=a.trafficGB){
  const period=a.period==='year'?'每个年付周期':'每个月付周期';
  const quota=a.trafficPeriod==='month'?'来源标示的每月额度':a.trafficPeriod==='one-time'?'一次性总额度':'来源标示的额度';
  return `按当前来源字段，两档在同一付款口径下，第二档相对第一档${period}多 ${a.currency} ${number(b.price-a.price)}，${quota}多 ${number(b.trafficGB-a.trafficGB)} GB。这里只描述账面差额，不表示实际可用量、速度或单位成本已经核验；是否升级应由自己的任务和完整权益决定。`;
 }
 return '两档应分别保留价格、周期、流量与设备条件。免费与付费、不限量与有限额的字段不能直接压成一个单位成本；先确认必需权益，再决定是否值得继续比较。';
}
