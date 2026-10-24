import {airports} from '../data/airports';
import {categoryFor,type Entry} from './content';
const brandPaths:Record<string,{reason:string;slugs:string[]}>= {
 '基础指南':{reason:'把购买清单中的周期、额度与优惠条件放回具体套餐档案核对。',slugs:['breezenet','feiv','yinxingren']},
 '预算与计费':{reason:'分别查看月付、年付折算和年付总额，练习区分价格口径。',slugs:['breezenet','feimaoyun','edgenova']},
 '流量与额度':{reason:'对照按月标示的流量与一次性总额度，避免把不同发放方式混用。',slugs:['feiv','kexincloud','ermaoyun']},
 '节点与线路':{reason:'看看套餐名称中的线路标签如何记录，未知的网络字段仍需另行核验。',slugs:['laddercloud','lingmao','kuaili']},
 '选择与维护':{reason:'从完整品牌档案建立自己的候选清单，再使用比较工具记录差异。',slugs:['muguang','wuyou','stardream']},
 '证据与编辑':{reason:'对照品牌参考套餐与站长实测图表，区分公开资料、提供截图和独立实测。',slugs:['yinxingren','muguang','breezenet']}
};
export function brandPathsFor(entry:Entry){const match=entry.data.section==='blog'?brandPaths[categoryFor(entry)]:undefined;return match?{reason:match.reason,brands:match.slugs.map(s=>airports.find(a=>a.slug===s)!)}:null;}
