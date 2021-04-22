import Vue from 'vue'
import App from './App.vue'
import './index.css'


import './app.scss'

import './elements/lit.ts'

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
 * 引入Element UI
 */

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {
  size: 'medium'
})

Vue.config.productionTip = false

import { router } from './router'

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')
