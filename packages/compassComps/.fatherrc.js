export default {
  cjs: 'rollup',
  esm: 'rollup',
  entry: 'src/index.js',
  cssModules: true,
  doc:{
    dest:'/.docz/dist/',
    wrapper: 'src/wrapper.js',
    base:'/CUSCPS'
  },
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ],
}
