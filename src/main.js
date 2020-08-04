import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, ColorPicker, Select, Option, Input } from 'element-ui'
import BinUI from 'bin-ui'
import VCharts from 'v-charts'
import 'bin-ui/lib/styles/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

import './styles/index.styl'

// element-ui 局部引用
Vue.use(Button)
Vue.use(ColorPicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)

Vue.use(BinUI)
Vue.use(VCharts)
Vue.use(Antd)

Vue.prototype.$EventBus = new Vue()
Vue.prototype.$base = process.env.NODE_ENV === 'production' ? '/bin-data-site' : ''

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')