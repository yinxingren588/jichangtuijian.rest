# Cloudflare Pages 部署指南

## 配置

正式域名：`https://jichangtuijian.rest`。源仓库：`https://github.com/yinxingren588/jichangtuijian.rest.git`。生产分支：`main`。项目根目录是仓库根目录。

1. 使用拥有域名和仓库权限的账号登录 Cloudflare；当前会话没有 Cloudflare 授权，不代表已部署。
2. 在 Workers & Pages 中新建 Pages 项目，选择连接 Git 并授权该 GitHub 仓库。
3. 框架选择 Astro，构建命令 `npm run build`，输出目录 `dist`，环境变量 `NODE_VERSION=24.18.0`（或符合项目 engines 的受支持版本）。
4. 运行第一次构建，检查日志和预览页面。若使用上传方式，将 `dist` 的内容上传为 Pages 静态产物，不要上传 node_modules。
5. 在项目的 Custom domains 中添加 `jichangtuijian.rest`，根据控制台要求完成域名接入与 DNS，等待证书和域名状态正常。仅添加 DNS 记录不能替代绑定域名。
6. 使用正式域名访问首页、任意文章、`/compare/`、`/robots.txt`、`/sitemap-index.xml` 与 IndexNow key 文件。确认 HTTPS、所有路径、静态缓存头与 404 状态。
7. 对 pages.dev 及预览部署启用 Cloudflare 文档支持的重定向或访问限制，避免不同域名成为独立索引站。所有 Canonical 始终指向正式域名；不要把预览地址写入源码。
8. 上线后用手机和桌面运行 Lighthouse；目标 Performance ≥90、SEO ≥95、Accessibility ≥90、Best Practices ≥90。保存结果，不以本地静态检查代替这些分数。

## 自动检查与回滚

GitHub Actions 在 push / pull_request 时执行安装、类型检查、构建和测试。Cloudflare Git 集成的部署可能与 CI 并行；生产更新前应确认 CI 通过，或在 Cloudflare 构建命令中使用 `npm run check && npm run build && npm test`。本项目不默认执行 IndexNow 提交。

回滚使用 Cloudflare 上一个已验证部署，或在 Git 中 revert 有问题的提交后重新部署，不要强推覆盖历史。上线修改后更新对应页面日期，运行检查并提交；仅将新增或修改的 URL 加入 IndexNow 批次。

## 上线阻碍

知识内容可部署审核，但机场品牌身份、真实套餐、数据排行榜和实测仍未完成。正式公开运营前需要维护者复核正文与政策、接受内容边界，并补齐运营所需资料。GitHub 推送成功不表示 Cloudflare 已上线，也不表示域名已接入。

官方参考：https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ ，https://developers.cloudflare.com/pages/configuration/custom-domains/ 。

## 本轮访问检查 · 2026-10-23

Cloudflare 控制台返回登录页，尚未进入拥有项目与域名权限的账户。正式域名的浏览器访问显示响应超时，本次无法确认在线部署状态。没有创建托管项目、修改 DNS、登录商家账户、购买服务或提交 IndexNow。

可直接交付已构建的静态包及 GitHub 源码；继续正式发布需要站点所有者登录对应 Cloudflare 账户并确认项目与域名。上线后再检查 HTTPS、404、资源缓存、真实网络加载、Lighthouse 和 Bing 站长验证。本地资源体积记录见 asset-budget.json，不作为性能评分。

## 全站精修后的交接 · 2026-10-24

本轮按用户要求完成本地整改与交付，正式上线由用户自行处理，不再要求提供控制台登录。当前构建317个HTML、311个可索引URL；Bing手册已同步数量。200篇知识文章全部精修，30篇教程和5篇百科保留。

本轮实际本地手机Lighthouse结果保存在docs/mobile-lighthouse-summary.json，并绑定构建指纹；它不能代替正式托管后的真实网络检测。源码中不自动执行发布、DNS修改或IndexNow远端通知。

上线后按Bing手册分别检查索引和搜索表现。没有真实导出数据前，展现、点击与平均位置继续留空；没有展现不能单独认定未收录，也不使用本地SEO评分推断关键词名次。
