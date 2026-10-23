# 航线笔记 · jichangtuijian.rest

中文网络连接知识与公开资料站。Astro 7 + TypeScript + Tailwind 4 + Content Collections，纯静态输出，Cloudflare Pages 部署。源仓库：https://github.com/yinxingren588/jichangtuijian.rest

## 本地运行

需要 Node >=22.23.4（本次实测 Node 24.18.0）及 npm。

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
npm run preview
```

构建产物在 `dist/`。`npm test` 检查构建后的 HTML，因此先运行 build。CI 自动执行同样流程。

## 内容状态

- 315 个静态页面，包括 404；309 个可索引页面。
- 200 篇知识文章、30 篇操作教程、5 篇百科；含原有内容，本次新增 195 篇文章及 25 篇教程。
- 28 家机场、56 档第三方参考套餐、12 个维护者提供的优惠码和 28 条推广入口；另保留 5 家商业 VPN 官方字段档案。未做独立实测。
- 4 个机场榜单方法页，当前无合格样本，noindex，Sitemap 排除。
- 6 个需求专题各含 10 家品牌的编辑参考排行；指定首位和排序依据在各专题公开，与上述证据型数据榜分别处理。
- 独立评测模板及发布路由已实现，当前发布评测 0 篇。
- 比较支持 2–4 家、移除、上限提示、空状态、完整静态资料表。搜索在浏览器内处理。

已按维护者要求收录品牌套餐与优惠信息，来源为 jiediantuijian.shop 各品牌套餐页。优惠码未验证，不自动计算券后价；推广链接明确披露并标记 sponsored。年付月均、年付总额与不限时总额度分别展示。独立实测与商家结算验证仍未完成。

## 维护入口

- `src/data/airports.ts`：统一数据出口，机场记录存放于 `src/data/brand-catalogue.json`；`kind` 严格区分 airport/vpn。价格只在数据源维护，不复制到模板。
- `src/data/ranking.ts`：价格、倍率、身份、周期和证据准入逻辑。默认仅比较 CNY 月付，不兑换币种。
- `src/data/topic-rankings.ts`：六专题参考排序；高端专线沿用原清单前十，低预算按月付参考价，其余四个隐形人固定首位。
- `src/content/articles/`：文章；frontmatter 含正文类别、日期、标签、来源和草稿状态。
- `src/content/reviews/`：独立评测；未达到证据要求不能取消 draft。
- `src/data/site.ts`：正式域名与专题；`src/data/policies.ts`：透明政策。
- `docs/keyword-map.csv`：搜索意图分配；`docs/final-audit.md`：实际验收结果。
- `docs/deployment.md`、`docs/bing-webmaster.md`、`docs/indexnow.md`：上线操作。

当前全部内容实际创建日期为 2026-10-23，不能每天构建伪造更新日期。以后修改文章时更新对应 frontmatter；修改其他页面时维护页面修改日期登记，详见运营指南。

## 验证范围

通过构建、类型、SEO 与内链自动检查不等于搜索收录、品牌事实完整审计或真实可用性测试。Lighthouse 与线上部署结果见验收报告，未测项目明确标为 NOT TESTED。


## 本轮内容扩展

文章分为 12 个目录分类，以每页最多 24 篇分成 9 页。教程按 Windows、Android、iOS、macOS 和通用任务分组，全部 30 篇均有准备条件、六步操作、预期结果、恢复方法和停止条件。相关文章支持显式关联与标签关联，搜索包含分类信息。目录快照在 docs/content-inventory.csv。

这些内容是 AI 辅助编写的基础知识短文与操作流程，并非 200 篇长篇独立评测。文章及教程长度见 docs/content-inventory.csv，本轮精修了 4 篇核心内容并补充 2 张本站工具界面截图；计数包含标点和 Markdown，不冒充中文纯字数。共同的方法框架按专题复用，各篇有独立问题、情境、核对项和边界。未逐篇完成人工事实审校，未在全部真实设备上执行教程，详见 docs/content-expansion.md。

## 测速与解锁图表

`/evidence/` 为图表总览，28 家机场档案已关联 56 张品牌图；浪网 WaveNet 作为额外资料保留 2 张图，另有 2 张汇总图。原始 PNG 保留，1200 px WebP 预览延迟加载，支持放大、原始尺寸、前后切换与下载。原图清单、尺寸与 SHA-256 见 `docs/evidence-asset-manifest.json`，来源与局限见 `docs/evidence-integration.md`。

所有图表由维护者提供，尚未独立复测；不改变品牌身份、套餐核验、榜单准入及稳定性记录状态。

## 品牌浏览与比较优化

33 个品牌页新增四项首屏速览和手机底部快捷入口；28 家机场增加专属读图与结算检查说明。比较工具支持套餐条件、测速与解锁、全部资料三种视图。12 个原有优惠码补充公开资料查阅结果，冲突、旧活动与未确认状态分别标记，未验证商家结算，不自动计算券后价。客户页面不展示本轮新增检索来源链接，维护用记录见 docs/coupon-research-audit.json。

运行 npm run audit:assets 检查静态资源体积；它不替代 Lighthouse 或真实网络测量。本轮交付与上线阻碍见 docs/brand-experience.md。

## 总览表、手机导航与品牌选择提示

六个专题增加十品牌静态总览表，与详细卡片共用排名和套餐数据。可选择 2–4 家品牌带入比较工具，保留价格周期、流量口径及优惠码，不自动计算折后价。手机表格可横向滚动并固定品牌列；底部提供切换专题、品牌总览、返回榜首及所选品牌对比。33 个品牌的首屏增加适合人群、主要特点和注意事项，短文维护于 `src/data/brand-fit.ts`。验证范围见 `docs/browsing-tools.md`。
