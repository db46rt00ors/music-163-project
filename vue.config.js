// vue.config.js

const path = require('path')

module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://127.0.0.1:3000',
        pathRewrite: { "^/": "" }
      }
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
}
// https://cli.vuejs.org/zh/guide/css.html#预处理器
function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/common/common.styl'),
      ],
    })
}