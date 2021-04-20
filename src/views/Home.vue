<template>
  <div id="homeView">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      // 销毁sessionStorage中的token
      window.sessionStorage.removeItem('token')
      // 返回登录页
      this.$router.replace('/login')
      this.$message.info('提示:您已退出登录!')
    }
  }
}
</script>

<style lang="less" scoped>
</style>