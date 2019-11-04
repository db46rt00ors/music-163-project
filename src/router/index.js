import Vue from 'vue'
import VueRouter from 'vue-router' 

// https://www.cnblogs.com/lxk0301/p/11671256.html
// 解决莫名其妙的报错 重写了一个push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'icon-wangyiyunyinlezizhi-copy',
    component: () => import('@/views/index/index.vue')
  },
  {
    path: '/diantai',
    name: 'icon-diantai',
    component: () => import('@/views/diantai/index.vue')
  },
  {
    path: '/wode',
    name: 'icon-pengyou',
    component: () => import('@/views/wode/index.vue')
  },
  {
    path:'/*',
    redirect:'/index'
  }
]

const router = new VueRouter({
  routes
})

export default router
