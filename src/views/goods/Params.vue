<template>
  <div class="params">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 警告(提示)区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!!"
        type="warning" 
        :closable="false" 
        show-icon >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="catelist"
            :props="cascaderProps"
            @change="selectedKeysChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页区域 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogShow">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                 v-for="(item, index) in scope.row.attr_vals" 
                 :key="index" 
                 closable 
                 @close="closeTag(index, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="addTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button class="circle-button" type="primary" icon="el-icon-edit" size="mini" @click="editDialogShow(scope.row.attr_id)">编辑</el-button>
                <el-button class="circle-button" type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogShow">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                 v-for="(item, index) in scope.row.attr_vals" 
                 :key="index" 
                 closable 
                 @close="closeTag(index, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="addTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogShow(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- (添加/编辑)对话框 -->
    <el-dialog
      :title="titleHeadText + titleText"
      :visible.sync="paramsDialogVisible"
      width="40%"
      @close="paramsdialogHide">
      <el-form :model="paramsForm" :rules="paramsFormRules" ref="paramsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="paramsdialogHide">取 消</el-button>
          <el-button v-if="addOrEdit==='add'" type="primary" @click="addParams">确 定</el-button>
          <el-button v-if="addOrEdit==='edit'" type="primary" @click="editParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类 列表
      catelist: [],
      // 选中的 商品分类
      selectedKeys: [],
      // 级联选择框 配置项
      cascaderProps: {
        expandTrigger: 'hover', 
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 标签页 被选中的页签的名称
      activeTabName: 'many',
      // 动态参数 数据
      manyTableData: [],
      // 静态属性 数据
      onlyTableData: [],
      // 添加对话框是否显示
      paramsDialogVisible: false,
      // 添加对话框还是编辑对话框
      addOrEdit: 'add',
      // 对话框 表单数据
      paramsForm: {
        attr_name: ''
      },
      // 表单参数校验规则
      paramsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称/属性名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 某 参数/属性 的id
      attrId: 0,
      // 控制 tag 中 新增模块(输入框和按钮)的切换显示
      inputVisible: false,
      // 输入框的值
      inputValue: '',
      // 被删除的值
      deleteValue: {
        index: 0,
        value: ''
      },
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 是否 禁用(没有选中三级分类就禁用)
    isBtnDisabled() {
      if(this.selectedKeys.length !== 3) return true;
      return false;
    },
    // 当前选中 的 三级分类 的 ID(没有就返回null)
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    // 根据 选中的标签页 的 name 属性 决定对话框的(后半段)标题
    titleText() {
      if(this.activeTabName === 'many') return '动态参数'
      return '静态属性'
    },
    // 根据 add 还是 edit 觉得 决定对话框的(前半段)标题
    titleHeadText() {
      if(this.addOrEdit === 'add') return '添加'
      return '编辑'
    }
  },
  methods: {
    // 修改选中 商品分类 
    selectedKeysChange() {
      if(this.isBtnDisabled) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
      else this.getAttributesList();
    },
    // 标签页 点击事件
    handleTabClick() {
      if(!this.isBtnDisabled) this.getAttributesList();
      else this.$message.warning('请选择商品分类')
    },

    // 对话框隐藏
    paramsdialogHide() {
      this.paramsDialogVisible = false;
      this.$refs.paramsFormRef.resetFields();
      this.attrId = 0;
    },
    // 显示 添加 对话框
    addDialogShow() {
      this.addOrEdit = 'add';
      this.paramsDialogVisible = true;
    },
    // 显示 编辑 对话框
    editDialogShow(attr_id) {
      this.addOrEdit = 'edit';
      this.paramsDialogVisible = true;
      this.attrId = attr_id;
      this.getAttributes();
    },
    // 提交 添加 参数/属性
    addParams() {
      // 预验证
      this.$refs.paramsFormRef.validate(valid => {
        if(!valid) return ;
        this.postAddParams();
      })
    },
    // 提交 编辑 参数/属性
    editParams() {
      // 预验证
      this.$refs.paramsFormRef.validate(valid => {
        if(!valid) return ;
        this.putEditParams();
      })
    },
    // 新增Tag功能的 切换显示
    showInput(row) {
      // 保存当前辈选中的 参数/属性 id
      this.attrId = row.attr_id;
      // 获取该 id  对应的数据
      this.getAttributes();
      row.inputVisible = true;
      // $nextTick：当页面重新渲染之后,才会调用指定函数中的代码
      this.$nextTick(() => {
        this.$refs.addTagInput.$refs.input.focus();
      });
      
    },
    // 新增Tag
    handleInputConfirm(row) {
      // 输入的内容只有空格,非法,重置并结束其他操作
      if (!row.inputValue.trim()) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim())
      this.putEditParamsAddTag(row);
      row.inputVisible = false;
    },
    // 删除Tag
    closeTag(index, row) {
      this.deleteValue.index = index;
      this.deleteValue.value = row.attr_vals.splice(index, 1).toString();
      this.putEditParamsDeleteTag(row);
    },

    /* 网络请求 */
    // 请求 获取 商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.catelist = res.data
    },
    // 请求 根据 商品ID 和 参数类型 获取 对应的 动态参数 或 静态属性
    async getAttributesList() {
      // 请求
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {sel: this.activeTabName}
      })
      // 结果
      if(res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      
      // 数据处理
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        // 以下两个参数如果不在这里提供,是在组件的data中提供的话,会被复用！导致一个切换全部切换
        // 控制文本框和按钮的切换显示
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = '';
      })
      // 保存数据
      if(this.activeTabName === 'many') this.manyTableData = res.data;
      else this.onlyTableData = res.data;
    },
    // 请求 添加 参数/属性
    async postAddParams() {
      // 请求
      const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
        attr_name: this.paramsForm.attr_name,
        attr_sel: this.activeTabName
      })
      // 结果
      if(res.meta.status !== 201) return this.$message.error('添加'+ this.titleText +'失败');
      this.$message.success('添加'+ this.titleText +'成功');
      // 获取新列表
      this.getAttributesList();
      // 隐藏
      this.paramsDialogVisible = false;
    },
    // 请求 根据 商品ID 和 参数ID 及 参数类型 获取 对应的 动态参数 或 静态属性
    async getAttributes() {
      // 请求
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${this.attrId}`, {
        params: {sel: this.activeTabName}
      })
      // 结果
      if(res.meta.status !== 200) return this.$message.error('添加'+ this.titleText +'失败');
      
      // 数据处理
      
      res.data.attr_vals = res.data.attr_vals ? res.data.attr_vals.split(',') : [];
      // 以下两个参数如果不在这里提供,是在组件的data中提供的话,会被复用！导致一个切换全部切换
      // 控制文本框和按钮的切换显示
      res.data.inputVisible = false;
      // 文本框中输入的值
      res.data.inputValue = '';
      
      // 保存数据
      this.paramsForm = res.data;
    },
    // 请求 删除 参数/属性
    async deleteParams(attrId) {
      // 弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该'+ this.titleText +',是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 是否确定删除
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除'+ this.titleText);
      // 请求
      const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      // 删除是否成功
      if(res.meta.status !== 200) return this.$message.error('删除'+ this.titleText +'失败')
      this.$message.success('删除'+ this.titleText +'成功')
      // 获取新列表
      this.getAttributesList();
    },
    // 封装 请求 编辑 参数/属性
    edit(cid,aid,aname,asel,avals) {
      return this.$http.put(`categories/${cid}/attributes/${aid}`,{
        attr_name: aname,
        attr_sel: asel,
        attr_vals: avals
      })
    },
    // 请求 编辑 参数/属性 基础信息
    async putEditParams() {
      const {data: res} = await this.edit(this.cateId, this.attrId, this.paramsForm.attr_name, this.activeTabName, this.paramsForm.attr_vals.join(','))
      // 结果
      if(res.meta.status !== 200) return this.$message.error('编辑'+ this.titleText +'失败');
      this.$message.success('编辑'+ this.titleText +'成功');
      // 隐藏
      this.paramsDialogVisible = false;
    },
    // 请求 编辑 参数/属性 添加Tag
    async putEditParamsAddTag(row) {
      const {data: res} = await this.edit(row.cat_id,row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(','))
      // 结果
      if(res.meta.status !== 200) {
        row.attr_vals.pop();  // 这里是先前端添加标签,然后请求后端添加的,所以如果失败了要把前端添加的最后一个去掉
        return this.$message.error('新增标签失败');
      }
      row.inputValue = ''
      this.$message.success('新增标签成功');
    },
    // 请求 编辑 参数/属性 删除Tag
    async putEditParamsDeleteTag(row) {
      const {data: res} = await this.edit(row.cat_id,row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(','))
      // 结果
      if(res.meta.status !== 200) {
        row.attr_vals.splice(this.deleteValue.index, 0, this.deleteValue.value);  // 这里是先前端删除标签,然后请求后端删除的,所以如果失败了要把前端删除的某一个添加回去
        return this.$message.error('删除标签失败');
      }
      this.$message.success('删除标签成功');
      // 临时保存的值可以删除了
      this.deleteValue = {};
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-cascader {
  width: 300px;
}

.el-tag {
  margin: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>