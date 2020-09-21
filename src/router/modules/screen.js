const PageView = () => import('@/layout/pageView.vue')
const ScreenShowView = () => import('@/views/screen')
const ScreenEditView = () => import('@/views/screenManage/screenEdit/admin')

export default {
    path: '/screen',
    redirect: '/screen/show',
    component: PageView,
    children: [
        {
            path: 'show',
            name: 'screenShow',
            component: ScreenShowView
        },
        {
            path: 'edit',
            name: 'screenEdit',
            component: ScreenEditView
        }
    ]
}
