export default {
  cjs: 'rollup',
  esm: 'rollup',
  entry: 'src/index.js',
  cssModules: true,
  doc:{
    wrapper: 'src/wrapper.js',
  },
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ],
}
