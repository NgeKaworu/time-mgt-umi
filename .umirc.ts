import { defineConfig } from 'umi';
import base from './.umirc.default';

export default defineConfig({
  ...base,
  dva: {},
  title: '柳比歇夫时间管理法',
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
  devServer: {
    port: 8020,
    proxy: {
      '/api/time-mgt': {
        target: 'https://api.furan.xyz/time-mgt',
        changeOrigin: true,
        pathRewrite: {
          '/api/time-mgt': '',
        },
      },
    },
  },

  base: '/micro/time-mgt',
  publicPath: '/micro/time-mgt/',
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'time-mgt',
      },
    ],
  ],
});
