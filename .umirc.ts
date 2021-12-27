import { defineConfig } from 'umi';
import base from './.umirc.default';
import routes from './routes';

export default defineConfig({
  ...base,
  dva: {},
  title: '柳比歇夫时间管理法',
  routes,
  devServer: {
    port: 8051,
    proxy: {
      '/api/time-mgt': {
        target: 'http://localhost:8050',
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
