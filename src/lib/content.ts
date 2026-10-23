import type {CollectionEntry} from 'astro:content';
export type Entry=CollectionEntry<'articles'>;
export const PAGE_SIZE=24;
export const categories=[
 {slug:'basics',name:'基础指南',description:'购买清单、成本计算、线路说明与稳定性方法，先建立整体判断框架。'},
 {slug:'budget',name:'预算与计费',description:'区分首期、续费、年付月均与实际待付金额，把优惠和退出条件放回完整账单。'},
 {slug:'traffic',name:'流量与额度',description:'理解统计范围、重置、倍率与一次性额度，用有前提的算式安排自己的用量。'},
 {slug:'nodes',name:'节点与线路',description:'分别观察入口、出口、目标和本地接入，不把节点名称当作性能结论。'},
 {slug:'network',name:'网络原理',description:'从解析、路由、传输到应用响应，找到错误发生的具体环节。'},
 {slug:'performance',name:'性能与测量',description:'按任务选择指标，保留环境、失败样本与观察窗口，避免单次测速泛化。'},
 {slug:'privacy',name:'隐私与凭据',description:'识别订阅令牌、权限、配置与日志的信任边界，减少不必要的信息披露。'},
 {slug:'devices',name:'设备与客户端',description:'区分系统、应用和管理策略的作用范围，了解不同设备上的配置差异。'},
 {slug:'scenarios',name:'应用场景',description:'针对会议、远程桌面、AI、流媒体和出行，定义实际需要完成的任务。'},
 {slug:'account',name:'订阅与账户',description:'分别检查登录、权益、配置和连接状态，有序处理续费、迁移与支持问题。'},
 {slug:'evidence',name:'证据与编辑',description:'理解官方声明、第三方整理、用户体验和独立测量各自能支撑什么。'},
 {slug:'workflow',name:'选择与维护',description:'从需求和候选清单到变更、验证和复盘，形成可恢复、可解释的流程。'}
];
export function categoryFor(a:Entry){if(a.data.category)return a.data.category;if(a.data.section==='guides'){const platform:Record<string,string>={windows:'Windows',android:'Android',ios:'iOS',macos:'macOS'};return '操作教程 · '+(platform[a.id]||'通用');}return a.data.section==='glossary'?'基础百科':'基础指南';}
export function ordered(entries:Entry[]){return [...entries].sort((a,b)=>b.data.updated.localeCompare(a.data.updated)||a.data.title.localeCompare(b.data.title,'zh-CN'));}
export function relatedEntries(current:Entry,all:Entry[]){
 const paths=current.data.related||[];
 return all.filter(a=>a.id!==current.id).map(a=>{const url='/'+a.data.section+'/'+a.id+'/';return{a,score:(paths.includes(url)?100-paths.indexOf(url):0)+(categoryFor(a)===categoryFor(current)?10:0)+a.data.tags.filter(t=>current.data.tags.includes(t)).length*3+(a.data.section===current.data.section?1:0)};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.a.id.localeCompare(b.a.id)).slice(0,4).map(x=>x.a);
}
export function entryUrl(entry:Entry){return '/'+entry.data.section+'/'+entry.id+'/';}
export function readingSequence(current:Entry,all:Entry[]){
 const entries=ordered(all.filter(a=>a.data.section===current.data.section));
 const index=entries.findIndex(a=>a.id===current.id);
 if(index<0||entries.length<2)throw Error('Reading sequence requires a known entry and two or more documents.');
 return {previous:entries[(index-1+entries.length)%entries.length],next:entries[(index+1)%entries.length],position:index+1,total:entries.length,wrapPrevious:index===0,wrapNext:index===entries.length-1};
}
export function categoryUrl(entry:Entry){const category=categories.find(c=>c.name===categoryFor(entry));return entry.data.section==='blog'&&category?'/blog/category/'+category.slug+'/':'/'+entry.data.section+'/';}
export function readingMinutes(entry:Entry){return Math.max(1,Math.ceil((entry.body||entry.data.description).replace(/https?:\/\/\S+/g,'').length/450));}
