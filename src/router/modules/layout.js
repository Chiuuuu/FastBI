import dataSourceRouter from './dataSource'
import screenManageRouter from './screenMange'
import CorporateDomainRouter from './corporateDomain'
import ProjectCenterRouter from './projectCenter'
import systemManageRouter from './systemManage'
import areaManageRouter from './areaManage'

const BaseLayout = () => import('@/layout/index')

export default {
    path: '/',
    name: '布局容器',
    component: BaseLayout,
    redirect: '/screenManage/catalog',
    children: [
        dataSourceRouter,
        screenManageRouter,
        ProjectCenterRouter,
        CorporateDomainRouter,
        systemManageRouter,
        areaManageRouter
    ]
}
