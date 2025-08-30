import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default {
  outDir: './dist',
  srcDir: './src',
  title: "node-cron 中文文档",
  description: "轻量级 Node.js 任务调度器 | node-cron 中文文档，每日定时更新。",
  head: [
    ['script', {
      defer: '',
      src: 'https://cdn.jsdmirror.com/gh/transdocs-org/cdn/transdocs-info-modal.js',
    }],
    ['script', {
      async: '',
      src: 'https://hm.baidu.com/hm.js?2fe1095387fd2f2c25892a4fde2f0cc2',
    }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/getting-started' },
    ],

    sidebar: [
      {
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: 'Cron 语法', link: '/cron-syntax' },
          { text: 'Node-Cron 模块', link: '/api-reference' },
          { text: '调度选项', link: '/scheduling-options' },
          { text: '任务控制', link: '/task-controls' },
          { text: '事件监听', link: '/event-listening' },
          { text: '后台任务', link: '/background-tasks' },
          { text: '从 V3 迁移', link: '/migrating-from-v3' },

        ]
      }
    ],

    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/node-cron' },
      { icon: 'github', link: 'https://github.com/node-cron/node-cron' }
    ],

    footer: {
      message: '2016 年以 ISC 许可证发布。',
      copyright: '由 @merencia 用 💚 制作'
    }
  }
}