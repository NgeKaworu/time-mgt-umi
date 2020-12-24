import { defineConfig } from 'umi';
import theme from './src/theme/';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/',
      routes: [
        { path: '/', redirect: '/record/' },
        { path: '/record/', component: 'record' },
        { path: '/statistic/', component: 'statistic' },
        { path: '/user/', component: 'user' },
        { redirect: '/record/' },
      ],
    },
  ],
  theme,
  hash: true,
  title: '柳比歇夫时间管理法',
  base: '/time-mgt',
  publicPath: '/time-mgt/',
  runtimePublicPath: true,
  dynamicImport: {
    loading: '@/Loading',
  },
  favicon: './assets/favicon.ico',
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  externals: {
    moment: 'moment',
  },
  scripts: [
    'https://lib.baomitu.com/moment.js/latest/moment.min.js',
  ]
});
