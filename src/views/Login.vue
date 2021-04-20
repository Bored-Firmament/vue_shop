<template>
  <div id="loginView">
    <div class="login_box">
      <!-- logo 区域 -->
      <div class="picture_box">
        <img src="@/assets/logo.png">
      </div>
      <!-- 登录表单区域Element UI -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-wode"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是登录表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法的规则
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法的规则
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮,重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮,进行预验证,再根据预验证的结果判断是否发送网络请求
    login() {
      // ES6 新增 async 和 await, 是对 Promise 的语法糖
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error('填写的登录信息不规范')
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 记录token
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转至home页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#loginView {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 20px;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  .picture_box {
    width: 130px;
    height: 130px;
    padding: 10px;
    border-radius: 50%;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ddd;
    }
  }

  .login_form {
    box-sizing: border-box;
    width: 100%;
    padding: 0 30px;
    position: absolute;
    top: 30%;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
