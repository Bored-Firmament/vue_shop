<template>
  <div class="roles">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogShow">添加角色</el-button>
        </el-col>
      </el-row>
      
      <!-- 列表区域 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row class="bdbottom" :class="['bdbottom',index1 === 0?'bdtop':'','vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i :class="item1.children.length !== 0?'el-icon-caret-right':''"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 !== 0?'bdtop':'','vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i :class="item2.children.length !== 0?'el-icon-caret-right':''"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="editRightsDialogShow(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%">
      <span>这是一段信息</span>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="editRightsDialogVisible"
      width="50%" 
      @close="editRightsDialogHide">
      <!-- 对话框-主体区域 -->
      <el-tree 
       ref="editTreeRef" 
       :data="rightsList" 
       :props="rightsTreeProps" 
       node-key="id" 
       show-checkbox 
       default-expand-all
       :default-checked-keys="checkList"></el-tree>
      <!-- 对话框-底部区域 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editRightsDialogHide">取 消</el-button>
          <el-button type="primary" @click="editRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表
      roleList:[],
      // 权限列表
      rightsList:[],
      // 添加对话框是否显示
      addDialogVisible:false,
      // 分配权限对话框是否显示
      editRightsDialogVisible:false,
      // 树形控件的属性绑定对象
      rightsTreeProps: {
        children: 'children',
        label: 'authName'
      },
      // 选中的角色 的id
      roleId: 0,
      // 选中的权限 的列表
      checkList: [],
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
    // 移除权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否继续删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除权限')
      }
      // 发送网络请求 
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // 这里根据删除后返回的某角色全新的权限列表 来覆盖赋值 以达到页面重新渲染的目的
      // 而不是调用获取新的全部角色列表
      role.children = res.data
    },
    // 显示 添加角色 对话框
    addDialogShow() {
      // 显示
      this.addDialogVisible = true;
    },
    // 显示 分配权限 对话框
    async editRightsDialogShow(role) {
      // 保存当前 打开 分配权限 对话框 的角色的id,在提交请求时需要用到
      this.roleId = role.id;
      // 请求权限列表数据
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      // role当前角色数据,this.checkList权限选中列表(传入时为空,且传入后在内部push选中项)
      this.getRightsCheck(role, this.checkList)
      // 显示
      this.editRightsDialogVisible = true;
    },
    // 用递归(调用自身)拿到全部的选中项
    getRightsCheck(node, arr) {
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getRightsCheck(item, arr)
      });
    },
    // 隐藏 分配权限 对话框
    editRightsDialogHide() {
      // 清空选中项
      this.checkList=[],
      // 隐藏
      this.editRightsDialogVisible = false;
    },
    // 提交 分配权限
    async editRights() {
      // 获取全部选中
      const keys = [
        ...this.$refs.editTreeRef.getCheckedKeys(),
        ...this.$refs.editTreeRef.getHalfCheckedKeys()
      ]
      // 转成字符串,因为后台接受的参数要求是字符串
      const keysStr = keys.join(',');
      // 请求
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: keysStr});
      if(res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      // 刷新列表(重新请求数据)
      this.getRoleList()
      // 隐藏对话框
      this.editRightsDialogVisible = false;
    },
  }
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

