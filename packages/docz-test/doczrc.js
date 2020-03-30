
export default {
  plugins:[
    [
      {
        preprocessor: 'postcss',
        ruleOpts: {
          exclude: /node_modules\/.*\.css$/,
        },
        cssmodules: true,
      },
      {
        preprocessor: 'less',
        ruleOpts: {
          exclude: /node_modules\/.*\.less$/,
        },
        cssmodules: true,
        loaderOpts: {
          javascriptEnabled: true,
        },
      }
    ]
  ]
}

