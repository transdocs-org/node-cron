# Node-Cron 模块
本页面记录了 node-cron 模块中所有可用的公共方法，包括使用示例、参数说明和行为注意事项。

## 🔹 `schedule(expression, func, options?)`

根据 cron 表达式调度任务执行。

### 参数
| 名称         | 类型                   | 描述                                                                 |
| ------------ | ---------------------- | -------------------------------------------------------------------- |
| `expression` | `string`               | 有效的 cron 表达式（例如 `"0 0 * * *"` 表示每天午夜运行）           |
| `func`       | `Function \| string`   | 要执行的函数，或指向导出 `task` 函数的模块的路径。传入路径时，node-cron 将创建 [后台任务](background-tasks) |
| `options`    | `Options` *(可选)*     | 用于控制执行的其他选项（见下文）                                     |

#### 选项
```ts
type Options = {
  name?: string;
  timezone?: string;       // 例如 "America/New_York"
  noOverlap?: boolean;     // 防止任务重叠执行
  maxExecutions?: number;  // 任务最多可执行的次数
};
```
#### 返回值

返回一个带有控制方法的 ScheduledTask 实例：
```ts
import cron from 'node-cron';

const task = cron.schedule('* * * * *', () => {
  console.log('每分钟运行一次');
});

task.stop();    // 暂停任务
task.start();   // 启动或恢复任务
task.destroy(); // 彻底移除任务
```
查看更多：[任务控制指南](/task-controls)

## 🔹 `createTask(expression, func, options?)`

创建一个任务实例，但不会自动启动。适用于需要更精细控制的场景（例如稍后启动、条件启动或在测试中启动）。
```ts
import cron from 'node-cron';

const task = cron.createTask('0 * * * *', () => {
  console.log('每小时运行一次');
});
task.start();
```
## 🔹 `validate(expression: string): boolean`

验证给定的 cron 表达式在语法上是否正确。
```ts
import cron from 'node-cron';

cron.validate('0 12 * * *'); // true
cron.validate('invalid');    // false
```
如果表达式有效则返回 true，否则返回 false。