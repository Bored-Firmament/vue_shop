import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 也可以在全局组件App.vue的样式表导入
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/' // 已失效
axios.defaults.baseURL = 'http://175.27.228.178:3434/api/private/v1/'
// axios 拦截器中给请求添加token
// request时 展示进度条NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start();
  // 将token用请求的请求头中的Authorization保存
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 一定要返回!不然请求就无了
  return config;
})
// response时 展示进度条NProgress.done()
axios.interceptors.response.use(res => {
  NProgress.done();
  // axios 拦截器中给响应的数据进行处理,响应的数据多了一层,最外层我们不需要,其中的data才是服务器响应给我们的
  // return res.data; // 因为项目用 async 和 await 这里就不用啦
  return res;
})

Vue.prototype.$http = axios

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)


// 全局过滤器
Vue.filter('formatDate', function(milliSecond) {
  let date = new Date(milliSecond*1000);
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1).toString().padStart(2, '0');
  let D = date.getDate().toString().padStart(2, '0');
  let h = date.getHours().toString().padStart(2, '0');
  let m = date.getMinutes().toString().padStart(2, '0');
  let s = date.getSeconds().toString().padStart(2, '0');
  // return  Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  return  `${Y}-${M}-${D} ${h}:${m}:${s}`;
})

// vue的生产 提示(开发过程中可以开启,会提示一些常见错误)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
