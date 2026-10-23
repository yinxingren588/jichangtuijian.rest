---
title: "双栈网络为什么要分别检查IPv4和IPv6"
description: "设备和目标可能优先选择不同地址族，两类请求的路由和支持情况可能不同。只测一类地址不能完整说明另一类。"
section: "blog"
published: "2026-10-23"
updated: "2026-10-23"
tags: ["协议", "网络原理"]
category: "网络原理"
sources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"]
related: ["/guides/connection-check/", "/guides/build-network-baseline/", "/blog/network-layer-checklist/"]
draft: false
---

设备和目标可能优先选择不同地址族，两类请求的路由和支持情况可能不同。只测一类地址不能完整说明另一类。

## 问题范围与判断前提

网络请求不是一个不可分割的成功开关。解析、路由、传输、安全握手和应用响应可能分别成功或失败；不同工具观察的位置也可能不同。准确描述已经看到的阶段，比把所有错误统称为节点异常更有帮助。

## 对照情境

某域名在两台设备表现不同，可检查是否选择了不同地址族，再固定条件对比。

## 实际核对顺序

1. 记录解析得到的地址族。
2. 查客户端支持说明。
3. 分别验证目标任务。

## 怎样使用这份观察

建立一个最小且可重复的请求，记录时间、目标、应用版本和准确提示。先验证本地接入，再沿实际错误继续定位；只修改有依据的一项，避免同时更换解析、协议和出口。不能观察的环节保持未知，不把推测写成确定原因。

## 容易误判的边界

不能仅凭IPv6存在就判断泄漏，判断依据应是预期路径和真实处理范围。

## 继续处理这个问题

需要实际操作时，可从[对应操作教程](/guides/build-network-baseline/)开始；[相关基础指南](/guides/connection-check/)解释上一级判断方法，[同主题延伸阅读](/blog/network-layer-checklist/)补充另一种情境。

