module.exports = {
  root: true,
  extends: ['react-app', 'airbnb', 'plugin:prettier/recommended'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-console': process.env.NODE_ENV === 'development' ? 'off' : 1,
  },
};
