export default {
  cjs: 'rollup',
  esm: 'rollup',
  entry: 'src/index.js',
  cssModules: true,
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ],
}
