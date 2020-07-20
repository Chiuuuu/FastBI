import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/screenManage/screenCatalog'
  },
  {
    path: '/screenManage/screenEdit',
    component: () => import ('@/views/screenManage/screenEdit/screenEdit')
  },
//   {
//     path: '/screenManage',
//     name: '大屏管理',
//     component: () =>
//         import ('@/views/screenManage/index'),
//     children: [{
//         path: 'screenCatalog',
//         name: '大屏目录',
//         component: () =>
//             import ('@/views/screenManage/screenEdit/screenEdit'),
//     }]
// },
  {
    path: '/layout',
    name: '布局容器',
    component: () =>
        import ('@/layout/index'),
        children: [{
          path: '/screenManage',
          name: '大屏管理',
          component: () =>
              import ('@/views/screenManage/index'),
          children: [{
              path: 'screenCatalog',
              name: '大屏目录',
              component: () =>
                  import ('@/views/screenManage/screenCatalog/screenCatalog'),
          }]
      },]
    }
];

const router = new VueRouter({
  routes
});

export default router;
