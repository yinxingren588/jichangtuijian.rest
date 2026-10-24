# Bing Webmaster Tools 操作手册

需要网站所有者手动登录 [Bing Webmaster Tools](https://www.bing.com/webmasters/)，本次未访问私人账户或假装已完成验证。

1. **添加并验证站点**：填写 `https://jichangtuijian.rest`，选择控制台提供的 DNS、XML 文件或 HTML meta 方法。验证值来自你的账号，不能生成假值。DNS 按当前控制台要求配置；XML 文件保存到 public 根目录后重新构建部署；meta 加入 Base 布局后重新部署。保留验证文件，直到控制台允许删除。
2. **提交 Sitemap**：在 Sitemaps 中提交 `https://jichangtuijian.rest/sitemap-index.xml`。检查发现数量与可索引页面一致；当前为 306 个，排除 search、404 和四个待数据榜单。
3. **IndexNow 验证**：确认根目录 key 文件能通过 HTTPS 访问，响应内容严格等于 key。运行文档中的单 URL 提交，保存 HTTP 日志。200/202 只说明通知被接受或待处理，不代表索引。
4. **URL Inspection**：先检查首页，再抽查文章、品牌和专题，查看抓取与索引状态、Canonical、可访问性及 robots。诊断后只对实质修改页请求重抓。
5. **Search Performance**：按页面和查询观察曝光、点击及 CTR，使用足够长的观察窗口，不凭短期波动改写全部页面。按 keyword-map 处理搜索意图，避免多个页面写成相同推荐榜。
6. **Index Coverage / 索引报告**：界面名称可能变化，以当前账号可见报表为准。检查已索引、排除、重复或已抓取未收录原因；有意 noindex 的方法页不应视为故障。
7. **Crawl Issues**：检查抓取错误、HTTP 状态、软 404、robots 和服务器日志。修复 404 内链、错误重定向和内容过薄问题，再观察后续抓取。

上线后记录验证日期、Sitemap 接收日期与检查结果。不要公开账号截图中的私人信息。后续收录和排名由搜索引擎决定，没有首页排名承诺。

官方帮助：https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b ，https://www.indexnow.org/documentation 。

## 本轮全站精修后的观察顺序 · 2026-10-24

正式上线由站点所有者自行完成，本轮不操作账号或远端提交。上线后优先检查首页、隐形人品牌页、六专题及文章页面的抓取和Canonical；306是当前构建的可索引URL数量，不是Bing已收录数量。

先在索引报告确认具体URL状态，再看搜索表现；没有展现不能单独认定未收录。使用同一观察窗口导出查询、页面、展现、点击和平均位置，填入《关键词目标页与排名跟踪.csv》的空白指标。不同国家、设备、时间范围先分别保留，不能把查询排名当永久名次。

有展现但点击偏少的页面，检查标题是否准确回答需求、摘要是否具体；位置已有进展但答案不足的页面，补充对应证据和案例。重复或规范化问题先检查实际目标和重定向，不批量改动已经匹配搜索需求的URL。只有取得实际导出数据后才记录表现，不以本地覆盖或Lighthouse分数替代搜索排名。
