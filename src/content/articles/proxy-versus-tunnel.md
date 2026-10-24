---
title: "系统代理与隧道模式覆盖哪些流量"
description: "系统代理通常需要应用配合，隧道模式还受路由、DNS与排除规则影响。用逐应用覆盖表检查实际路径，避免把连接开关当成全设备保证。"
section: "blog"
published: "2026-10-23"
updated: "2026-10-24"
tags: ["协议", "网络原理"]
category: "网络原理"
sources: ["https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows", "https://developer.android.com/reference/android/net/VpnService"]
related: ["/blog/windows-proxy-follow/", "/blog/router-vpn-scope/", "/blog/dns-split-configuration/", "/blog/ipv6-dual-stack/"]
draft: false
---

系统代理和隧道模式是两种不同的流量接入方式。前者通常需要应用读取或显式使用相应代理设置；后者通过虚拟网络接口和路由参与传输，但覆盖范围仍取决于平台、客户端和策略。界面写着“已开启”，不能直接证明全部应用、协议与地址族走同一路径。

## 先区分设置存在和请求遵循

[Windows代理说明](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows)介绍自动发现、脚本与手动设置；这些选项是配置入口，具体应用如何使用仍需核实。[Android VpnService](https://developer.android.com/reference/android/net/VpnService)则提供虚拟接口及路由相关机制，应用包含或排除规则也会影响范围。不能把某个平台实现直接套到所有客户端。

| 观察对象 | 必须确认 | 容易遗漏 |
| --- | --- | --- |
| 浏览器请求 | 代理来源、扩展与当前会话 | 扩展可能只处理部分请求 |
| 独立应用 | 是否使用系统设置或自己的配置 | 应用可能另有代理入口 |
| DNS解析 | 客户端与系统怎样处理解析 | 请求路径与解析路径未必一致 |
| IPv4及IPv6 | 各自实际覆盖情况 | 单测一种地址族就概括全部 |

## 一个应用正常，另一个失败时

假设浏览器能打开页面，文件应用却超时。先记录两者版本、准确任务与错误，再查看它们实际采用的设置；不要仅凭浏览器结果宣布全设备正常。若目标和协议也不同，还要保留这种差异，不能将失败立即归到代理范围。

检查时固定当前模式，用各应用原本需要完成的小任务逐个验证。若客户端提供可信的本地日志，可核对请求是否匹配预期规则；没有相关观察能力，就写路径未确认，不用外观相同的图标补齐证据。

## 切换模式应有恢复点

记录原来的代理、DNS、路由相关设置，再按当前版本官方说明做一次可恢复变更。连接成功后，也检查打印机、局域网服务和组织要求的应用。切换模式可能改变权限和覆盖范围，不能只看一个测速值选择。

工作或学校设备应保留管理员策略；出现管理冲突时交由负责人处理。若两种模式都无法完成同一任务，应回到分层排查，不为了追求“全局”标签不断扩大改动。

继续阅读：[为什么Windows上的不同应用不一定遵循同一代理](/blog/windows-proxy-follow/)、[路由器配置与单设备客户端的覆盖范围怎样比较](/blog/router-vpn-scope/)、[分流环境下，DNS与连接路径为什么要一起看](/blog/dns-split-configuration/)、[双栈网络为什么要分别检查IPv4和IPv6](/blog/ipv6-dual-stack/)。
