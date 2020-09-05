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
      // '/admin': {
      //   target: 'http://192.168.0.30:80', // 钟军：'http://192.168.0.69:81',
      //   changeOrigin: true, // 是否跨域
      //   pathRewrite: {
      //       '^/admin': ''
      //   }
      // },
      // '/zj': {
      //   target: 'http://192.168.0.69:81', // 钟军：'http://192.168.0.69:81',
      //   changeOrigin: true, // 是否跨域
      //   pathRewrite: {
      //       '^/zj': ''
      //   }
      // },
      [process.env.VUE_APP_BASE_API]: {
        // target: 'http://192.168.0.69:81',
        // target: 'http://192.168.2.39:80',
        // target: 'http://10.16.41.69:80',
        // target: 'http://192.168.45.95:8080',
        target: process.env.VUE_APP_SERVICE_URL, // 测试服
        changeOrigin: true, // 是否跨域
        pathRewrite: {
            ['^' + process.env.VUE_APP_BASE_API]: ''
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
