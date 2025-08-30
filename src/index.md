---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Node-Cron"
  text: "Node.js 的轻量级任务调度器"
  tagline: 在 Node.js 中轻松且精确地调度任务
  image:
    src: /node-cron.png
    alt: node-cron
  actions:
    - theme: brand
      text: 开始使用
      link: /getting-started

features:
  - title: 🔁 Cron 语法调度
    details: 使用标准 Cron 语法轻松安排重复任务——分钟、小时、天、月和星期几。
  - title: 🪶 零依赖
    details: 轻量且可用于生产环境。纯 JavaScript，无原生或外部依赖。
  - title: 🕹️ 完全运行时控制
    details: 通过简单的方法（如 `.start()`、`.stop()` 和 `.destroy()`）动态启动、停止或销毁已调度任务。
  - title: ⚙️ 在后台运行且不阻塞
    details: 在后台执行任务，不会阻塞 Node.js 事件循环——非常适合无干扰的自动化。
---


::: tip 需要比 cron 更多功能？
🚀 查看 [**Sidequest.js**](https://sidequestjs.com)，一个受 Oban 和 Sidekiq 启发的 Node.js 分布式任务运行器。

- 支持重试、优先级、调度和唯一性
- 支持 Postgres、MySQL、SQLite 和 MongoDB
- 包含简洁的 Web 仪表板，用于实时监控
:::