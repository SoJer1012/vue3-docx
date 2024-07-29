import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Page403 from "@/views/error/403.vue";
import Page404 from "@/views/error/404.vue";

export const RootRoute = {
  path: "/",
  name: "Home",
  meta: {
    title: "合同模板",
  },
  redirect: "/contract",
};
export const routerList = [
  {
    path: "/contract",
    name: "Generate",
    meta: {
      title: "合同模板-生成",
    },
    component: () => import("@/views/generate/index.vue"),
  },
  {
    path: "/contract/preview",
    name: "Preview",
    meta: {
      title: "合同模板-预览",
      hidden: true,
    },
    component: () => import("@/views/preview/index.vue"),
  },
  {
    path: "/403",
    name: "Page403",
    component: Page403,
  },
  {
    path: "/:catchAll(.*)", // 捕获所有未定义的路由
    name: "NotFound",
    component: Page404,
  },
];

export const constantRouter = [RootRoute, ...routerList];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export function setupRouter(app) {
  app.use(router);
}

export default router;
