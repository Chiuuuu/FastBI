import dataSourceRouter from './dataSource'
import screenManageRouter from './screenMange'
const BaseLayout = () => import('@/layout/index')

export default {
    path: '/',
    name: '布局容器',
    component: BaseLayout,
    redirect: '/screenManage/catalog',
    children: [
        screenManageRouter,
        dataSourceRouter
    ]
}
