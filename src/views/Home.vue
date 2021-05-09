<template>
  <el-container class="home-container">
    <!-- 页面顶部 -->
    <el-header>
      <div>
        <img src="@/assets/img/logo.png" alt="望logo">
        <span>电商后台管理系统</span>
        <span>Version:1.0.0</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 页面左侧-侧边栏 -->
      <el-aside :width="isMenuCollapse ? '65px' : '200px'">
        <!-- 侧边栏-折叠按键 -->
        <div class="toggle" @click="toggleCollapse">|||</div>
        <!-- 侧边栏-菜单区 -->
        <el-menu
          :unique-opened="true"
          :collapse="isMenuCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <!-- 一级菜单 -->
          <!-- 固定的欢迎页 -->
          <el-menu-item index="/welcome">
            <i class="el-icon-menu" :class="iconsObj[999]"></i>
            <span slot="title">WelCome</span>
          </el-menu-item>
          <!-- 根据后端数据渲染的具体列表 -->
          <el-submenu :index="'/' + item.path" v-for="item in menulist" :key="item.id">
            <!-- 标题信息(图标、文本) -->
            <template slot="title">
              <i class="el-icon-menu" :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id">
              <!-- 标题信息(图标、文本) -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面右侧-内容主体 -->
      <el-main>
        <!-- 路由占位符  -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menulist: [], // 菜单列表
      iconsObj: {
        '999': 'iconfont icon-huanyingye',        // 欢迎页
        '125': 'iconfont icon-yonghuguanli',    // 用户管理
        '103': 'iconfont icon-quanxianguanli',  // 权限管理
        '101': 'iconfont icon-shangpinguanli',  // 商品管理
        '102': 'iconfont icon-dingdanguanli',   // 订单管理
        '145': 'iconfont icon-zhanshi'          // 数据统计
      }, // 菜单图标列表
      isMenuCollapse: false // 菜单collapse折叠
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    logout() {
      // 销毁sessionStorage中的token
      window.sessionStorage.removeItem('token')
      // 返回登录页
      this.$router.replace('/login')
      this.$message.info('提示:您已退出登录!')
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 菜单列表toggle
    toggleCollapse() {
      if (!this.isMenuCollapse) {
        this.isMenuCollapse = true
      } else {
        this.isMenuCollapse = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  color: #ffffff;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;

    div {
      &:first-of-type {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 60px;
          overflow: hidden;
          border-radius: 50%;
        }
        span {
          &:first-of-type {
            font-size: 22px;
            font-weight: 600;
            margin: 0 20px;
          }
          &:last-of-type {
            font-size: 16px;
          }
        }
      }
    }
  }
  .el-aside {
    background-color: #333744;
    // 以下两个属性仅让菜单折叠更流畅,可加可不加
    overflow: hidden;
    transition: all 1s;

    .toggle {
      background-color: #4a5064;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
    color: #303133;
  }
}
</style>