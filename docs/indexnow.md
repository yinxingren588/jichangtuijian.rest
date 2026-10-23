# IndexNow 使用

此模块只在显式调用时发送请求，不绑定 build。首次已生成公共验证 key，位于 `indexnow.config.json`，对应 `public/<key>.txt`，这不是账号密码。支持 `INDEXNOW_KEY` 环境变量覆盖，但必须同时部署同名内容的 key 文件。

```sh
# 创建 key（已有配置时不会覆盖或旋转）
npm run indexnow:key
npm run build

# 查看单 URL 请求，不联网提交
npm run indexnow -- --url https://jichangtuijian.rest/ --dry-run

# 正式域名和 key 已部署后，单条通知
npm run indexnow -- --url https://jichangtuijian.rest/

# 批量通知：文本文件每行一个实际新增或修改 URL
npm run indexnow -- --file docs/changed-urls.txt

# 基于上次接受通知的摘要，选择新增或修改页
npm run indexnow -- --changed
```

首次没有基线时 `--changed` 会拒绝整站提交。请显式选择首批已上线页面，通过 `--file` 通知后保留 `.state/submitted.json` 作为基线。这里的“接受通知”不代表抓取完成。使用文件时只列出真实新增/更新页面；`docs/changed-urls.txt` 不预填所有 URL。

构建写入 `.state/current.json` 的页面内容哈希。比较哈希识别新增与修改；不会自动提交被删除的页面，如需通知删除应另行扩展并验证删除状态，当前模块覆盖本期要求的新增与更新。

实际发送前会读取正式域名 key 并严格验证，不通过则停止。只允许本域构建产物中的可索引 URL，拒绝 query、fragment、noindex、未知路径和外域。批次最多 10,000 条。对网络错误、429 和 5xx 进行最多四次尝试，使用递增间隔；永久 4xx 不重试。每次响应状态和响应正文写入 `.state/indexnow.log`，成功后按批次更新基线，失败批次不写入。

日志与基线默认不入 Git；在持续交付中应使用受控缓存保存基线，否则无法判断上次通知内容。本次仅做 dry-run 和本地逻辑测试，未向线上接口宣称成功。

协议与状态说明以 [IndexNow 官方文档](https://www.indexnow.org/documentation) 为准。
