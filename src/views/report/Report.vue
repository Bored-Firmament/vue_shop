<template>
  <div class="report">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="report1" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts
import * as echarts from 'echarts'
// 导入合并对象函数
import { objectsLoop } from '@/common/utils.js'

export default {
  name:'Report',
  data() {
    return {
      option1: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        xAxis: [
          {
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {type: 'value'}
        ]
      }
    }
  },
  created() {},
  // 此时,页面上的元素,已经渲染完毕了!
  async mounted() {
    // 3.基于准备好的 dom, 初始化 echarts 实例
    let myChart1 = echarts.init(document.getElementById('report1'));
    
    const {data: res} = await this.$http.get('reports/type/1');
    if(res.meta.status !== 200) return this.$message.error('获取报表成功')
    // 4.准备数据
    let optionInfo1 = res.data;
    let data = {}
    // 合并对象
    objectsLoop(data, optionInfo1, this.option1);
    // 5.展示数据
    myChart1.setOption(data);
  },
  methods: {}
}

</script>
<style  lang="less" scoped>
</style>