<template>
  <div class="list">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="clickSearch"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.goods_name }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ props.row.goods_price | formatPrice}}</span>
              </el-form-item>
              <el-form-item label="库存">
                <span>{{ props.row.goods_number }}</span>
              </el-form-item>
              <el-form-item label="重量">
                <span>{{ props.row.goods_weight }}</span>
              </el-form-item>
              <el-form-item label="商品状态">
                <span>{{ props.row.goods_state | formatState}}</span>
              </el-form-item>
              <el-form-item label="添加时间">
                <span>{{ props.row.add_time | formatDate}}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.upd_time | formatDate}}</span>
              </el-form-item>
              <el-form-item label="是否是热销品">
                <template v-slot="scope">
                  <i class="p20"
                    :class="[props.row.is_promote?'el-icon-success':'el-icon-error']" 
                    :style="{color:(props.row.is_promote?'#90ee90':'#ee9090')}"></i>
                </template>
              </el-form-item>
              <el-form-item label="热销品数量">
                <span>{{ props.row.hot_mumber }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110"></el-table-column>
        <el-table-column label="商品重量(克)" prop="goods_weight" width="110"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template v-slot="scope">
            {{scope.row.add_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button class="circle-button" size="mini" type="primary" icon="el-icon-edit" @click="editDialogShow(scope.row.goods_id)">编辑</el-button>
            <el-button class="circle-button" size="mini" type="danger" icon="el-icon-delete" @click="deleteGoodsIn(scope.row.goods_id)">删除</el-button>
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
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑框 -->
    <el-dialog
     title="编辑商品信息" 
     :visible.sync="editDialogVisible" 
     width="50%" 
     @close="editDialogHide">
      <!-- 对话框-主体区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框-底部区域 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editDialogHide">取 消</el-button>
          <el-button type="primary" @click="editGoods">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'List',
  data(){
    return {
      // 商品列表
      goodsList:[],
      // 商品数目
      total: 0,
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 编辑框 是否显示
      editDialogVisible: false,
      // 编辑框 表单数据
      editForm: {},
      // 编辑框 表单验证规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getGoodsList();
  },
  filters: {
    // 时间格式化  移至 main.js 作为全局过滤器
    /* formatDate(milliSecond) {
      let date = new Date(milliSecond*1000);
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return  Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
     }, */
   
    // 价格格式化
    formatPrice(price) {
      return price + ".00"
    },
    // 状态格式化
    formatState(stateNumber) {
      return stateNumber === 0 ? '已审核' : '未审核';
    }
  },
  methods: {
    // 搜索
    clickSearch() {
      this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    /* 分页 相关 事件 */
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    /* 编辑框 */
    // 编辑框 关闭
    editDialogHide() {
      this.editDialogVisible = false;
      this.$refs.editFormRef.resetFields();
    },
    // 编辑框 显示
    editDialogShow(goods_id) {
      this.getGoods(goods_id);
      this.editDialogVisible = true;
    },
    editGoods() {
      this.putGoods(this.editForm);
    },
    deleteGoodsIn(goods_id) {
      this.deleteGoods(goods_id);
    },

    // 前往添加页
    goAddPage() {
      this.$router.push('/goods/add')
    },

    /* 网络请求 */
    // 请求 获取 商品列表
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {params: this.queryInfo});
      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 请求 根据 ID 获取 商品信息
    async getGoods(goods_id) {
      const {data: res} = await this.$http.get('goods/' + goods_id);
      if(res.meta.status !== 200) return this.$message.error('获取商品信息失败')
      this.editForm = res.data;
    },
    // 请求 编辑 商品
    putGoods(editForm) {
      // 预验证 
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.put('goods/' + editForm.goods_id, editForm);
        if(res.meta.status !== 200) {  
          console.log('编辑商品请求',res);
          return this.$message.error('编辑商品信息失败')
        };
        this.$message.success('编辑商品信息成功')
        // 获取新数据
        this.queryInfo.pagenum = 1;
        this.getGoodsList();
        this.editDialogVisible = false;
      })
    },
    // 请求 删除 商品
    async deleteGoods(goods_id) {
      const {data: res1} = await this.$http.get('goods/' + goods_id);
      if(res1.meta.status !== 200) return this.$message.error('获取商品信息失败')
      let goodsForm = res1.data;
      const confirmResult = await this.$confirm(
        '&nbsp;&nbsp;此操作将永久删除<strong style="color:red;font-size:15px;">'+ goodsForm.goods_name +'</strong>, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除商品信息')
      }
      const {data: res2} = await this.$http.delete('goods/' + goods_id);
      if(res2.meta.status !== 200) return this.$message.error('删除商品信息失败')
      this.$message.success('删除商品信息成功')
      this.getGoodsList();
    }
  }
}

</script>
<style  lang="less" scoped>
.el-table {
  font-size: 10px;
}
.demo-table-expand .el-form-item {
  width: 100%;
}
.el-table .el-form-item {
  margin-bottom: 0;
}
</style>