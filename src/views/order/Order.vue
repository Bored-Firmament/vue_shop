<template>
  <div class="order">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容(但后台并接口并没有查询功能)" v-model="queryInfo.query" clearable @clear="getOrderList">
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="clickSearch"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="200"></el-table-column>
        <el-table-column label="是否付款" width="110">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status==='1'" type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="110"></el-table-column>
        <el-table-column label="下单时间" width="160">
          <template v-slot="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false">
              <el-button class="circle-button" size="mini" type="primary" icon="el-icon-edit" @click="addrDialogShow(scope.row.order_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流状态" placement="top" :enterable="false">
              <el-button class="circle-button" size="mini" type="success" icon="el-icon-location" @click="progressDialogShow(scope.row.order_id)"></el-button>
            </el-tooltip>
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

    <!-- 修改地址 对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addrDialogVisible"
      width="50%"
      @close="addrDialogHide">
      <el-form :model="addrForm" :rules="addrFormRules" ref="addrFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader
            v-model="addrForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addrForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrDialogHide">取 消</el-button>
        <el-button type="primary" @click="addrDialogHide">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息 对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="progressDialogHide">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(item, index) in expressData"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {regionData} from 'element-china-area-data';

export default {
  name:'Order',
  data(){
    return {
      // 订单列表
      orderlist: [],
      // 订单查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单总数
      total: 0,
      // 修改地址 对话框 是否显示
      addrDialogVisible: false,
      // 修改地址 表单数据
      addrForm: {
        address1: [],
        address2: '',
      },
      // 修改地址 验证规则
      addrFormRules: {
        address1: [
          { required:true, message: '请选择省市区县',trigger: 'blur' }
        ],
        address2: [
          { required:true, message: '请输入详细地址',trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData: regionData,
      // 物流信息 对话框 是否显示
      progressVisible: false,
      expressData: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {params:this.queryInfo});
      if(res.meta.status !== 200) return this.$message.error('获取订单列表失败');
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    
    // 搜索
    clickSearch() {
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    
    /* 分页 相关 事件 */
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 修改地址 对话框 显示
    addrDialogShow(id) {
      console.log(id);// 这里应该调用请求该id对应的详情数据并展示,但是API不提供地址信息,无法展示;
      this.addrDialogVisible = true;
    },
    // 修改地址 对话框 隐藏
    addrDialogHide() {
      this.addrDialogVisible = false;
      this.$refs.addrFormRef.resetFields();
    },
    // 物流信息 对话框 显示
    progressDialogShow(id) {
      console.log(id);// 这里应该调用请求该id对应的物流信息并展示,但是API不再提供了;
      this.progressVisible = true;
    },
    // 物流信息 对话框 隐藏
    progressDialogHide() {
      this.progressVisible = false;
    },
  }
}

</script>
<style  lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>