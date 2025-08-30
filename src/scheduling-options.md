# 调度选项

当你使用 `cron.schedule(expression, task, options)` 创建定时任务时，可以传入一个可选的配置对象来控制其行为。

## 类型定义
```ts
export type Options = {
  name?: string;
  timezone?: string;
  noOverlap?: boolean;
  maxExecutions?: number;
  maxRandomDelay?: number;
};
```
## 字段说明

| 字段             | 类型      | 说明                                                                 |
|------------------|-----------|-----------------------------------------------------------------------------|
| `name`           | `string`  | 任务的可选标识符。便于调试、日志记录或在 UI 中显示。 |
| `timezone`       | `string`  | 用于解释 cron 表达式的时区。必须是 `Intl.DateTimeFormat` 识别的有效时区名称（例如 `"America/Sao_Paulo"`、`"UTC"`、`"Europe/London"`）。如未指定，则默认使用系统时区。 |
| `noOverlap`      | `boolean` | 若为 `true`，则禁止任务重叠运行。当上一次执行尚未结束而下一次调度时间已到时，将跳过新的运行。默认值为 `false`。 |
| `maxExecutions`  | `number`  | 限制任务执行次数的上限。达到该次数后，任务将自动销毁。 |
| `maxRandomDelay` | `number`  | （抖动）在每次调度运行前，增加最多指定毫秒数的随机延迟。用于防止大量任务同时调度时的“惊群效应”。默认值为 0（无延迟）。 |

> 🛈 与旧版本不同，`scheduled` 和 `runOnInit` 已不再使用。默认情况下，任务在创建后即被调度并立即启动。如需创建初始状态为停止的任务，请使用 `createTask` 函数。若要在调度后立即手动运行任务，只需在任务调度完成后调用 `task.execute()`。

## 示例

### 1. 使用默认选项的基本调度

此示例以默认选项将任务调度为每分钟运行一次。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('任务每分钟运行一次');
});
```
在这种情况下，任务将在创建后立即运行，使用系统的时区，不会阻止重叠运行，也不会限制执行次数。

### 2. 使用自定义时区进行调度

此示例使用自定义时区（America/Sao_Paulo）调度任务，确保在该时区中评估 cron 表达式。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('按圣保罗时区每分钟运行一次');
}, {
  timezone: 'America/Sao_Paulo'
});

```
在这里，任务将根据指定的时区在每分钟的第 0 秒运行。

### 3. 防止任务执行重叠

此示例调度一个任务并防止重叠，这意味着如果某个任务仍在运行，而下一个调度时间已到达，该次执行将被跳过。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次，避免重叠');
}, {
  noOverlap: true
});
```
当 `noOverlap: true` 时，如果任务执行时间超过一分钟，下一次预定的执行将被跳过，以避免重叠。

### 4. 限制任务执行次数

在此示例中，任务在达到指定的执行次数（maxExecutions）后将停止运行。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('这将只运行 5 次');
}, {
  maxExecutions: 5
});
```
该任务在执行 5 次后将自动销毁。

### 5. 创建一个已停止的任务（通过 createTask）

如果你需要一个任务在初始状态下处于停止状态（不立即运行），可以使用 createTask 函数。下面的示例展示了如何创建一个仅在显式启动时才运行的任务。
```js
const task = cron.createTask('* * * * *', async () => {
  console.log('此任务为手动启动');
}, {
  noOverlap: true
});

// 任务不会立即启动；只有在调用 `.start()` 时才会运行。
task.start();
```
这将创建一个默认处于停止状态的任务。你可以通过调用 `task.start()` 来控制它何时启动。

### 6. 手动在调度后运行任务

如果你想在调度后立即手动运行任务，可以调用 `task.execute()`。
```js
const task = cron.schedule('* * * * *', async () => {
  console.log('每分钟运行一次任务');
});

// 在任务被调度后立即手动执行
task.execute();
```
在这种情况下，任务在被调度后会立即运行，即使 cron 表达式设置为每分钟运行一次。