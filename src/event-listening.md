# 事件监听

无论是基本任务还是后台任务，都可以通过 `.on()`、`.once()` 和 `.off()` 方法订阅生命周期事件。

这些事件让你在任务生命周期的关键时刻做出反应，例如任务启动、完成、失败或被销毁时。每个监听器都会收到一个 `TaskContext` 对象，其中包含关于任务及其执行的详细元数据。

## 可用事件

| 事件                   | 载荷          | 描述                                                         |
| ---------------------- | ------------- | ------------------------------------------------------------ |
| `task:started`         | `TaskContext` | 通过 `.start()` 启动任务时触发。                             |
| `task:stopped`         | `TaskContext` | 通过 `.stop()` 停止任务时触发。                              |
| `task:destroyed`       | `TaskContext` | 通过 `.destroy()` 销毁任务时触发。                           |
| `execution:started`    | `TaskContext` | 在任务回调即将执行前触发。                                   |
| `execution:finished`   | `TaskContext` | 任务成功完成后触发。                                         |
| `execution:failed`     | `TaskContext` | 任务抛出错误时触发。                                         |
| `execution:missed`     | `TaskContext` | 当一次预定的执行被错过时触发。                               |
| `execution:overlap`    | `TaskContext` | 由于当前已有执行正在进行，导致预定执行被跳过时触发。       |
| `execution:maxReached` | `TaskContext` | 达到 `maxExecutions` 限制时触发。任务将被销毁。              |

## 示例
```js
const task = cron.schedule('* * * * *', async (context) => {
  console.log('任务正在运行，时间：', context.date);
  return '完成';
});

task.on('execution:started', (ctx) => {
  console.log('执行开始于', ctx.date, '原因：', ctx.execution?.reason);
});

task.on('execution:finished', (ctx) => {
  console.log('执行完成。结果：', ctx.execution?.result);
});

task.on('execution:failed', (ctx) => {
  console.error('执行失败，错误：', ctx.execution?.error?.message);
});

task.on('execution:maxReached', (ctx) => {
  console.warn(`任务 "${ctx.task?.id}" 已达到最大执行次数。`);
});
```
## TaskContext 载荷

现在每个事件都会提供一个 `TaskContext` 对象，以便统一访问时间和执行元数据。

### 类型定义
```ts
export type TaskContext = {
  date: Date;
  dateLocalIso: string;
  triggeredAt: Date;
  task?: ScheduledTask;
  execution?: Execution;
}
```
#### 字段说明

| 字段           | 类型            | 说明                                                                 |
| -------------- | --------------- | -------------------------------------------------------------------- |
| `date`         | `Date`          | 任务被安排运行（或已运行）的时间戳。                                 |
| `dateLocalIso` | `string`        | 人类可读的本地时间戳字符串，使用提供的时区。                         |
| `triggeredAt`  | `Date`          | 事件实际发出的时间。可用于调试延迟或漂移。                           |
| `task`         | `ScheduledTask` | 对任务实例的引用。                                                   |
| `execution`    | `Execution?`    | 与事件相关的执行信息（非执行事件则为 null）。                        |

### Execution 类型

该结构嵌入在 TaskContext.execution 中，表示任务的单次运行：
```js
export type Execution = {
  id: string;
  reason: 'invoked' | 'scheduled';
  startedAt?: Date;
  finishedAt?: Date;
  error?: Error;
  result?: any;
}
```
#### 执行字段
| 字段         | 类型     | 描述                                                               |
| ------------ | -------- | ------------------------------------------------------------------ |
| `id`         | `string` | 本次执行的唯一 ID。                                               |
| `reason`     | `string` | 任务触发原因 — 可以是 `'invoked'` 或 `'scheduled'`。              |
| `startedAt`  | `Date?`  | 执行开始时间。                                                     |
| `finishedAt` | `Date?`  | 执行结束时间。                                                     |
| `error`      | `Error?` | 抛出的错误（如果有）。                                             |
| `result`     | `any?`   | 任务成功时的返回值。                                               |

## 注意事项
 - 所有事件监听器都会收到一个 `TaskContext`，即使对于 task:stopped 或 execution:missed 这类事件也是如此。
 - 始终在调用 `.start()` 之前添加监听器，以免错过早期事件。
 - 后台任务会发出相同的事件，并使用相同的上下文，这些事件由工作进程转发。