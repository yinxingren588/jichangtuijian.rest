export const coreKeywordTargets=[
 {keyword:'机场推荐',url:'/',intent:'从预算、套餐、节点与使用条件开始选择'},
 {keyword:'机场节点',url:'/blog/node-name-labels/',intent:'读懂节点名称、地区、线路和套餐权限'},
 {keyword:'性价比机场',url:'/blog/plan-cost/',intent:'比较付款周期、流量倍率与真实用量成本'},
 {keyword:'梯子推荐',url:'/recommend/beginner/',intent:'首次订阅的候选筛选与验证顺序'},
 {keyword:'VPN',url:'/glossary/vpn/',intent:'理解VPN的作用与适用范围'},
 {keyword:'VPN机场',url:'/glossary/vpn/',intent:'区分代理订阅、客户端和商业VPN'},
 {keyword:'VPN节点',url:'/blog/nearby-node/',intent:'根据任务、地区和连接记录选择服务器'},
 {keyword:'VPN推荐',url:'/vpn/',intent:'按已录入套餐和设备条件对照五家VPN'}
] as const;
export const keywordsForPath=(path:string)=>coreKeywordTargets.filter(item=>item.url===path).map(item=>item.keyword);
export const coreReadingRoutes=[
 {title:'机场节点怎么选？',label:'机场节点',url:'/blog/node-name-labels/',text:'看清名称、地区、线路与套餐权限，再读测速图。'},
 {title:'性价比机场怎么算？',label:'性价比机场',url:'/blog/plan-cost/',text:'把付款周期、流量发放与倍率放在同一张账单里。'},
 {title:'第一次订阅，从哪里开始？',label:'梯子推荐',url:'/recommend/beginner/',text:'先明确任务和预算，再从十个参考品牌建立候选。'},
 {title:'VPN与VPN机场有什么区别？',label:'VPN / VPN机场',url:'/glossary/vpn/',text:'区分服务、协议和客户端，选对需要核查的条件。'},
 {title:'VPN节点越近越好吗？',label:'VPN节点',url:'/blog/nearby-node/',text:'结合目标地区、延迟与实际任务，比较连接记录。'},
 {title:'如何对照VPN的使用条件？',label:'VPN推荐',url:'/vpn/',text:'按免费、月付、设备与配置需求，查看五家品牌资料。'}
] as const;
