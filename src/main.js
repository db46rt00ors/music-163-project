import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directives from './plugins/directives.js'
import components from './plugins/components.js'

// 引入swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.use(directives)
Vue.use(components)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
