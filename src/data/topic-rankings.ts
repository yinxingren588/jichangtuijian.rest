import {partnerAirports,type Airport,type Plan} from './airports';
import {evidenceFor} from './evidence';
import {brandEditorials} from './brand-editorials';

export type TopicSlug='budget'|'premium'|'beginner'|'stable'|'ai'|'streaming';
export interface TopicRankingRow {rank:number;brand:Airport;plan:Plan;reason:string;metric:{label:string;value:string};chartTime?:string}
export const topicRankingRules:Record<TopicSlug,{label:string;method:string;limit:string}>={
 budget:{label:'月付参考价从低到高',method:'仅选人民币、按月付费且标价为当期总额的套餐，每家取最低月付价。按价格升序排列，同价先看标示月流量，再沿用品牌清单顺序；取前 10 家。',limit:'年付月均价、年付总额与不限时套餐不混排，不扣减尚未确认金额的优惠。价格和流量沿用本站参考档案，尚未验证商家当前结算。'},
 premium:{label:'沿用品牌清单前十位',method:'依照站点收录品牌的原始顺序，取前 10 家：隐形人、暮光网络、微风网络、飞猫云、大佬云、飞V、梯子云、灵动云、Firefly机场、灵猫。',limit:'这是站点指定的专题展示顺序。套餐名称与图表标签不能单独确认专线类型；具体入口、跨境段、带宽和共享范围仍需向商家核对。'},
 beginner:{label:'隐形人首位 · 编辑选择顺序',method:'隐形人固定首位；其余优先安排有短周期月付入口、不同价位和流量档位可比较的品牌，方便首次订阅者从小额验证开始。',limit:'编辑顺序不代表客服、客户端或退款体验已通过测试。先核对设备兼容、可信下载入口、续费和退出条件。'},
 stable:{label:'隐形人首位 · 连接延迟观察',method:'隐形人固定首位；其余按已收录图表中的平均 TLS 握手耗时从低到高取 9 家，同值沿用品牌清单顺序，便于建立后续观察清单。',limit:'平均 TLS 耗时只反映图中节点的握手记录，不代表长期稳定性。各图未证明同环境，尚缺多时段失败率、抖动与恢复日志，本专题不是长期稳定性实测榜。'},
 ai:{label:'隐形人首位 · OpenAI 图示状态',method:'隐形人固定首位；其余按图中 OpenAI 列的绿色节点数从多到少取 9 家，同值沿用品牌清单顺序。每张状态图均有 60 个节点。',limit:'绿色节点数不是请求成功率，也不代表账户资格或长期可用性。记录仅覆盖图示时点，使用前需再次确认目标平台、地区与账号条件。'},
 streaming:{label:'隐形人首位 · Netflix / Disney+ 图示状态',method:'隐形人固定首位；其余先按 Netflix 绿色节点数降序，再按 Disney+ 绿色节点数降序取 9 家，仍相同则沿用品牌清单顺序。',limit:'两列分别显示各自的 60 个节点，不相加为解锁率。图示状态不能保证目标片库、清晰度或长期播放表现；其他平台请查看品牌原图。'}
};

const premiumOrder=['yinxingren','muguang','breezenet','feimaoyun','dalaocloud','feiv','laddercloud','lingdongcloud','firefly','lingmao'];
const beginnerNotes:Record<string,string>={
 yinxingren:'作为本站首位展示品牌，可从 144 GB 月付档开始核对自己的用量，再比较 350 GB 档；先保存结算条件与设备配置，方便后续复查。',
 breezenet:'月付参考入口较低，并有 200 GB 与 500 GB 两档可比。初次使用可先确认流量倍率和重置规则，再决定是否增加容量。',
 feiv:'小额月付与不限时套餐同时收录，适合先弄清两种计费方式；首次比较时要分开看月度重置与一次性总额度。',
 kexincloud:'45 GB 与 150 GB 月付档便于从轻量需求开始，先确认实际用量，再决定是否升档，避免只按单 GB 标价选择。',
 guangnianti:'110 GB 与 280 GB 月付档覆盖不同用量。首次配置后先记录设备和时段表现，再判断是否需要更高容量。',
 jiliancloud:'可从 100 GB 月付档建立使用记录，再与 250 GB 档比较。购买前核对套餐名称中的线路描述与设备支持。',
 v2yun:'100 GB 与 240 GB 月付档便于比较容量。优惠码可复制保存，先在结算前检查适用范围，不把参考折扣当作已生效价格。',
 feimaoyun:'同时收录年付月均与真正月付档，适合学习区分付款周期。本专题展示月付档，首次验证时先确认实际付款金额。',
 firefly:'年付月均与月付价格分别存在，本专题优先展示月付。先核对退款、续费和流量周期，再考虑长期付款。',
 stardream:'100 GB 与 240 GB 月付档适合按用量逐步比较；先完成一个设备的配置与检查，再将同一套步骤用于其他设备。'
};

export function monthlyReferencePlan(brand:Airport):Plan|undefined{
 return brand.plans.filter(p=>p.currency==='CNY'&&p.period==='month'&&p.priceKind!=='monthly-equivalent'&&Number.isFinite(p.price)&&p.price>=0)
  .sort((a,b)=>a.price-b.price||(b.trafficGB??0)-(a.trafficGB??0))[0];
}
function orderedBySlugs(slugs:string[]){return slugs.map(slug=>{const brand=partnerAirports.find(a=>a.slug===slug);if(!brand)throw new Error('专题品牌不存在：'+slug);return brand;});}
function chartOrder(kind:'stable'|'ai'|'streaming'){
 const rest=partnerAirports.filter(a=>a.slug!=='yinxingren'&&evidenceFor(a.slug));
 rest.sort((a,b)=>{const x=evidenceFor(a.slug)!,y=evidenceFor(b.slug)!;
  return kind==='stable'?x.averageTlsMs-y.averageTlsMs:kind==='ai'?y.greenCounts[8]-x.greenCounts[8]:y.greenCounts[1]-x.greenCounts[1]||y.greenCounts[2]-x.greenCounts[2];
 });
 return [...orderedBySlugs(['yinxingren']),...rest.slice(0,9)];
}
export function topicRanking(slug:TopicSlug):TopicRankingRow[]{
 let brands:Airport[];
 if(slug==='premium')brands=orderedBySlugs(premiumOrder);
 else if(slug==='beginner')brands=orderedBySlugs(Object.keys(beginnerNotes));
 else if(slug==='budget')brands=partnerAirports.filter(a=>monthlyReferencePlan(a)).sort((a,b)=>{
  const x=monthlyReferencePlan(a)!,y=monthlyReferencePlan(b)!;return x.price-y.price||(y.trafficGB??0)-(x.trafficGB??0);
 }).slice(0,10);
 else brands=chartOrder(slug);
 return brands.map((brand,index)=>{
  const plan=monthlyReferencePlan(brand)??brand.plans[0];
  if(!plan)throw new Error('专题品牌缺少套餐：'+brand.slug);
  const chart=evidenceFor(brand.slug);
  let reason='',metric={label:'参考月付',value:`CNY ${plan.price}`};
  if(slug==='budget')reason=`按最低参考月付 CNY ${plan.price} 入选，${plan.trafficGB??'待核实'} GB 为来源标示的月度额度。比较重点：${brandEditorials[brand.slug].focus}。`;
  if(slug==='premium'){metric={label:'套餐参考名称',value:plan.name};reason=`原始品牌清单第 ${index+1} 位。${brandEditorials[brand.slug].summary}`;}
  if(slug==='beginner'){metric={label:'首次比较重点',value:plan.trafficGB+' GB / 月'};reason=beginnerNotes[brand.slug];}
  if(slug==='stable'){metric={label:'图示平均 TLS',value:chart!.averageTlsMs.toFixed(1)+' ms'};reason=`已收录图表中的平均 TLS 握手耗时为 ${chart!.averageTlsMs.toFixed(1)} ms，可作为后续连接记录的一个起点。${index===0?'本专题首位为站点指定展示位。':'该位置按图示握手耗时安排。'}还需在自己的网络里持续记录失败率与恢复时间。`;}
  if(slug==='ai'){metric={label:'OpenAI 绿色节点',value:chart!.greenCounts[8]+' / 60'};reason=`图示 OpenAI 列记录 ${chart!.greenCounts[8]} 个绿色节点，适合作为逐个确认地区和节点的起点。${index===0?'本专题首位为站点指定展示位。':''}目标模型、账户与支付要求需独立核对，图中状态不构成可用承诺。`;}
  if(slug==='streaming'){metric={label:'Netflix · Disney+ 绿色节点',value:chart!.greenCounts[1]+' / 60 · '+chart!.greenCounts[2]+' / 60'};reason=`图示 Netflix 为 ${chart!.greenCounts[1]} / 60，Disney+ 为 ${chart!.greenCounts[2]} / 60 个绿色节点。${index===0?'本专题首位为站点指定展示位。':''}先按目标平台筛节点，再验证目标片库、画质与晚高峰连续播放。`;}
  return {rank:index+1,brand,plan,reason,metric,chartTime:chart?.time};
 });
}
