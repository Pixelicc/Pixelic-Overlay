import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/statistics",
      component: () => import("../views/Statistics.vue"),
    },
    {
      path: "/basic-settings",
      component: () => import("../views/Settings/Basic.vue"),
    },
    {
      path: "/appearance-settings",
      component: () => import("../views/Settings/Appearance.vue"),
    },
    {
      path: "/column-settings",
      component: () => import("../views/Settings/Column.vue"),
    },
    {
      path: "/notification-settings",
      component: () => import("../views/Settings/Notification.vue"),
    },
    {
      path: "/blacklist-settings",
      component: () => import("../views/Settings/Blacklist.vue"),
    },
  ],
});

export default router;
