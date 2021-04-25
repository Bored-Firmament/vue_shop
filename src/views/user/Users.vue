<template>
  <div class="users">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="queryInfo.pagenum = 1;getUserList();"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogShow">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
             v-model="scope.row.mg_state" 
             @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <!-- 修改按钮(修改基本信息) -->
            <el-button
             class="circle-button"
             size="mini" 
             type="primary" 
             icon="el-icon-edit" 
             @click="editDialogShow(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button
             class="circle-button"
             size="mini" 
             type="danger" 
             icon="el-icon-delete" 
             @click="deleteUserById(scope.row.id)"></el-button>
            <!-- 分配角色(修改角色) -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button class="circle-button" size="mini" type="warning" icon="el-icon-setting" @click="editRoleDialogShow(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
     title="添加用户" 
     :visible.sync="addDialogVisible" 
     width="50%" 
     @close="addDialogClosedUser">
      <!-- 对话框-主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
        class="add-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框-底部区域 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户(基本)信息的对话框 -->
    <el-dialog
     title="修改用户信息" 
     :visible.sync="editInfoDialogVisibleUser" 
     width="50%" 
     @close="editDialogClosed">
      <!-- 对话框-主体区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
        class="edit-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框-底部区域 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editInfoDialogVisibleUser = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
     title="分配角色" 
     :visible.sync="editRoleDialogVisibleUser" 
     width="50%" 
     @close="editRoleDialogClosed">
      <!-- 对话框-主体区域 -->
      <div class="edit-d-box">
        <p><span>当前的用户:</span>{{editRoleForm.username}}</p>
        <p><span>当前的角色:</span>{{editRoleForm.role_name}}</p>
        <p>
          <span>分配新角色:</span>
          <el-select v-model="editRoleSelectValue" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editRoleDialogClosed">取 消</el-button>
          <el-button type="primary" @click="editRoleUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 验证方法-验证邮箱
    const checkEamil = (rule, value, callback) => {
      // 正则检查
      const emailPattern = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/
      if (emailPattern.test(value)) {
        return callback()
      }
      callback(new Error('邮箱不合法'))
    }
    // 验证方法-验证手机号
    const checkMobile = (rule, value, callback) => {
      // 正则检查
      const mobilePattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (mobilePattern.test(value)) {
        return callback()
      }
      callback(new Error('手机号不合法'))
    }
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 符合某个条件的用户列表
      userList: [],
      // 列表总数
      total: 0,
      // 添加用户 对话框 是否显示
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        // 验证用户名是否合法的规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法的规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        // 验证邮箱是否合法的规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEamil, trigger: 'blur' }
        ],
        // 验证手机号是否合法的规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户 对话框 是否显示
      editInfoDialogVisibleUser: false,
      // 修改用户的表单数据
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEamil, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色 对话框 是否显示
      editRoleDialogVisibleUser: false,
      // 分配角色的数据
      editRoleForm: {},
      // 角色列表
      rolelist: [],
      // 分配的新角色
      editRoleSelectValue: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.total = res.data.total
      this.userList = res.data.users
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 状态 改变的事件
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 数据库修改失败,但是页面已经修改了,所以需要改回去~
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },

    // 监听 添加用户对话框 关闭的事件
    addDialogClosedUser() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 添加用户对话框 显示的事件
    addDialogShow(data) {
      this.addDialogVisible = true;
    },
    // 监听 添加用户 的事件
    addUser() {
      // 预验证
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return;
        // 校验通过,发起 添加用户 的网络请求
        const {data: res} = await this.$http.post('users', this.addForm)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功');
        // 隐藏dialog对话框
        this.addDialogVisible = false;
        // 重新调用数据,刷新页面
        this.getUserList();
      })
    },

    // 监听 修改用户对话框 关闭的事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听 修改用户对话框 显示的事件
    async editDialogShow(id) {
      const {data: res} = await this.$http.get('users/' + id);
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data;
      this.editInfoDialogVisibleUser = true;
    },
    // 监听 修改用户 的事件
    editUserInfo() {
      // 预验证
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return;
        // 校验通过,发起 修改用户信息 的网络请求
        const {data: res} = await this.$http.put('users/' + this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        if(res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        this.$message.success('更新用户信息成功')
        // 隐藏dialog对话框
        this.editInfoDialogVisibleUser = false;
        // 重新调用数据,刷新页面
        this.getUserList();
      })
    },

    // 监听 删除用户 的事件
    async deleteUserById(id) {
      // 弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除用户')
      }
      const {data: res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },

    // 监听 分配角色对话框 关闭的事件
    editRoleDialogClosed() {
      this.editRoleDialogVisibleUser = false;
      // 清空对话框中选项框的值
      this.editRoleSelectValue = '';
    },
    // 监听 分配角色对话框 显示的事件
    async editRoleDialogShow(user) {
      this.editRoleForm = user;
      // 获取角色列表
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolelist = res.data;
      // 显示
      this.editRoleDialogVisibleUser = true;
    },
    // 监听 分配角色 的事件
    async editRoleUser() {
      if(!this.editRoleSelectValue) return this.$message.error('请选择要分配的角色')
      // 修改 用户 的 角色(分配角色)
      const {data: res} = await this.$http.put(`users/${this.editRoleForm.id}/role`,{
        rid: this.editRoleSelectValue
      })
      if(res.meta.status === 400) return this.$message.error(res.meta.msg);
      else if(res.meta.status !== 200) return this.$message.error('分配角色失败');
      
      this.$message.success('分配角色成功')
      // 请求新数据列表(刷新)
      this.getUserList();
      // 隐藏对话框
      this.editRoleDialogVisibleUser = false;
    },
  }
}
</script>

<style lang="less" scoped>
.users {
  height: 100%;

  .edit-d-box span {
    margin-right: 10px;
  }
}


</style>
