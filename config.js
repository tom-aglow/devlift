if (process.env.NODE_ENV === 'test') {
  module.exports = require('./credentials.test.json');
} else {
  module.exports = require('./credentials.json');
}
