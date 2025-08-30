# 迁移指南：node-cron v3 到 v4

`node-cron` v4 是一次重大更新，不仅在内部优化方面，还在于全面迁移到 TypeScript。该版本提升了任务调度的性能，并为处理定时任务提供了更灵活的 API。

## 内部变更：
- **改进的调度算法**：在 v4 中，内部调度机制已得到优化。此前，系统每秒都会检查一次 cron 表达式。现在，检查间隔会根据 cron 表达式动态计算，从而实现更高效的任务调度并减少不必要的检查。
  例如，如果你的任务每 5 分钟运行一次，内部计时器将仅在符合该任务调度逻辑的间隔检查 cron 表达式，而不是每秒检查一次。这降低了 CPU 开销，提高了调度器的效率。

- **采用 TypeScript**：`node-cron` v4 已用 TypeScript 重写，提供了更好的类型安全，并为开发者带来更丰富的编辑器支持。借助 TypeScript 的严格类型检查，你可以在开发过程中更早发现潜在错误。

## 破坏性变更及如何从 v3 迁移到 v4
`node-cron` **v4** 引入了更强大、更灵活的 API。本指南概述了破坏性变更，并说明如何将任务从 v3 迁移到 v4。

### 1. 任务创建与选项
#### v3：

在 v3 中，你使用 scheduled 和 runOnInit 选项来控制任务行为。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次');
}, {
  scheduled: true,
  runOnInit: true,
  timezone: 'America/Sao_Paulo'
});
```
#### v4:

在 v4 中，`scheduled` 和 `runOnInit` 选项已被移除。默认情况下，任务在创建时就会被调度并立即启动。如果你需要一个初始状态为停止的任务，请使用 `createTask` 函数。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次');
}, {
  timezone: 'America/Sao_Paulo'
});

// 在调度后立即执行任务
task.execute();
```
如果你需要一个已停止的任务（不会立即启动的任务），请改用 createTask：
```js
const task = cron.createTask('* * * * *', async () => {
  console.log('此任务为手动启动');
}, {
  noOverlap: true
});

// 在调用 `task.start()` 之前，任务不会运行。
task.start();
```
### 2. 任务选项（Options 与 CronScheduleOptions）
#### v3：

v3 使用以下选项来调度任务：
```js
/**
 * @typedef {Object} CronScheduleOptions
 * @prop {boolean} [scheduled] 当时间匹配 cron 表达式时，是否有一个已准备并运行的计划任务。
 * @prop {boolean}[runOnInit] 在调度时立即运行任务
 * @prop {string} [timezone] 执行任务的时区。
 */
```
#### v4:

在 v4 中，任务调度选项被精简为单个 Options 类型，并更新了字段名称。值得注意的是，`scheduled` 和 `runOnInit` 字段已被移除，取而代之的是以下内容：
```js
export type Options = {
  name?: string;
  timezone?: string;
  noOverlap?: boolean;
  maxExecutions?: number;
};
```
关键更新：
  - name: 现在可以为任务指定名称（便于调试或日志记录）。
  - timezone: 定义用于解析 cron 表达式的时区。
  - noOverlap: 防止任务重叠执行。
  - maxExecutions: 限制任务的最大执行次数，达到后自动销毁任务。

### 3. 任务生命周期事件
#### v3：

在 v3 中，事件通过 EventEmitter 模式发出，你可以使用 `.on()`、`.once()` 和 `.off()` 来监听事件。

#### v4：

在 v4 中，事件系统已简化。`ScheduledTasks` 不再继承 `EventEmitter`，而是通过 ScheduledTask 自身的 on/once/off 方法处理事件。每个事件监听器都会收到一个包含运行时元数据的 `TaskContext`。
v3 示例（旧 API）：
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次');
});

task.on('task-started', (event) => {
  console.log('任务已启动:', event);
});
```
```markdown
```
```js
v4 示例（新 API）：

const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次');
});

task.on('task:started', (context) => {
  console.log('任务已启动：', context);
});
```
新事件名称：
- task-started -> task:started
- task-stopped -> task:stopped
- task-destroyed -> task:destroyed

更多信息请参见[监听事件指南](/event-listening)