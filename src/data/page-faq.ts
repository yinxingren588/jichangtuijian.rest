import type {FaqItem} from '../lib/faq';
import {brandComparisons,renderComparisonText} from './brand-comparisons';
export const faqUpdated='2026-10-27';
export const generalFaq:FaqItem[]=[
 {id:'billing-period',category:'选择与预算',question:'月付、年付月均和不限时流量包，应该先比较什么？',answer:'先看本次完整付款金额和流量发放方式。月付按单月付款判断；年付月均只是折算展示，不能当作可单月支付的报价；一次性包是累计总量，不按月重新发放。付款模型相同后，再比较满足自己计费用量的具体档位。',links:[{title:'读懂付款周期与成本',url:'/blog/plan-cost/'},{title:'按需求比较品牌',url:'/comparisons/'}]},
 {id:'quota-budget',category:'选择与预算',question:'怎样判断自己每月需要多少GB，而不是只看大流量套餐？',answer:'先列出视频、会议、文件和共享设备的任务量，再核对计费倍率与上传扣量，并单独预留余量。计算器使用明确假设估算，不预测真实扣量；如果倍率未知，先保留未知。选套餐时，必须同一档同时满足预算和额度，不能把入门价配上进阶档流量。',links:[{title:'估算自己的月度流量',url:'/tools/traffic-calculator/'},{title:'查看明确假设的选择案例',url:'/decisions/'}]},
 {id:'lowest-price',category:'选择与预算',question:'为什么最低展示价和专题第一名，不能直接替我决定购买？',answer:'展示价可能对应不同付款周期和权益，专题也有各自公开的编辑排序规则。先筛选付款、额度与所需节点，再读具体品牌及原图。指定展示位置不代表实测第一，单次速度或平台状态也不能替代长期记录与实际结算。',links:[{title:'查看专题排序方法',url:'/editorial-policy/'},{title:'查看28家品牌资料',url:'/airport/'}]},
 {id:'permanent-coupon',category:'优惠与付款',question:'优惠价永久有效，是否等于每个套餐都按同一折扣购买？',answer:'站长已确认录入代码对应优惠价永久有效；这项确认不自动包含每个套餐的折扣、首购或续费适用、叠加规则。使用时保留代码大小写，选定具体套餐后核对账单里的减免、实付及续费。没有结算记录的金额继续保持未知。',links:[{title:'付款前核对优惠条件',url:'/guides/check-coupon-without-payment/'},{title:'进入品牌页查看各自优惠',url:'/airport/'}]},
 {id:'checkout-proof',category:'优惠与付款',question:'品牌参考价格是否已经等于站长核验过的实际实付？',answer:'目前套餐价格和额度来自已记录的参考资料，28个品牌结算凭据仍待补充；不能把参考标价写成已付款或已核验实付。结算记录应对应日期、套餐、币种、完整周期、优惠前后金额及脱敏凭据，续费条件另列。',links:[{title:'怎样核对结算金额',url:'/blog/checkout-amount/'},{title:'隐形人结算凭据状态示例',url:'/airport/yinxingren/#checkout-proof'}]},
 {id:'refund-renewal',category:'优惠与付款',question:'订阅可以退款、自动续费或多人共享吗？',answer:'这些条件需要逐品牌、逐套餐核对，本站没有将未知规则写成统一承诺。下单前分别记录退款适用条件、是否自动扣费、续费金额、设备与账号共享限制；容量较大不代表允许多人共用，优惠永久确认也不能代替这些条款。',links:[{title:'购买前检查清单',url:'/blog/buying-checklist/'},{title:'付款后核对权益',url:'/blog/post-purchase-validation/'}]},
 {id:'measurement-author',category:'测速与节点',question:'网站里的测速图是谁做的，测试环境一致吗？',answer:'现有29组图表由站长本人测试，站长已确认数据真实，并于2026-10-27确认使用同一环境。各图保留自己的原测试日期；具体运营商、宽带、设备及客户端等参数仍待补充。重新建档不增加测试次数，目前每组仍只有一次既有图表记录。',links:[{title:'核对环境与记录档案',url:'/evidence/records/'},{title:'查看高清原图',url:'/evidence/'}]},
 {id:'speed-units',category:'测速与节点',question:'图中的MB/s、延迟和绿色节点数，各能说明什么？',answer:'MB/s是图示下载单位，与Mbps不同；平均下载按图示节点等权汇总，峰值不代表持续速度。TLS和HTTPS耗时分别记录，平台绿色计数表示当时的节点状态，不是逐请求成功率；Steam一项是货币区显示。应回到自己所需地区和节点逐项阅读。',links:[{title:'图表指标怎样读',url:'/evidence/#reading-the-charts'},{title:'同条件节点对照教程',url:'/guides/run-controlled-node-test/'}]},
 {id:'plan-node-access',category:'测速与节点',question:'品牌原图出现的节点，是否购买任何一档都能使用？',answer:'目前原图未逐一证明所有付费档位开放相同节点、倍率、限速和设备权益。先在图中找到目标地区，再核对准备购买的具体档位可见列表。套餐名称、较大额度或品牌整体平均数，不能代替这项权限核对。',links:[{title:'订阅里缺少节点怎样理解',url:'/blog/node-subscription-range/'},{title:'品牌套餐与节点资料',url:'/airport/'}]},
 {id:'connection-path',category:'使用与支持',question:'订阅更新成功或显示已连接，为什么仍需要验证网页与应用？',answer:'取到配置、完成解析、建立节点连接和完成目标任务是不同步骤。先确认失败在哪一环，再保持网络、设备与目标不变进行有限对照。客户端状态标签不能证明所有应用都走同一路径；网页可达也不代表平台账号与功能资格满足。',links:[{title:'按症状进入故障排查',url:'/troubleshooting/'},{title:'更新成功与可连接的区别',url:'/blog/subscription-update-state/'}]},
 {id:'support-privacy',category:'使用与支持',question:'反馈故障需要提供什么，哪些信息应该隐藏？',answer:'记录时间与时区、设备和客户端版本、网络类型、失败任务、脱敏错误码及一次只改一个条件的结果。移除完整订阅、二维码、账号令牌、订单和支付凭据；普通排查不需要公开这些内容。故障中心提供六类提纲，站长联络入口用于沟通站内资料和页面问题。',links:[{title:'查看故障反馈提纲',url:'/troubleshooting/'},{title:'联络站长',url:'/contact/'}]},
 {id:'comparison-next-step',category:'使用与支持',question:'读完品牌对照后，怎样继续核对，而不是只看结论？',answer:'将候选带入自由比较，检查同档价格、额度和原图日期，再返回品牌页核对节点权限与结算凭据。五篇对照都提供明确情景与下一篇入口；若已经出现连接问题，先沿故障路径定位范围，不把更换品牌当作唯一排查方法。',links:[{title:'五组深度对照',url:'/comparisons/'},{title:'自由组合品牌比较',url:'/compare/'}]},
];
const comparisonFaqTemplates:Record<string,FaqItem[]>={
 'yinxingren-vs-muguang':[
 {question:'隐形人与暮光的专线名称不同，可以直接据此选出更快的一家吗？',answer:'不可以。套餐名与图中线路标注不构成完整路径说明，当前资料也没有逐档证明开放相同节点。先对照自己的付款和计费容量，再核对准备购买档位的具体节点；随后以相同任务验证，而不是按名称给速度结论。'},
 {question:'这两家都能覆盖用量时，还应该比较什么？',answer:'继续比较实际付款周期、目标节点权限、设备与计费倍率，以及真实结算和退款条款。隐形人有站长提供的优惠码，暮光未记录优惠码；缺失不等于没有活动，也不能用猜测折扣改变情景里的候选结果。'},
 {question:'两家的图表是同一环境，为什么仍保留各自日期？',answer:'统一环境是站长确认的共同条件，各图仍来自不同测试时点及各自节点样本。平均数只描述图示集合，不形成同一时点的竞速名次；选择时先看目标地区和具体节点，再确认所购档位权限。'}],
 'breezenet-vs-feiv':[
 {question:'微风月付与飞V不限时，可以按相同的每月GB比较吗？',answer:'不能把一次性总量当作每月重置。微风记录为{{left:plans}}；飞V记录为{{right:plans}}。持续使用用月度预算，备用则用完整期间累计消耗；付款和额度模型相同后才进行对应比较。'},
 {question:'飞V一份总量包不够时，为什么对照里没有计算多份叠加价格？',answer:'当前资料未确认叠加购买、续购价格和有效条件，不能把数学上需要几份当作商家允许的购买方式。对照只判断一份记录额度是否覆盖假设累计消耗，不够时回到当前套餐和结算说明核对。'},
 {question:'只偶尔备用，是否就应该选飞V而不看微风？',answer:'备用频率只是一个因素，还要估算文件更新、视频、后台同步的累计计费消耗，以及总量包有效条件和节点可用性。先明确预计使用安排，再分别核对月付和一次性候选；本篇没有把低频直接写成某品牌的购买推荐。'}],
 'feimaoyun-vs-dalaocloud':[
 {question:'飞猫云年付月均比大佬云月付低，为什么不能直接说飞猫更便宜？',answer:'年付折算不是本次单月可支付的金额，飞猫首档还保留来源周期冲突和完整年费待确认。比较首次现金支出时只纳入明确月付；要比较完整一年，则需先取得两边相同服务期限下的真实账单及续费条件。'},
 {question:'飞猫与大佬的月付情景，是否已经计算了优惠价？',answer:'没有。情景使用现有来源标价，筛选同一档是否同时满足价格和容量。飞猫优惠码对应优惠价永久有效由站长确认，但具体折扣和适用档位仍待结算凭据；大佬未记录站长优惠码，不推断其没有活动。'},
 {question:'大佬较大档额度更多，是否就证明速度或多人权限更高？',answer:'额度只描述来源标示的计费容量，不能推导同时连接、共享账号、速度或平台权限。应先确认自己的月度消耗，再逐项核对节点与设备条件；两品牌现有图表也没有覆盖整个年付或月付周期。'}],
 'laddercloud-vs-lingdongcloud':[
 {question:'梯子云的中转、专线与灵动云的均衡、畅享，能按名称直接对齐等级吗？',answer:'这些首先是来源里的套餐名称，不是同一套可比较的技术等级。先对齐月付金额、月额度和准备使用的具体节点，再核对入口、出口、倍率与权限；缺少字段时保留未知，不按名称补造线路结构。'},
 {question:'入门档刚好够用，还需要为了更多节点升级吗？',answer:'先核对目标节点是否已在当前档开放，以及升级实际增加的权益。节点数量本身不能替代所需地区、协议和任务验证；若只是额度接近边界，应先确认计费预算及余量，再比较升级的实际支出。'},
 {question:'梯子云或灵动云订阅里缺少图中节点，应该先做什么？',answer:'先确认账户具体档位、订阅最近更新时间和配置格式，再对照套餐可见列表。原图中出现某节点不证明每档都有权限；如果更新失败，沿故障中心的下载、解析与连接步骤检查，不先删除仍可用的配置。'}],
 'firefly-vs-lingmao':[
 {question:'Firefly低月均与灵猫月付，应该怎样建立同口径候选？',answer:'Firefly折算档完整总额待确认，不能按月均直接进入单月现金预算。先使用两边明确月付档做同档价格与容量筛选，再核对折算档的完整预付责任；不把低展示价和大档额度拼在一起。'},
 {question:'灵猫IPLC名称或Firefly平台绿色状态，能保证我的AI功能可用吗？',answer:'不能。线路名称不代替节点权限与路径说明，绿色状态只对应图示时间、节点和检测目标。页面可达、登录、对话或播放、付款及账号资格各自验证；Steam货币区一栏也不作为解锁率。'},
 {question:'只有某个平台失败，是不是需要马上更换这两家品牌？',answer:'先区分普通网络是否正常，以及平台失败发生在页面、登录还是具体功能，记录时间和提示。核对平台当前服务与账号条件后，只做有限节点对照；故障中心提供对应路径，不能凭一次失败判断整个品牌不可用。'}],
};
export function comparisonFaq(slug:string):FaqItem[] {const item=brandComparisons.find(p=>p.slug===slug);const questions=comparisonFaqTemplates[slug];if(!item||!questions)throw Error('Missing comparison FAQ '+slug);return questions.map((q,i)=>({...q,id:'comparison-faq-'+(i+1),answer:renderComparisonText(q.answer,item),links:[{title:'返回本文情景与筛选条件',url:'#scenarios'},{title:'查看完整常见问题',url:'/faq/'}]}));}
export const troubleshootingFaq:FaqItem[]=[
 {id:'help-faq-update',question:'更新失败时，是否应该先删除旧配置再重新导入？',answer:'先保留旧配置及原错误，确认失败在下载、解析还是节点连接环节。账户状态、订阅来源和格式分别核对后再有限重试；删除仍可用配置可能使对照信息丢失。旧凭据若已被撤销，则按可信入口更新，不继续沿用。',links:[{title:'订阅更新五步路径',url:'#subscription-update'}]},
 {id:'help-faq-scope',question:'已连接但只有一个应用失败，为什么先查应用路径？',answer:'不同应用不一定使用相同的代理或隧道路径。先固定网络、节点与任务，观察失败范围及应用设置，再记录解析、连接或证书提示；不要将一个应用失败直接解释成所有节点故障。',links:[{title:'已连接但打不开的路径',url:'#connected-no-web'}]},
 {id:'help-faq-video',question:'视频卡顿时一直测速，是否能更快找出问题？',answer:'反复测速既会消耗流量，也不一定与视频使用相同目标和持续方式。先固定视频、画质和时段，检查本地竞争任务，再只更换一个节点作有限对照；记录卡顿发生的具体环节，比单独保留测速峰值更有解释力。',links:[{title:'测速快但视频卡的路径',url:'#slow-video'}]},
 {id:'help-faq-platform',question:'平台首页能打开，但对话或播放失败，应该记为成功还是失败？',answer:'分别记录页面、登录和原目标功能。只有完成原先要做的任务，才算该次功能验证成功；若只恢复首页访问，应保留仍失败的部分，并核对平台服务、地区与账号条件。',links:[{title:'单个平台失败的路径',url:'#platform-only'}]},
 {id:'help-faq-usage',question:'客户端用量与账户余额不同，能直接认定多扣流量吗？',answer:'先对齐采集时间、单位、统计周期和账号覆盖范围，再核对重置、到期、倍率、上传及共享设备规则。没有对齐这些条件的两个读数不能直接相减得出多扣结论；无法解释时保留原读数和未知项供支持人员核对。',links:[{title:'用量与余额核对路径',url:'#usage-mismatch'}]},
 {id:'help-faq-handover',question:'换网络后旧任务中断，但新网页正常，该从哪里继续检查？',answer:'基础网络、新连接与原来的长会话分别验证。记录切换时间和客户端重连状态，再按应用方式恢复原任务；不要反复提交可能重复执行的付款或表单。新请求成功只说明这一请求可用，不自动证明原任务已经恢复。',links:[{title:'网络切换与唤醒路径',url:'#after-network-switch'}]},
];
