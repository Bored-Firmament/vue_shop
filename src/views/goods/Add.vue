<template>
  <div class="add">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签页 -->
      <el-form
       :model="addForm" 
       :rules="addFormRules" 
       ref="addFormRef" 
       label-width="100px" label-position="top">
        <el-tabs
         v-model="activeIndex" 
         :tab-position="'left'" 
         :before-leave="beforeTabLeave" 
         @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="cateChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in this.manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="itemV" v-for="(itemV,vIndex) in item.attr_vals" :key="vIndex" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in this.onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" 
              :headers="headerObj" 
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
            <el-upload
              :action="uploadURL"
              list-type="picture-card"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj" 
              :on-success="handleSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewVisible"
      width="50%" 
      @close="previewImgClose">
      <img :src="previewPath" alt="预览图片" class="previewImg"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Add',
  data(){
    return {
      activeIndex: '0',
      // 添加 表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics:[],
        // 商品的介绍
        goods_introduce: '',
        // 动态参数和静态属性组成的数组
        attrs: [],
      },
      // 添加 验证规则
      addFormRules: {
        goods_name: [
          { required:true, message: '请输入商品名称',trigger: 'blur' }
        ],
        goods_price: [
          { required:true, message: '请输入商品价格',trigger: 'blur' }
        ],
        goods_weight: [
          { required:true, message: '请输入商品重量',trigger: 'blur' }
        ],
        goods_number: [
          { required:true, message: '请输入商品数量',trigger: 'blur' }
        ],
        goods_cat: [
          { required:true, message: '请选择商品分类',trigger: 'blur' }
        ]
      },
      // 商品分类 数据
      catelist: [],
      // 级联选择器配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传图片的地址
      // uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      uploadURL: this.$http.defaults.baseURL + 'upload',
      // 图片上传组件的headers请求头对象 
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      // 预览图片对话框 是否显示
      previewVisible: false,
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      return null;
    }
  },
  methods: {
    // 获取 商品分类 列表
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data;
    },
    // 级联选择器 选择
    cateChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.info('只允许设置三级分类')
      }
    },
    // 切换 Tab标签页 之前 先判断
    beforeTabLeave(newActiveName, oldActiveName) {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) {
          return false;
        }
      })
      if(this.addForm.goods_name === '') {
        this.$message.error('请输入商品名称');
        return false;
      }
      if(this.addForm.goods_price === '') {
        this.$message.error('请输入商品价格');
        return false;
      } else if(this.addForm.goods_price == 0) {
        this.$message.error('商品价格不应该为0');
        return false;
      }
      if(this.addForm.goods_weight === '') {
        this.$message.error('请输入商品重量');
        return false;
      }
      if(this.addForm.goods_number === '') {
        this.$message.error('请输入商品数量');
        return false;
      } else if(this.addForm.goods_number == 0) {
        this.$message.error('商品数量不能为0');
        return false;
      }
      if(this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    // 点击 tab 之后
    async tabClicked() {
      if(this.activeIndex == 1) {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: { sel: 'many' }
        })
        if(res.meta.status !== 200) return this.$message.error('获取动态参数列表失败');
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',');
        })
        this.manyTableData = res.data;
      } else if(this.activeIndex == 2) {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: { sel: 'only' }
        })
        if(res.meta.status !== 200) return this.$message.error('获取静态属性列表失败');
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = "http://www.ysqorz.top:8888/" + file.response.data.tmp_path;
      this.previewVisible = true;
    },
    // 处理移除图片的操作 
    handleRemove(file) {
      // 1.获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中获取该图片的索引
      const index = this.addForm.pics.findIndex(item => item.pic === filePath);
      // 3.用splice方法删除该图片信息对象
      this.addForm.pics.splice(index, 1);
    },
    // 图片上传(临时的)成功的回调函数
    handleSuccess(response){
      // 1.处理返回的图片信息
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象,push到pics数组中
      this.addForm.pics.push(picInfo);
    },
    // 图片预览对话框 关闭
    previewImgClose() {
      this.previewPath = '';
    },
    // 添加
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        // 由于在 基本信息 页已经添加针对每一个属性的判断,理论上以下这个验证不会有机会发生
        // 另外这个验证 不适合 用在 基本信息页切换tab前触发,暂时无法得知原由.
        if(!valid) {
          return this.$message.error('请填写必要的表单项');
        }
        // 这里用深拷贝,因为不能直接用addForm提交,addForm中goods_cat展示的组件需要时数组,提交后台需要是字符串
        // 所以用深拷贝复制一个内容一样,但是不是同一个的数据对象用于提交
        let commitData = JSON.parse(JSON.stringify(this.addForm));
        commitData.goods_cat = commitData.goods_cat.join(',');
        // 提交的数据对象不仅只有addForm的数据,还有manyTableData和onlyTableData组成的attrs
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          };
          commitData.attrs.push(newInfo);
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          commitData.attrs.push(newInfo);
        })
        // 发起请求
        const {data: res} = await this.$http.post('goods', commitData);
        
        if(res.meta.status !== 201) {
          // 目前错误好像只有商品名称重复,跳回去让用户修改
          this.activeIndex = '0';
          return this.$message.error('创建商品失败:' + res.meta.msg);
        }
        this.$message.success('创建商品成功')
        this.activeIndex = '6';
        this.$nextTick(() => {
          // 这里用push而不是back是为了防止有人是在超链接访问add页的,这种情况下add成功后无法返回商品列表查看
          this.$router.push('/goods');
        })
      })
    }
  }
}

</script>
<style  lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px !important;
}
</style>