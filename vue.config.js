// 配置路径别名
var path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 配置基础链接地址，根据发布环境添加
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',
  outputDir: 'preview',
  // dev跨域问题
  devServer: {
    proxy: {
      '/admin/dev-api': { 
        target: 'http://192.168.45.95:8080',
        // target: 'http://192.168.45.95:8080', // 'http://192.168.0.30:80',   //钟军：'http://192.168.0.69:81',
        changeOrigin: true,  //是否跨域
        pathRewrite:{
            '^/admin/dev-api':''
        } 
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  assetsDir: 'static',
  filenameHashing: true, // 发布打包文件是否有哈希后缀
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#617BFF',
            'link-color': '#1DA57A',
            'border-radius-base': '2px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
