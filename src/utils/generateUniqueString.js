const {customAlphabet} = require('nanoid')

const generateUniqueString = () => {
  const nanoid = customAlphabet('0123456789abcdefghKLMNOPQRSTUVWXYZ', 5);
  return nanoid();
};

module.exports = generateUniqueString;