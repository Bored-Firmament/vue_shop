<template>
  <div class="cate">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 功能行 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogShow">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="cateList" 
        style="width: 100%;" 
        row-key="cat_id" 
        border 
        :tree-props="{children: 'children'}">
        <el-table-column
          type="index"
          label="#"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_name"
          label="分类名称"
          width="180">
        </el-table-column>
        <el-table-column
          label="是否有效"
          width="180">
          <template v-slot="scope">
            <i class="p20"
              :class="[scope.row.cat_deleted?'el-icon-error':'el-icon-success']" 
              :style="{color:(scope.row.cat_deleted?'#ee9090':'#90ee90')}"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="级别">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level=='0'">一级</el-tag>
            <el-tag v-if="scope.row.cat_level=='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.cat_level=='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button class="circle-button" size="mini" type="primary" icon="el-icon-edit" @click="editDialogShow(scope.row.cat_id)">编辑</el-button>
            <el-button class="circle-button" size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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

    <!-- 添加分类 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogHide">
      <template v-slot:footer>
        <el-form
         :model="addCateForm" 
         :rules="cateFormRules" 
         ref="addCateFormRef" 
         label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="addDialogHide">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑分类 对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogHide">
      <template v-slot:footer>
        <el-form
         :model="editCateForm" 
         :rules="cateFormRules" 
         ref="editCateFormRef" 
         label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="editDialogHide">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 商品分类 的 数据列表
      cateList: [],
      // 商品分类 的 数据总数
      total: 0,
      // 获取 商品分类 数据 的 条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 添加分类 的 对话框 是否显示
      addDialogVisible: false,
      
      // 添加分类/编辑分类 的 验证规则
      cateFormRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ]
      },

      // 添加分类 的 表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      // 商品(父级)分类 的 数据列表
      parentCateList: [],
      // 指定 级联选择器 的 配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,    // 取消父子关联,达到可以选择父级的效果
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的 商品(父级)分类 的id数组
      selectedKeys: [],
      // 编辑分类 的 对话框 是否显示
      editDialogVisible: false,
      // 编辑分类 的 表单数据
      editCateForm: {},
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取 商品分类 (全部)数据
    async getCateList() {
      // 请求数据
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败');
      // 保存数据
      this.cateList = res.data.result;
      this.total = res.data.total;
      // 处理
      this.addAttr(0,this.cateList);
    },
    // 递归为有children属性的父元素添加某属性
    addAttr(indexHead, arr){
      arr.forEach((item, index) => {
        if (indexHead === 0) {
          item.index = (index + 1);
        } else {
          item.index = indexHead + '.' + (index + 1);
        }
        if(item.children){
          this.addAttr(item.index, item.children);
        }
      })
    },

    /* 分页相关 */
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getCateList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    
    // 隐藏 添加分类 对话框
    addDialogHide() {
      this.addDialogVisible = false;
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 显示 添加分类 对话框
    addDialogShow() {
      this.getParentCateList();

      this.addDialogVisible = true;
    },
    // 获取 商品分类 父级分类 的数据
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {params: {
        type: 2
      }})
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.parentCateList = res.data;
      console.log(res);
    },
    // 选择项 发生变化 触发
    parentCateChange() {
      // 父级分类的id
      if(this.selectedKeys.length > 0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
        // 当前分类的级别
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 这个情况是为了选中后取消,将下面两个参数重置为默认(都是0)
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加 商品分类
    addCate() {
      // 预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return;
        // 请求
        const {data: res} = await this.$http.post('categories',this.addCateForm)
        // 结果
        if(res.meta.status !== 201) return this.$message.error('添加商品类型失败')
        this.$message.success('添加商品类型成功')
        // 获取新列表
        this.getCateList();
        // 隐藏后要执行的操作太多了,直接调用隐藏方法
        this.addDialogHide();
      })
      
    },
    // 隐藏 编辑分类 对话框
    editDialogHide() {
      this.editDialogVisible = false;
      this.editCateForm = {};
    },
    // 显示 编辑分类 对话框
    async editDialogShow(id) {
      // 请求
      const {data: res} = await this.$http.get('categories/' + id)
      console.log(res);
      // 结果
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.editCateForm = res.data;
      // 显示
      this.editDialogVisible = true;
    },
    // 编辑分类
    editCate() {
      // 预验证
      this.$refs.editCateFormRef.validate(async valid => {
        const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if(res.meta.status !== 200) return this.$message.error('编辑商品分类失败')
        this.$message.success('编辑商品分类成功')
        // 获取新列表
        this.getCateList();
        // 隐藏
        this.editDialogVisible = false;
      })
    },
    
    // 删除分类
    async deleteCate(id) {
      // 弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品分类,是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 是否确定删除
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除商品分类')
      // 请求
      const {data: res} = await this.$http.delete('categories/' + id)
      // 删除是否成功
      if(res.meta.status !== 200) return this.$message.error('删除商品分类失败')
      this.$message.success('删除商品分类成功')
      // 获取新列表
      this.getCateList();
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

