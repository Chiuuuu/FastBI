import PERMISSION_CODE from '@/config/permission'
const PageView = () => import('@/layout/pageView.vue')
const ScreenShowView = () => import('@/views/screen')
const ScreenEditView = () => import('@/views/screenManage/screenEdit/admin')

export default {
    path: '/screen',
    redirect: '/screen/show',
    component: PageView,
    meta: {
        permissions: [PERMISSION_CODE.PAGE.screen]
    },
    children: [
        {
            path: 'show',
            name: 'screenShow',
            component: ScreenShowView,
            meta: {
                permissions: [PERMISSION_CODE.PAGE.screen]
            }
        },
        {
            path: 'edit',
            name: 'screenEdit',
            component: ScreenEditView,
            meta: {
                permissions: [PERMISSION_CODE.PAGE.screen]
            }
        }
    ]
}
