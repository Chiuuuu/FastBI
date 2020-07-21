import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/screenManage/screenCatalog"
  },
  {
    path: "/screenManage/screenEdit",
    component: () => import("@/views/screenManage/screenEdit/screenEdit")
  },
  {
    path: "/layout",
    name: "布局容器",
    component: () => import("@/layout/index"),
    children: [
      {
        path: "/screenManage",
        name: "大屏管理",
        component: () => import("@/views/screenManage/index"),
        children: [
          {
            path: "screenCatalog",
            name: "大屏目录",
            component: () =>
              import("@/views/screenManage/screenCatalog/screenCatalog")
          }
        ]
      },
      {
        path: "/dataSource",
        name: "数据源",
        component: () => import("@/views/dataSource/index"),
        children: [
          {
            path: "dataAccess",
            name: "数据接入",
            component: () => import("@/views/dataSource/dataAccess/dataAccess")
          },
          {
            path: "dataModel",
            name: "数据模型",
            component: () => import("@/views/dataSource/dataModel/dataModel")
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
