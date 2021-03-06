// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
import VueRouter from "vue-router";
import dashboard from "@/pages/dashboard";

export const routes = [
  {
    path: '/',
    component:  dashboard,
    meta: {
      title: 'HOME'
    }
  },
  {
    path: '/threemap',
    component: () => import('@/pages/threemap'),
    meta: {
      title: 'demoaa'
    }
  },
  {
    path: '/threejs',
    component: () => import('@/pages/threejs/threejs'),
    meta: {
      title: 'demoaa'
    }
  },
  // {
  //   path: '/demoaa',
  //   component: demoaa,
  //   meta: {
  //     title: 'demoaa'
  //   }
  // },
]

export const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
