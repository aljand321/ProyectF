const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userP1 = Schema ({
  name: String,
  price: String,
  description: String
});

module.exports = mongoose.model('task1', userP1);
