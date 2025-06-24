import { defineConfig } from 'vitepress'
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@litert/xxl-job-integration",
  description: "A lightweight integration of XXL-Job for NodeJS.",
  base: '/projects/xxl-job-integration.js/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/quick-start' },
      { text: 'API Reference', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Quick Start', link: '/guides/quick-start' },
        ]
      },
      {
        text: 'API Reference',
        items: typedocSidebar,
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litert/xxl-job-integration.js' }
    ]
  }
})
