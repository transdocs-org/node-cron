---
outline: deep
---

# 任务控制
使用 `cron.schedule` 调度任务时，你需要传入一个 cron 表达式、一个任务（函数或文件路径）以及可选的配置。

该函数返回一个 `ScheduledTask` 实例，它为管理和检查进程内任务与后台任务提供了一致的接口。
```js
const task = cron.schedule('* * * * *', () => {
  //
}, { noOverlap: true });

await task.getStatus(); // 'stopped'（已停止）

await task.start();     // 启动调度器

await task.getStatus(); // 'idle'（空闲）

// 当任务正在运行时
await task.getStatus(); // 'running'（运行中）

await task.stop();      // 停止调度器

await task.execute();   // 立即手动运行任务

await task.destroy();   // 停止并永久移除任务
```
## ScheduledTask 接口
`ScheduledTask` 接口定义了与任何任务交互的约定，无论该任务是基本的还是在后台进程中运行的。
```ts
export interface ScheduledTask {
  id: string;
  name?: string;

  start(): void | Promise<void>;
  stop(): void | Promise<void>;
  getStatus(): string | Promise<string>;
  destroy(): void | Promise<void>;
  execute(): Promise<any>;
  getNextRun(): Date | null;

  on(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void;
  off(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void;
  once(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void;
}
```
**注意：** `on`、`off` 和 `once` 函数的相关说明请参考 [事件监听指南](/event-listening)

## 方法说明

---

### `start(): void | Promise<void>`

启动任务调度器。

- 对于**基础（进程内）**任务：开始解析 cron 表达式，并在匹配的时间点运行任务。
- 对于**后台**任务：fork 一个独立进程并启动守护进程来处理定时执行。
- 若任务已在运行，则调用无效。

---

### `stop(): void | Promise<void>`

停止调度器，防止任务在未来继续运行。

- 对于**基础任务**：停止调度器，但允许当前正在运行的作业完成。
- 对于**后台任务**：立即终止子进程。

> 注意：这不会永久删除任务 —— 如需永久删除，请使用 `destroy()`。

---

### `getStatus(): string | Promise<string>`

返回任务当前的生命周期状态。常见值包括：

- `'stopped'` – 调度器未运行。
- `'idle'` – 调度器正在运行，任务当前未执行。
- `'running'` – 任务正在执行。
- `'destroyed'` – 任务已被永久移除。

可用于监控或调试任务状态。

---

### `destroy(): void | Promise<void>`

永久停用任务并清理所有内部资源。

- 对于后台任务：终止关联进程、移除事件监听器，并清除持久化状态。
- 销毁后，除 `getStatus` 外，不应再调用其他方法。

---

### `execute(): Promise<any>`

立即手动执行任务函数，不受其预定时间限制。

- 适用于测试、调试或临时触发。
- 返回一个 `Promise`，任务成功时 resolve 其结果，失败时 reject。
- 会触发所有相关的生命周期事件（`execution:started`、`execution:finished`、`execution:failed` 等）。
- 若任务已销毁或处于无效状态，调用可能抛出异常或 reject。

---

### `getNextRun(): Date | null`

返回任务的下次预定运行时间；若调度器已停止或任务已销毁，则返回 `null`。

- 若 cron 表达式无法匹配到未来时间（例如计划已过期），也可能返回 `null`。

---

### `on(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void`

订阅特定生命周期事件。

- 回调接收一个 `TaskContext` 对象，其中包含任务及执行的元数据。
- 可用于日志记录、指标采集、自定义副作用或失败处理。
```ts
task.on('execution:failed', (ctx) => {
  console.error(`任务 ${ctx.task?.id} 失败:`, ctx.execution?.error);
});
```
### `off(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void`

移除先前注册的事件监听器。
 - 用于停止监听特定的任务或执行事件。

### `once(event: TaskEvent, fn: (context: TaskContext) => void | Promise<void>): void`
一次性订阅事件。回调在首次触发后自动移除。
 - 适用于临时钩子或一次性监控。