// eslint-disable-next-line import/no-extraneous-dependencies
const { override, addLessLoader, fixBabelImports } = require('customize-cra');
// https://github.com/arackaf/customize-cra/blob/HEAD/api.md
module.exports = override(
  fixBabelImports('antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      // antd less 变量：https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
      'primary-color': '#3fd697',
      'link-color': '#3fd697',
      'border-radius-base': '4px',
      //    'hack': `true; @import "your-less-file-path.less";`, // Override with less file
    },
  })
);
