module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js');

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true;
        args[0].title= 'Vue电商后台管理系统'
        return args;
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // config.devtool ='source-map';
      config.entry('app').clear().add('./src/main-dev.js')
      
      config.plugin('html').tap(args => {
        args[0].isProd = false;
        args[0].title= 'Vue电商后台管理系统'
        return args;
      })
    })
  }
}