import { defineConfig } from "umi";
import theme from "./src/theme/";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
  },
  routes: [
    {
      path: "/",
      component: "@/layouts/",
      routes: [
        { path: "/", redirect: "/record/" },
        { path: "/record/", component: "record" },
        { path: "/statistic/", component: "statistic" },
        { path: "/user/", component: "user" },
        { redirect: "/record/" },
      ],
    },
  ],
  theme,
  hash: true,
  base: "/time-mgt",
  title: "柳比歇夫时间管理法",
});
