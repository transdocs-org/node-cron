# 入门指南

`node-cron` 是一个轻量级的 Node.js 任务调度器，完全使用 JavaScript 编写，灵感来源于 [GNU crontab](https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html)。它允许你使用完整的 cron 语法来调度任务。

## 安装

使用 npm 安装 `node-cron`：
```bash
npm install --save node-cron
```
## 基本用法
导入 node-cron 并安排一个任务。以下是 CommonJS 和 ES6 模块的示例。

### CommonJS
```js
const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('每分钟运行一次任务');
});
```
### ECMAScript 模块 (ESM)
```js
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('每分钟运行一次任务');
});
```
cron 表达式 * * * * * 每分钟都会运行一次任务。更多详细信息请参见 [Cron 语法](/cron-syntax) 一节。

## 任务上下文

在使用函数（InlineTask）或 [BackgroundTask](/background-tasks) 时，`node-cron` 会将一个 `TaskContext` 对象作为第一个参数传入。该对象包含当前执行的有用元数据：
```ts
export type TaskContext = {
  date: Date;                // 计划的服务器时间
  dateLocalIso: string;      // 用于显示/记录的本地 ISO 字符串
  triggeredAt: Date;         // 实际执行开始时间
  task?: ScheduledTask;      // 任务实例（如果有）
  execution?: Execution;     // 执行元数据（如果有）
};
```
使用上下文和内联函数的示例：
```js
cron.schedule('* * * * *', async (ctx) => {
  console.log(`任务开始于 ${ctx.triggeredAt.toISOString()}`);
  console.log(`计划执行时间: ${ctx.dateLocalIso}`);

  cosole.log(`任务状态 ${ctx.task.getStatus()}`)
});
```
同样的操作也适用于后台任务：
```js
// ./tasks/my-task.js
export function task() => {
  console.log(`任务开始于 ${ctx.triggeredAt.toISOString()}`);
  console.log(`计划执行时间：${ctx.dateLocalIso}`);
  cosole.log(`任务状态 ${ctx.task.getStatus()}`)
};
```
使用任务文件路径来注册并启动任务。
```js
import cron from 'node-cron';

cron.schedule('*/5 * * * * *', './tasks/my-task.js');
```
在监听任务事件时也会传递 `TaskContext`，更多信息请参见 [事件监听指南](https://nodecron.com/event-listening.html#taskcontext-payload)。