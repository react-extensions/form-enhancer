// eslint-disable-next-line import/no-extraneous-dependencies
const { override, addLessLoader } = require('customize-cra');
// https://github.com/arackaf/customize-cra/blob/HEAD/api.md
module.exports = override(addLessLoader());
