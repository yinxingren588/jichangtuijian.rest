export const decisionStudies=[
 {slug:'yinxingren-quota',brandSlug:'yinxingren',title:'隐形人流量够不够用？两档月付的容量判断案例',description:'用明确标为假设的计费流量预算，对照隐形人参考套餐{{plans}}，加入余量后判断哪档账面容量够用，并核对节点和优惠条件。',lead:'把任务预算写清楚，才知道增加容量有没有意义。',question:'隐形人的入门档能覆盖我的月份吗？',related:['/blog/plan-cost/','/guides/calculate-quota-multiplier/']},
 {slug:'feiv-billing',brandSlug:'feiv',title:'飞V月付和不限时怎么选？按使用月份与总量比较',description:'分别计算飞V月付参考支出与一次性流量包容量，比较常态使用和低频备用，不将总量包当月度重置，也不预设可叠加购买。',lead:'先选适合的流量模型，再比较参考支出。',question:'每个月都会用，与偶尔备用，应该怎样分开算？',related:['/blog/one-time-versus-reset/','/blog/traffic-expiry/']},
 {slug:'breezenet-tasks',brandSlug:'breezenet',title:'微风网络流量够看视频吗？视频与文件预算演算',description:'从假设的视频平均码率、时长和文件量估算GB，再对照微风参考档位{{plans}}；倍率和播放质量分别说明，不冒充真实用户账单。',lead:'把观看时长、平均速率和文件消耗放到同一份预算。',question:'视频之外还有文件更新，应该保留多少流量？',related:['/blog/video-bitrate-budget/','/blog/mixed-multiplier/']},
] as const;
export const studyForBrand=(slug:string)=>decisionStudies.find(study=>study.brandSlug===slug);
