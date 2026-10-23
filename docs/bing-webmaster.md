# Bing Webmaster Tools 操作手册

需要网站所有者手动登录 [Bing Webmaster Tools](https://www.bing.com/webmasters/)，本次未访问私人账户或假装已完成验证。

1. **添加并验证站点**：填写 `https://jichangtuijian.rest`，选择控制台提供的 DNS、XML 文件或 HTML meta 方法。验证值来自你的账号，不能生成假值。DNS 按当前控制台要求配置；XML 文件保存到 public 根目录后重新构建部署；meta 加入 Base 布局后重新部署。保留验证文件，直到控制台允许删除。
2. **提交 Sitemap**：在 Sitemaps 中提交 `https://jichangtuijian.rest/sitemap-index.xml`。检查发现数量与可索引页面一致；当前为 40 个，排除 search、404 和四个待数据榜单。
3. **IndexNow 验证**：确认根目录 key 文件能通过 HTTPS 访问，响应内容严格等于 key。运行文档中的单 URL 提交，保存 HTTP 日志。200/202 只说明通知被接受或待处理，不代表索引。
4. **URL Inspection**：先检查首页，再抽查文章、品牌和专题，查看抓取与索引状态、Canonical、可访问性及 robots。诊断后只对实质修改页请求重抓。
5. **Search Performance**：按页面和查询观察曝光、点击及 CTR，使用足够长的观察窗口，不凭短期波动改写全部页面。按 keyword-map 处理搜索意图，避免多个页面写成相同推荐榜。
6. **Index Coverage / 索引报告**：界面名称可能变化，以当前账号可见报表为准。检查已索引、排除、重复或已抓取未收录原因；有意 noindex 的方法页不应视为故障。
7. **Crawl Issues**：检查抓取错误、HTTP 状态、软 404、robots 和服务器日志。修复 404 内链、错误重定向和内容过薄问题，再观察后续抓取。

上线后记录验证日期、Sitemap 接收日期与检查结果。不要公开账号截图中的私人信息。后续收录和排名由搜索引擎决定，没有首页排名承诺。

官方帮助：https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b ，https://www.indexnow.org/documentation 。
