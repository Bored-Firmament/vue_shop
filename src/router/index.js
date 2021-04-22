import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')
const Welcome = () => import('@/views/Welcome.vue')
const Users = () => import('@/views/user/Users.vue')
const Roles = () => import('@/views/power/Roles.vue')
const Rights = () => import('@/views/power/Rights.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果访问的是login页,直接放心;
  if(to.path === '/login') return next();
  // 获取sessionStorage中保存的token值,
  const tokenStr = sessionStorage.getItem('token');
  // 若没有token值,则强制跳转login页,以便进行登录并保存token值
  if(!tokenStr) return next('/login');
  // next() 放行; next('xxx') 强制跳转到xxx;
  next();
});
export default router
