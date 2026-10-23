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

- 46 个静态页面，包括 404；40 个可索引页面。
- 5 篇教程、5 篇选择指南、5 篇百科。
- 5 家商业 VPN 的有限官方字段档案，不是订阅机场，不是独立实测。
- 4 个机场榜单方法页，当前无合格样本，noindex，Sitemap 排除。
- 独立评测模板及发布路由已实现，当前发布评测 0 篇。
- 比较支持 2–4 家、移除、上限提示、空状态、完整静态资料表。搜索在浏览器内处理。

目前适合审核与部署知识内容；尚不能作为拥有真实机场推荐和独立评测数据的完整商业站验收。请先补充可靠机场来源和测试证据。

## 维护入口

- `src/data/airports.ts`：品牌和套餐唯一数据源；`kind` 严格区分 airport/vpn。
- `src/data/ranking.ts`：价格、倍率、身份、周期和证据准入逻辑。默认仅比较 CNY 月付，不兑换币种。
- `src/content/articles/`：文章；frontmatter 含正文类别、日期、标签、来源和草稿状态。
- `src/content/reviews/`：独立评测；未达到证据要求不能取消 draft。
- `src/data/site.ts`：正式域名与专题；`src/data/policies.ts`：透明政策。
- `docs/keyword-map.csv`：搜索意图分配；`docs/final-audit.md`：实际验收结果。
- `docs/deployment.md`、`docs/bing-webmaster.md`、`docs/indexnow.md`：上线操作。

当前全部内容实际创建日期为 2026-10-23，不能每天构建伪造更新日期。以后修改文章时更新对应 frontmatter；修改其他页面时维护页面修改日期登记，详见运营指南。

## 验证范围

通过构建、类型、SEO 与内链自动检查不等于搜索收录、品牌事实完整审计或真实可用性测试。Lighthouse 与线上部署结果见验收报告，未测项目明确标为 NOT TESTED。
