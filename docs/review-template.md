# 独立评测工作模板（不发布）

取得品牌身份与原始测试记录后，复制以下 frontmatter 到 `src/content/reviews/真实品牌slug.md`，填写真实内容。默认 draft 为 true，不会生成页面；发布必须有对应 Airport、tested 状态与存在的 evidenceFile。正文必须完成以下标题，不能用标题清单代替评测。

```yaml
title: 使用真实品牌名与具体测试范围
description: 描述真实结论和局限
airportSlug: 数据库中已存在的品牌slug
conclusion: 一句话说明适合人群与主要限制
published: '实际发布日期'
updated: '实际修改日期'
sources:
  - https://实际核验的官方域名/
evidenceFile: docs/evidence/实际品牌slug.json
draft: true
```

正文段落：官方资料与编辑说明；测试环境与原始记录；AI 与流媒体逐项结果；优点及证据；缺点及失败样本；适合与不适合人群；购买前注意事项；FAQ；测试局限；利益披露。布局自动生成基本介绍、统一数据库套餐、节点协议、比较链接、来源和核验日期。客户端支持若无资料仍写尚未核实。

原始记录至少包含设备、运营商、时间及时区、节点、协议、目标、方法、时长、成功和失败样本。移除账号、令牌与个人信息后再入库。当前无已发布评测，也不凭此模板声称已完成实测。
