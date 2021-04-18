import Vue from 'vue'
import App from './App.vue'
import './index.css'

/**
 * 引入VueRouter
 */
import VueRouter from 'vue-router'
Vue.use(VueRouter)

/**
 * 引入VModal
 */
import VModal from 'vue-js-modal'
Vue.use(VModal, { componentName: 'VModal' })

/**
 * 引入antd
 */
import 'ant-design-vue/dist/antd.css'
import Button from 'ant-design-vue/lib/button'
Vue.component(Button.name, Button)

Vue.config.productionTip = false

import { router } from './router'

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')
