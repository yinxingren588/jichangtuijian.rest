# 本期来源登记 · 2026-10-23

只填入实际读取页面明确显示的字段，未将第三方榜单写成实测。

| 品牌 | 原始来源 | 已核对范围 | 未核实 |
|---|---|---|---|
| Proton VPN | https://protonvpn.com/free-vpn | 免费不限流量、1 台设备、平台下载入口 | 付费价格、节点地区、连接表现 |
| Mullvad | https://mullvad.net/en/pricing | EUR 5/月、5 台设备、不同充值时长月价一致、无免费方案 | 本期未核实流量与协议 |
| Windscribe | https://windscribe.com/features | 配置生成器的 OpenVPN/IKEv2/WireGuard、设备连接说明 | 套餐价格、流量、本地连接表现 |
| TunnelBear | https://www.tunnelbear.com/pricing/ | Free 2GB 额度；付费起价没有清楚周期因此未录入排序 | 免费重置周期、付费实际结算、连接表现 |
| hide.me | https://hide.me/en/pricing | Free 0 EUR 与月付 11.99 EUR、免费不限流量、连接限制 | 税费实际金额、AI/流媒体可用性 |

这些是商业 VPN，不是已核验订阅机场。字段核验不表示独立安全审计。其他文章中的技术参考与原始来源保存在各文章 frontmatter，并在页面底部可见。

技术实施参考：Astro https://docs.astro.build/en/guides/content-collections/ ；Tailwind https://tailwindcss.com/docs/installation/framework-guides/astro ；Cloudflare https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ ；IndexNow https://www.indexnow.org/documentation 。

## 新增机场参考资料

本次按维护者提供的品牌和链接导入 28 家、56 档套餐。每行对应参考站独立套餐页；未把来源站评分、测速、营销承诺或线路解锁能力写成本站实测。优惠码按维护者原文保留大小写，未提供的品牌不自动生成。

| 品牌 | 方案数 | 参考来源 | 优惠码 |
|---|---|---|---|
| 隐形人 | 2 | https://jiediantuijian.shop/airport/yinxingren/ | yxr888 |
| 暮光网络 | 2 | https://jiediantuijian.shop/airport/muguang/ | 未提供 |
| 微风网络 Breezenet | 2 | https://jiediantuijian.shop/airport/breezenet/ | weifeng90 |
| 飞猫云 | 2 | https://jiediantuijian.shop/airport/feimaoyun/ | flycat888 |
| 大佬云 | 2 | https://jiediantuijian.shop/airport/dalaocloud/ | 未提供 |
| 飞V | 2 | https://jiediantuijian.shop/airport/feiv/ | 未提供 |
| 梯子云 LadderCloud | 2 | https://jiediantuijian.shop/airport/laddercloud/ | 未提供 |
| 灵动云 | 2 | https://jiediantuijian.shop/airport/lingdongcloud/ | 未提供 |
| Firefly机场 | 2 | https://jiediantuijian.shop/airport/firefly/ | firefly |
| 灵猫 | 2 | https://jiediantuijian.shop/airport/lingmao/ | 未提供 |
| 闪跃 FlashLeap | 2 | https://jiediantuijian.shop/airport/flashleap/ | shanyue |
| 无忧链接 | 2 | https://jiediantuijian.shop/airport/wuyou/ | wuyou666 |
| 跨界云 | 2 | https://jiediantuijian.shop/airport/kuajiecloud/ | 未提供 |
| 星岛梦 StarDream | 2 | https://jiediantuijian.shop/airport/stardream/ | nmw888 |
| 光速云 LightSpeed | 2 | https://jiediantuijian.shop/airport/lightspeed/ | jichangcha09 |
| 唯兔云（V2云） | 2 | https://jiediantuijian.shop/airport/v2yun/ | rabbit |
| U1S1（有一说一） | 2 | https://jiediantuijian.shop/airport/u1s1/ | U1S1 |
| 极连云 | 2 | https://jiediantuijian.shop/airport/jiliancloud/ | 未提供 |
| 全球云 | 2 | https://jiediantuijian.shop/airport/quanqiuyun/ | tt88 |
| 光年梯 | 2 | https://jiediantuijian.shop/airport/guangnianti/ | 未提供 |
| Sogo云 | 2 | https://jiediantuijian.shop/airport/sogoyun/ | 未提供 |
| 宇宙云 YuZhou | 2 | https://jiediantuijian.shop/airport/yuzhoucloud/ | YUZHOU553 |
| 二猫云 2mao | 2 | https://jiediantuijian.shop/airport/ermaoyun/ | 未提供 |
| 一翻云 1fly | 2 | https://jiediantuijian.shop/airport/yifanyun/ | 未提供 |
| 边缘节点 EdgeNova | 2 | https://jiediantuijian.shop/airport/edgenova/ | 未提供 |
| 可信云 | 2 | https://jiediantuijian.shop/airport/kexincloud/ | 未提供 |
| 速界 SuJie | 2 | https://jiediantuijian.shop/airport/sujie/ | 未提供 |
| 快狸 KuaiLi | 2 | https://jiediantuijian.shop/airport/kuaili/ | 未提供 |

### 价格周期冲突处理

飞猫云、Firefly、快狸的入门方案：来源套餐名称与备注写年付折算，但付款周期列写月付。本站保留数值，按年付月均参考展示，不把 7、8、10 元当成年付总价或可单月购买的价格。年付实付总额待商家确认。
边缘节点：86/168 元按年付总价展示，200/450 GB 依据来源表头标注为月度额度，重置规则仍待确认。飞V：29 元、200 GB 的不限时方案标注一次性总额度，不混入月度额度。
