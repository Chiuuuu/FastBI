import dataSourceRouter from './dataSource'
import screenManageRouter from './screenMange'
import CorporateDomainRouter from './corporateDomain'
import ProjectCenterRouter from './projectCenter'
import PlatFormRouter from './platform'
import LabelRouter from './label'

const BaseLayout = () => import('@/layout/index')

export default {
    path: '/',
    name: '布局容器',
    component: BaseLayout,
    redirect: '/screenManage/catalog',
    children: [
        dataSourceRouter,
        screenManageRouter,
        PlatFormRouter,
        LabelRouter,
        ProjectCenterRouter,
        CorporateDomainRouter
    ]
}
