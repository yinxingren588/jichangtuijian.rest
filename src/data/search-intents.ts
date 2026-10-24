import {coreKeywordTargets} from './core-keywords';
import {airports} from './airports';
import {brandSeo} from './brand-seo';
export interface SearchIntentTarget {keyword:string;url:string;intent:string;priority:'P0'|'P1'|'P2';group:string}
// An editorial map of existing destinations, not measured search volumes or rankings.
export const searchIntentTargets:SearchIntentTarget[]=[
 ...coreKeywordTargets.map(t=>({...t,priority:'P0' as const,group:'原始核心词'})),
 {keyword:'低预算机场推荐',url:'/recommend/budget/',intent:'比较同口径预算、容量与付款模型',priority:'P1',group:'预算需求'},
 {keyword:'月付10元以内机场',url:'/recommend/budget/',intent:'查看人民币月付不超过10元的参考方案',priority:'P1',group:'预算需求'},
 {keyword:'流量需求计算器',url:'/tools/traffic-calculator/',intent:'按任务估算GB、倍率和预留额度',priority:'P1',group:'用量工具'},
 {keyword:'机场流量怎么算',url:'/tools/traffic-calculator/',intent:'由个人任务估算需要的计费容量',priority:'P1',group:'用量工具'},
 {keyword:'不限时流量和月付怎么选',url:'/blog/one-time-versus-reset/',intent:'区别累计总量与按期重置的安排',priority:'P2',group:'计费需求'},
 {keyword:'机场套餐计费倍率',url:'/blog/mixed-multiplier/',intent:'分段汇总各线路用量与扣量',priority:'P2',group:'计费需求'},
 ...airports.flatMap(b=>{
  const base=brandSeo[b.slug].heading.replace(/怎么样？$/,''),url='/airport/'+b.slug+'/';
  const rows:SearchIntentTarget[]=[
   {keyword:base+'怎么样',url,intent:'了解品牌资料、适用场景与证据范围',priority:'P1',group:'品牌选择'},
   {keyword:base+'套餐价格',url,intent:'核对已录入金额、币种与付款周期',priority:'P1',group:'品牌套餐'},
   {keyword:base+'流量额度',url,intent:'核对已录入容量、发放周期与未知条件',priority:'P2',group:'品牌套餐'},
  ];
  if(b.kind==='airport')rows.push({keyword:base+'节点测速',url,intent:'查看维护者图表及测试环境缺失项',priority:'P2',group:'品牌图表'});
  if(b.coupon)rows.push({keyword:base+'优惠码',url,intent:'查看原始代码、优惠参考与待确认条件',priority:'P2',group:'品牌优惠'});
  return rows;
 }),
];
