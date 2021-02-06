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
        // { redirect: '/record/' },
      ],
    },
  ],
  theme,
  title: '柳比歇夫时间管理法',

  dynamicImport: {
    loading: '@/Loading',
  },
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
  hash: true,
  base: '/time-mgt',
  publicPath: '/time-mgt/',
  runtimePublicPath: true,
  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
  qiankun: {
    slave: {},
  },
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'flashcard',
      },
    ],
  ],
});
