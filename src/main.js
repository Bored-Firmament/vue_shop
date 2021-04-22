import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 也可以在全局组件App.vue的样式表导入
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// axios 拦截器中给请求添加token
axios.interceptors.request.use(config => {
  // 将token用请求的请求头中的Authorization保存
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 一定要返回!不然请求就无了
  return config;
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
