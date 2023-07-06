import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/settings",
      component: () => import("../views/Settings.vue"),
    },
  ],
});

export default router;
