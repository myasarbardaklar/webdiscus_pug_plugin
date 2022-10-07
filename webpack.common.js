const path = require('path');
const fs = require('fs');
const globule = require('globule');
const PugPlugin = require('pug-plugin');
//const PugPlugin = require('../../Phpstorm/GitHub/webpack/pug-plugin');

const outputPath = path.resolve(__dirname, 'dist');
console.log(outputPath);

const entries = {};
globule.find('src/views/*.pug').forEach((file) => {
  return Object.assign(entries, {
    [path.basename(file, '.pug')]: path.resolve(__dirname, file)
  });
});
console.log(entries);

module.exports = {
  entry: {
    /* bootstrap: path.resolve(__dirname, `src/scss/bootstrap.scss`),
    tailwind: path.resolve(__dirname, `src/scss/tailwind.scss`),
    swiper: path.resolve(__dirname, `src/scss/swiper.scss`),
    main: path.resolve(__dirname, `src/scss/main.scss`) */
    index: path.resolve(
      process.cwd(),
      `src/views/index.pug?${JSON.stringify({ title: 'Index page' })}`
    ),
    about: path.resolve(
      process.cwd(),
      `src/views/about.pug?${JSON.stringify({ title: 'About page' })}`
    )
  },
  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'js/[name].[contenthash:4].js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true
    },
    static: {
      directory: outputPath,
      watch: true
    },
    port: 1234
  },
  plugins: [
    new PugPlugin({
      verbose: true,
      modules: [
        PugPlugin.extractCss({
          // css output filename
          filename: 'css/[name].[contenthash:4].css'
        })
      ]
    })
  ],

  module: {
    rules: [
      // image loader
      {
        test: /\.(gif|png|jpe?g|ico|svg|webp)$/i,
        type: 'asset/resource', // <-- mega important!
        use: {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            // image output filename
            name: 'img/[name].[hash:8]-[width]w.[ext]',
            sizes: [320, 640, 960, 1200, 1800, 2400],
            format: 'webp',
            placeholder: true
          }
        }
      },

      // views loader
      {
        test: /\.(pug)$/,
        use: [
          // 'html-loader', // <-- it's required for the 'html' method of pug-loader
          // {
          //   loader: 'posthtml-loader' // expected pure HTML, therefore use the `html` method for pug loader and additional `html-loader`
          // },
          {
            loader: PugPlugin.loader,
            options: {
              //method: 'html' // <-- required for 'posthtml-loader', 10x slower than `render` method by serv and watch
              method: 'render', // <-- fastest render method by serv and watch
              data: {
                wImageSizes: [320, 640, 768, 1024, 1280, 1536]
              }
            }
          }
        ]
      },

      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      },

      // js loader
      {
        test: /\.js$/i,
        use: ['babel-loader'],
        exclude: /(node_modules|bower_components)/
      }
    ]
  }
};
